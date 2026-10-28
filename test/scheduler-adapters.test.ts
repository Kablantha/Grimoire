import { describe, expect, it } from "vitest";
import { toDayCapacity } from "../src/domain/scheduler/adapters";
import type { DailyCapacityRecord } from "../src/lib/capacity/capacity-repository";

function makeRecord(
  entries: { name: string; level: number }[],
): DailyCapacityRecord {
  return {
    id: "cap-1",
    userId: "user-1",
    date: "2026-10-28",
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    energyTypes: entries.map((entry) => ({
      level: entry.level,
      energyType: { id: `id-${entry.name}`, name: entry.name, sortOrder: 0 },
    })),
  } as unknown as DailyCapacityRecord;
}

describe("scheduler adapters", () => {
  it("maps a recorded day into per-type levels and an overall mean", () => {
    const capacity = toDayCapacity(
      makeRecord([
        { name: "Mental", level: 2 },
        { name: "Physical", level: 4 },
      ]),
    );

    expect(capacity?.date).toBe("2026-10-28");
    expect(capacity?.byType).toEqual({ Mental: 2, Physical: 4 });
    expect(capacity?.overallLevel).toBe(3);
  });

  it("returns null when no capacity was recorded", () => {
    expect(toDayCapacity(null)).toBeNull();
  });

  it("reports a null overall level when no types were recorded", () => {
    const capacity = toDayCapacity(makeRecord([]));
    expect(capacity?.overallLevel).toBeNull();
    expect(capacity?.byType).toEqual({});
  });
});
