import { describe, expect, it } from "vitest";
import { DailyCapacityInputSchema } from "../src/domain/capacity/capacity-input";
import { formatDayLabel, isValidDayString, todayDayString } from "../src/domain/capacity/day-key";

const TYPE_A = "00000000-0000-4000-8000-0000000000a1";
const TYPE_B = "00000000-0000-4000-8000-0000000000b2";

describe("day-key utilities", () => {
  it("accepts real calendar days and rejects impossible ones", () => {
    expect(isValidDayString("2026-10-28")).toBe(true);
    expect(isValidDayString("2026-02-29")).toBe(false);
    expect(isValidDayString("2026-13-01")).toBe(false);
    expect(isValidDayString("10-28-2026")).toBe(false);
    expect(isValidDayString("")).toBe(false);
  });

  it("formats a day label for the user's timezone", () => {
    expect(formatDayLabel("2026-10-28", "UTC")).toContain("Oct");
    expect(formatDayLabel("not-a-day", "UTC")).toBe("not-a-day");
  });

  it("produces a yyyy-mm-dd day for a timezone", () => {
    expect(todayDayString("UTC", new Date("2026-10-28T12:00:00Z"))).toBe("2026-10-28");
  });
});

describe("DailyCapacityInputSchema", () => {
  it("accepts a full capacity record with optional notes", () => {
    const parsed = DailyCapacityInputSchema.parse({
      date: "2026-10-28",
      notes: "Bad sleep.",
      capacities: { [TYPE_A]: 2, [TYPE_B]: 4 },
    });
    expect(parsed.capacities).toEqual({ [TYPE_A]: 2, [TYPE_B]: 4 });
    expect(parsed.notes).toBe("Bad sleep.");
  });

  it("allows notes to be omitted or blank", () => {
    const parsed = DailyCapacityInputSchema.parse({
      date: "2026-10-28",
      notes: "",
      capacities: { [TYPE_A]: 3 },
    });
    expect(parsed.notes).toBeNull();
  });

  it("requires at least one energy type capacity", () => {
    const result = DailyCapacityInputSchema.safeParse({
      date: "2026-10-28",
      capacities: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects capacity values outside the 1-5 scale", () => {
    for (const level of [0, 6, -1]) {
      const result = DailyCapacityInputSchema.safeParse({
        date: "2026-10-28",
        capacities: { [TYPE_A]: level },
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects non-integer capacity values", () => {
    const result = DailyCapacityInputSchema.safeParse({
      date: "2026-10-28",
      capacities: { [TYPE_A]: 2.5 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid day", () => {
    const result = DailyCapacityInputSchema.safeParse({
      date: "2026-02-30",
      capacities: { [TYPE_A]: 3 },
    });
    expect(result.success).toBe(false);
  });
});
