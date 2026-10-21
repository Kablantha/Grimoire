// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { CreateTaskInputSchema } from "../src/domain/task/create-task-input";

describe("CreateTaskInputSchema", () => {
  it("accepts title-only task input", () => {
    expect(CreateTaskInputSchema.safeParse({ title: "Read chapter" }).success).toBe(true);
  });

  it("accepts missing optional planning values", () => {
    expect(
      CreateTaskInputSchema.safeParse({ title: "Read chapter" }).success,
    ).toBe(true);
  });

  it.each(["", "   ", "\n\t"])('rejects blank title "%s"', (title) => {
    expect(CreateTaskInputSchema.safeParse({ title }).success).toBe(false);
  });

  it.each([0, 6, -1, 2.5])("rejects invalid energy level %s", (energyLevel) => {
    expect(
      CreateTaskInputSchema.safeParse({ title: "Read chapter", energyLevel })
        .success,
    ).toBe(false);
  });

  it("accepts energy levels from 1 through 5", () => {
    for (const energyLevel of [1, 2, 3, 4, 5]) {
      expect(
        CreateTaskInputSchema.safeParse({ title: "Read chapter", energyLevel })
          .success,
      ).toBe(true);
    }
  });

  it("rejects a negative estimated duration", () => {
    expect(
      CreateTaskInputSchema.safeParse({
        title: "Read chapter",
        estimatedMinutes: -1,
      }).success,
    ).toBe(false);
  });
});