import type { Prisma, PrismaClient } from "../../generated/prisma/client";
import type { DailyCapacityInput } from "../../domain/capacity/capacity-input";

const capacityInclude = {
  energyTypes: {
    select: {
      level: true,
      energyType: { select: { id: true, name: true, sortOrder: true } },
    },
  },
} satisfies Prisma.DailyCapacityInclude;

export type DailyCapacityRecord = Prisma.DailyCapacityGetPayload<{
  include: typeof capacityInclude;
}>;

export class CapacityEnergyTypeError extends Error {
  constructor() {
    super("One or more of those energy types is no longer available.");
    this.name = "CapacityEnergyTypeError";
  }
}

async function validateEnergyTypes(
  client: PrismaClient,
  userId: string,
  energyTypeIds: string[],
) {
  if (energyTypeIds.length === 0) return;
  const found = await client.energyType.count({
    where: { userId, enabled: true, id: { in: energyTypeIds } },
  });
  if (found !== energyTypeIds.length) throw new CapacityEnergyTypeError();
}

/**
 * Creates or replaces the capacity record for one calendar day. One record
 * exists per user per day; saving again for the same day updates it and
 * replaces its per-type levels.
 */
export async function upsertDailyCapacity(
  client: PrismaClient,
  userId: string,
  input: DailyCapacityInput,
): Promise<DailyCapacityRecord> {
  const energyTypeIds = Object.keys(input.capacities);
  await validateEnergyTypes(client, userId, energyTypeIds);

  const entries = Object.entries(input.capacities).map(([energyTypeId, level]) => ({
    energyTypeId,
    level,
  }));

  return client.$transaction(async (tx) => {
    const existing = await tx.dailyCapacity.findUnique({
      where: { userId_date: { userId, date: input.date } },
      select: { id: true },
    });

    if (existing) {
      await tx.energyTypeCapacity.deleteMany({
        where: { dailyCapacityId: existing.id },
      });
      await tx.dailyCapacity.update({
        where: { id: existing.id },
        data: { notes: input.notes ?? null },
      });
      await tx.energyTypeCapacity.createMany({
        data: entries.map((entry) => ({ ...entry, dailyCapacityId: existing.id })),
      });
      return tx.dailyCapacity.findUniqueOrThrow({
        where: { id: existing.id },
        include: capacityInclude,
      });
    }

    return tx.dailyCapacity.create({
      data: {
        userId,
        date: input.date,
        notes: input.notes ?? null,
        energyTypes: { create: entries },
      },
      include: capacityInclude,
    });
  });
}

export async function getDailyCapacity(
  client: PrismaClient,
  userId: string,
  date: string,
): Promise<DailyCapacityRecord | null> {
  return client.dailyCapacity.findUnique({
    where: { userId_date: { userId, date } },
    include: capacityInclude,
  });
}

export async function listDailyCapacities(
  client: PrismaClient,
  userId: string,
  limit = 14,
): Promise<DailyCapacityRecord[]> {
  return client.dailyCapacity.findMany({
    where: { userId },
    include: capacityInclude,
    orderBy: { date: "desc" },
    take: limit,
  });
}
