// @vitest-environment node

import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { DailyCapacityInputSchema } from "../src/domain/capacity/capacity-input";
import {
  CapacityEnergyTypeError,
  getDailyCapacity,
  listDailyCapacities,
  upsertDailyCapacity,
} from "../src/lib/capacity/capacity-repository";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for capacity integration tests.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
let userId: string;
let energyTypeIds: Record<string, string>;

beforeAll(async () => prisma.$connect());
beforeEach(async () => {
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "Phase 5 test user",
      energyTypes: {
        create: [
          { name: "Mental", sortOrder: 0, isDefault: true },
          { name: "Social", sortOrder: 1, isDefault: true },
          { name: "Physical", sortOrder: 2, isDefault: true },
        ],
      },
    },
    include: { energyTypes: true },
  });
  userId = user.id;
  energyTypeIds = Object.fromEntries(user.energyTypes.map((type) => [type.name, type.id]));
});
afterEach(async () => {
  if (userId) await prisma.user.deleteMany({ where: { id: userId } });
});
afterAll(async () => prisma.$disconnect());

describe("capacity repository", () => {
  it("records capacity for each energy type with an optional note", async () => {
    const record = await upsertDailyCapacity(
      prisma,
      userId,
      DailyCapacityInputSchema.parse({
        date: "2026-10-28",
        notes: "Bad sleep.",
        capacities: {
          [energyTypeIds.Mental]: 2,
          [energyTypeIds.Physical]: 4,
          [energyTypeIds.Social]: 1,
        },
      }),
    );

    const levels = Object.fromEntries(record.energyTypes.map((entry) => [entry.energyType.name, entry.level]));
    expect(levels).toEqual({ Mental: 2, Physical: 4, Social: 1 });
    expect(record.notes).toBe("Bad sleep.");
    expect(record.date).toBe("2026-10-28");
  });

  it("persists capacity and reads it back for the day", async () => {
    await upsertDailyCapacity(
      prisma,
      userId,
      DailyCapacityInputSchema.parse({
        date: "2026-10-28",
        capacities: { [energyTypeIds.Mental]: 3 },
      }),
    );

    const fetched = await getDailyCapacity(prisma, userId, "2026-10-28");
    expect(fetched).not.toBeNull();
    expect(fetched?.energyTypes).toHaveLength(1);
    expect(fetched?.energyTypes[0].level).toBe(3);
    expect(fetched?.notes).toBeNull();
  });

  it("updates an existing day rather than creating a duplicate", async () => {
    await upsertDailyCapacity(
      prisma,
      userId,
      DailyCapacityInputSchema.parse({
        date: "2026-10-28",
        notes: "Morning check-in",
        capacities: { [energyTypeIds.Mental]: 4, [energyTypeIds.Social]: 3 },
      }),
    );

    const updated = await upsertDailyCapacity(
      prisma,
      userId,
      DailyCapacityInputSchema.parse({
        date: "2026-10-28",
        notes: "Long work shift.",
        capacities: { [energyTypeIds.Mental]: 2 },
      }),
    );

    const all = await listDailyCapacities(prisma, userId);
    expect(all.filter((record) => record.date === "2026-10-28")).toHaveLength(1);

    const levels = Object.fromEntries(updated.energyTypes.map((entry) => [entry.energyType.name, entry.level]));
    expect(levels).toEqual({ Mental: 2 });
    expect(updated.notes).toBe("Long work shift.");
  });

  it("lists recent days newest-first for history", async () => {
    for (const date of ["2026-10-26", "2026-10-27", "2026-10-28"]) {
      await upsertDailyCapacity(
        prisma,
        userId,
        DailyCapacityInputSchema.parse({ date, capacities: { [energyTypeIds.Mental]: 3 } }),
      );
    }
    const recent = await listDailyCapacities(prisma, userId);
    expect(recent.map((record) => record.date)).toEqual(["2026-10-28", "2026-10-27", "2026-10-26"]);
  });

  it("rejects an energy type that does not belong to the user", async () => {
    const otherUser = await prisma.user.create({
      data: { id: randomUUID(), energyTypes: { create: [{ name: "Mental", sortOrder: 0 }] } },
      include: { energyTypes: true },
    });

    await expect(
      upsertDailyCapacity(
        prisma,
        userId,
        DailyCapacityInputSchema.parse({
          date: "2026-10-28",
          capacities: { [otherUser.energyTypes[0].id]: 3 },
        }),
      ),
    ).rejects.toBeInstanceOf(CapacityEnergyTypeError);

    await prisma.user.delete({ where: { id: otherUser.id } });
  });

  it("rejects a disabled energy type", async () => {
    await prisma.energyType.update({ where: { id: energyTypeIds.Social }, data: { enabled: false } });

    await expect(
      upsertDailyCapacity(
        prisma,
        userId,
        DailyCapacityInputSchema.parse({
          date: "2026-10-28",
          capacities: { [energyTypeIds.Social]: 2 },
        }),
      ),
    ).rejects.toBeInstanceOf(CapacityEnergyTypeError);
  });
});
