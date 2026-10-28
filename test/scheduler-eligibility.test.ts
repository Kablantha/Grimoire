import { describe, expect, it } from "vitest";
import { evaluateTaskEligibility } from "../src/domain/scheduler/eligibility";
import { buildContext, eligibleTasks, evaluateTasks } from "../src/domain/scheduler/scheduler-service";
import type { DayCapacity, SchedulableTask, SchedulingContext } from "../src/domain/scheduler/types";

const NOW = new Date("2026-10-28T12:00:00Z");
const FUTURE = new Date("2026-10-30T12:00:00Z");
const PAST = new Date("2026-10-26T12:00:00Z");

function makeTask(overrides: Partial<SchedulableTask> = {}): SchedulableTask {
  return {
    id: "task-1",
    title: "Task",
    status: "active",
    priority: null,
    estimatedMinutes: 30,
    energyLevel: 3,
    dueAt: null,
    earliestStartAt: null,
    academicTaskType: null,
    energyTypeNames: [],
    ...overrides,
  };
}

function makeCapacity(overrides: Partial<DayCapacity> = {}): DayCapacity {
  return {
    date: "2026-10-28",
    overallLevel: 3,
    byType: {},
    ...overrides,
  };
}

function makeContext(capacity: DayCapacity | null = makeCapacity()): SchedulingContext {
  return buildContext(NOW, capacity);
}

describe("task eligibility — state exclusions", () => {
  it("excludes completed tasks", () => {
    const result = evaluateTaskEligibility(makeTask({ status: "completed" }), makeContext());
    expect(result.status).toBe("not_ready");
    expect(result.canSchedule).toBe(false);
    expect(result.reasons.map((r) => r.code)).toContain("task_completed");
  });

  it("excludes archived tasks", () => {
    const result = evaluateTaskEligibility(makeTask({ status: "archived" }), makeContext());
    expect(result.status).toBe("not_ready");
    expect(result.canSchedule).toBe(false);
    expect(result.reasons.map((r) => r.code)).toContain("task_archived");
  });

  it("marks a task with a passed deadline infeasible", () => {
    const result = evaluateTaskEligibility(makeTask({ dueAt: PAST }), makeContext());
    expect(result.status).toBe("infeasible");
    expect(result.canSchedule).toBe(false);
    expect(result.reasons.map((r) => r.code)).toContain("deadline_passed");
  });

  it("accepts a task with a future deadline", () => {
    const result = evaluateTaskEligibility(makeTask({ dueAt: FUTURE }), makeContext());
    expect(result.status).toBe("eligible");
    expect(result.canSchedule).toBe(true);
  });
});

describe("task eligibility — missing information", () => {
  it("flags a missing duration as needing information and blocks confident scheduling", () => {
    const result = evaluateTaskEligibility(makeTask({ estimatedMinutes: null }), makeContext());
    expect(result.status).toBe("needs_information");
    expect(result.canSchedule).toBe(false);
    expect(result.reasons.map((r) => r.code)).toContain("missing_duration");
  });

  it("flags a missing energy level but still allows scheduling", () => {
    const result = evaluateTaskEligibility(makeTask({ energyLevel: null }), makeContext());
    expect(result.status).toBe("needs_information");
    expect(result.canSchedule).toBe(true);
    expect(result.reasons.map((r) => r.code)).toContain("missing_energy");
  });

  it("flags when no capacity has been recorded for the day", () => {
    const result = evaluateTaskEligibility(makeTask(), makeContext(null));
    expect(result.reasons.map((r) => r.code)).toContain("no_capacity_recorded");
    expect(result.canSchedule).toBe(true);
  });

  it("accepts a title-only task without inventing values", () => {
    const result = evaluateTaskEligibility(
      makeTask({ estimatedMinutes: null, energyLevel: null, dueAt: null }),
      makeContext(null),
    );
    expect(result.canSchedule).toBe(false);
    const codes = result.reasons.map((r) => r.code);
    expect(codes).toContain("missing_duration");
    expect(codes).toContain("missing_energy");
    expect(codes).toContain("no_capacity_recorded");
  });
});

describe("task eligibility — energy matching", () => {
  it("reports a comfortable match when capacity meets the requirement", () => {
    const result = evaluateTaskEligibility(
      makeTask({ energyLevel: 3 }),
      makeContext(makeCapacity({ overallLevel: 4 })),
    );
    expect(result.status).toBe("eligible");
    expect(result.reasons.map((r) => r.code)).toContain("fits");
  });

  it("surfaces, but does not block, an imperfect energy match (ENERGY-002)", () => {
    const result = evaluateTaskEligibility(
      makeTask({ energyLevel: 4 }),
      makeContext(makeCapacity({ overallLevel: 2 })),
    );
    expect(result.status).toBe("not_ready");
    expect(result.canSchedule).toBe(true);
    expect(result.reasons.map((r) => r.code)).toContain("capacity_below_energy");
  });

  it("prefers a better energy match across days (ENERGY-001)", () => {
    const task = makeTask({ energyLevel: 4 });
    const goodDay = evaluateTaskEligibility(task, makeContext(makeCapacity({ overallLevel: 4 })));
    const weakDay = evaluateTaskEligibility(task, makeContext(makeCapacity({ overallLevel: 2 })));

    expect(goodDay.status).toBe("eligible");
    expect(weakDay.reasons.map((r) => r.code)).toContain("capacity_below_energy");
  });
});

describe("task eligibility — energy type capacity", () => {
  it("detects a shortfall in a required energy type", () => {
    const result = evaluateTaskEligibility(
      makeTask({ energyLevel: 4, energyTypeNames: ["Mental", "Social"] }),
      makeContext(makeCapacity({ overallLevel: 4, byType: { Mental: 4, Social: 2 } })),
    );
    const shortfall = result.reasons.find((r) => r.code === "energy_type_shortfall");
    expect(shortfall).toBeDefined();
    expect(shortfall?.energyTypeNames).toEqual(["Social"]);
  });

  it("does not flag types at or above the required level", () => {
    const result = evaluateTaskEligibility(
      makeTask({ energyLevel: 3, energyTypeNames: ["Mental"] }),
      makeContext(makeCapacity({ overallLevel: 3, byType: { Mental: 3 } })),
    );
    expect(result.reasons.map((r) => r.code)).not.toContain("energy_type_shortfall");
  });

  it("ignores energy types with no recorded capacity", () => {
    const result = evaluateTaskEligibility(
      makeTask({ energyLevel: 5, energyTypeNames: ["Creative"] }),
      makeContext(makeCapacity({ overallLevel: 5, byType: {} })),
    );
    expect(result.reasons.map((r) => r.code)).not.toContain("energy_type_shortfall");
  });
});

describe("scheduler service", () => {
  it("evaluates many tasks and returns one result each", () => {
    const tasks = [
      makeTask({ id: "a", status: "completed" }),
      makeTask({ id: "b" }),
      makeTask({ id: "c", estimatedMinutes: null }),
    ];
    const results = evaluateTasks(tasks, makeContext());
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.taskId)).toEqual(["a", "b", "c"]);
  });

  it("eligibleTasks filters out non-schedulable tasks", () => {
    const tasks = [
      makeTask({ id: "done", status: "completed" }),
      makeTask({ id: "archived", status: "archived" }),
      makeTask({ id: "past", dueAt: PAST }),
      makeTask({ id: "ready" }),
      makeTask({ id: "unknown-duration", estimatedMinutes: null }),
    ];
    const eligible = eligibleTasks(tasks, makeContext());
    expect(eligible.map((r) => r.taskId)).toEqual(["ready"]);
  });

  it("is deterministic for identical inputs", () => {
    const task = makeTask({ energyLevel: 4, energyTypeNames: ["Mental"] });
    const context = makeContext(makeCapacity({ overallLevel: 2, byType: { Mental: 1 } }));
    expect(evaluateTaskEligibility(task, context)).toEqual(evaluateTaskEligibility(task, context));
  });
});
