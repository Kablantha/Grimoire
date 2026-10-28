import type { TaskEligibility } from "./eligibility-result";
import type { SchedulableTask, SchedulingContext } from "./types";
import {
  checkArchived,
  checkCapacityBelowEnergy,
  checkCompleted,
  checkDeadline,
  checkEnergyTypeShortfall,
  checkMissingDuration,
  checkMissingEnergy,
  checkNoCapacity,
  checkPrerequisites,
} from "./rules";

/**
 * Evaluates whether a single task can fit on the day described by the context.
 *
 * This answers "Can this task fit?" — not "Should this task be scheduled?"
 * Prioritization and plan construction are deliberately out of scope for the
 * scheduler foundation.
 *
 * Hard exclusions (completed, archived, past deadline) make a task infeasible.
 * Missing information and capacity mismatches are surfaced as structured
 * reasons without inventing data, per SCHEDULER_SPEC sections 28 and 29.
 */
export function evaluateTaskEligibility(
  task: SchedulableTask,
  context: SchedulingContext,
): TaskEligibility {
  // Hard exclusions: these make the task non-schedulable regardless of fit.
  // An incomplete hard prerequisite is not a fit problem — the task simply
  // cannot begin yet (DEP-001).
  const exclusionReasons = [
    checkCompleted(task),
    checkArchived(task),
    checkDeadline(task, context),
    checkPrerequisites(task, context),
  ].filter((reason) => reason !== null);

  if (exclusionReasons.length > 0) {
    return {
      taskId: task.id,
      status: checkDeadline(task, context) ? "infeasible" : "not_ready",
      reasons: exclusionReasons,
      canSchedule: false,
    };
  }

  // Missing-information signals: the task may be schedulable in principle but
  // cannot be honestly evaluated for fit without more data.
  const infoReasons = [checkMissingDuration(task), checkMissingEnergy(task)].filter(
    (reason) => reason !== null,
  );

  const capacity = context.capacity;
  const capacityReasons = [
    checkNoCapacity(capacity),
    ...(capacity
      ? [checkCapacityBelowEnergy(task, capacity), checkEnergyTypeShortfall(task, capacity)]
      : []),
  ].filter((reason) => reason !== null);

  const reasons = [...infoReasons, ...capacityReasons];

  if (reasons.length === 0) {
    return { taskId: task.id, status: "eligible", reasons: [{ code: "fits" }], canSchedule: true };
  }

  // Missing duration prevents an honest fit evaluation, so we cannot
  // confidently schedule. Energy mismatch is a fit signal, not a prohibition
  // (ENERGY-002): the task may still be placed, we just surface the mismatch.
  const canSchedule = checkMissingDuration(task) === null;

  return {
    taskId: task.id,
    status: infoReasons.length > 0 ? "needs_information" : "not_ready",
    reasons,
    canSchedule,
  };
}
