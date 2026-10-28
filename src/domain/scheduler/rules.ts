import type { DayCapacity, SchedulableTask, SchedulingContext } from "./types";
import type { SchedulingReason } from "./eligibility-result";

/**
 * Individual, composable scheduling rules. Each rule inspects one constraint
 * and returns a reason when that constraint is violated or noteworthy, or null
 * when the constraint is satisfied. Rules are pure functions so the scheduler
 * foundation stays deterministic and testable.
 */

/** Completed tasks are never eligible for scheduling. */
export function checkCompleted(task: SchedulableTask): SchedulingReason | null {
  return task.status === "completed" ? { code: "task_completed" } : null;
}

/** Archived tasks are never eligible for scheduling. */
export function checkArchived(task: SchedulableTask): SchedulingReason | null {
  return task.status === "archived" ? { code: "task_archived" } : null;
}

/** A deadline that has already passed makes the task infeasible as-is. */
export function checkDeadline(
  task: SchedulableTask,
  context: SchedulingContext,
): SchedulingReason | null {
  if (task.dueAt && task.dueAt.getTime() < context.now.getTime()) {
    return { code: "deadline_passed" };
  }
  return null;
}

/**
 * A task with one or more incomplete hard prerequisites is not eligible to be
 * scheduled (SCHEDULER_SPEC DEP-001). The prerequisite must be completed
 * first. This is a hard exclusion.
 */
export function checkPrerequisites(
  task: SchedulableTask,
  context: SchedulingContext,
): SchedulingReason | null {
  const incomplete = task.hardPrerequisiteIds.filter(
    (id) => context.taskStatuses[id] !== "completed",
  );
  return incomplete.length > 0
    ? { code: "prerequisite_incomplete", prerequisiteTaskIds: incomplete }
    : null;
}

/**
 * A task with a deadline but no estimated duration cannot be honestly
 * evaluated for fit. Per SCHEDULER_SPEC section 28, unknown duration is
 * missing data, not zero.
 */
export function checkMissingDuration(task: SchedulableTask): SchedulingReason | null {
  return task.estimatedMinutes === null ? { code: "missing_duration" } : null;
}

/**
 * A task without an energy level remains valid, but energy matching cannot
 * run. Per SCHEDULER_SPEC section 29, unknown energy is not assumed to be any
 * particular value.
 */
export function checkMissingEnergy(task: SchedulableTask): SchedulingReason | null {
  return task.energyLevel === null ? { code: "missing_energy" } : null;
}

/** No recorded capacity for the day means energy fit cannot be evaluated. */
export function checkNoCapacity(capacity: DayCapacity | null): SchedulingReason | null {
  return capacity === null ? { code: "no_capacity_recorded" } : null;
}

/**
 * Whether the day's overall level is below the task's energy requirement.
 * This is a softer placement signal, not a prohibition (see ENERGY-002).
 */
export function checkCapacityBelowEnergy(
  task: SchedulableTask,
  capacity: DayCapacity,
): SchedulingReason | null {
  if (task.energyLevel === null || capacity.overallLevel === null) return null;
  return capacity.overallLevel < task.energyLevel
    ? { code: "capacity_below_energy" }
    : null;
}

/**
 * Whether any energy type the task draws on is recorded lower than the task's
 * energy level today. Energy types are a secondary fit signal and are never
 * treated as exact currencies (SCHEDULER_SPEC section 10).
 */
export function checkEnergyTypeShortfall(
  task: SchedulableTask,
  capacity: DayCapacity,
): SchedulingReason | null {
  if (task.energyLevel === null) return null;
  const shortfalls = task.energyTypeNames.filter((name) => {
    const level = capacity.byType[name];
    return level !== undefined && level < task.energyLevel!;
  });
  return shortfalls.length > 0
    ? { code: "energy_type_shortfall", energyTypeNames: shortfalls }
    : null;
}
