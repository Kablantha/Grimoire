import type { TaskEligibility } from "./eligibility-result";
import { evaluateTaskEligibility } from "./eligibility";
import type { DayCapacity, SchedulableTask, SchedulingContext } from "./types";
import type { TaskStatus } from "../../generated/prisma/enums";

/**
 * The scheduler service is the single entry point for scheduling evaluation.
 * It is pure domain logic: callers supply plain task/capacity inputs and
 * receive structured results. Persistence and React stay outside this layer so
 * the rules remain deterministic and independently testable.
 *
 * This phase answers "Can this task fit?" Plan construction, ranking, and
 * recommendations are intentionally not part of this service yet.
 */
export function evaluateTask(
  task: SchedulableTask,
  context: SchedulingContext,
): TaskEligibility {
  return evaluateTaskEligibility(task, context);
}

export function evaluateTasks(
  tasks: SchedulableTask[],
  context: SchedulingContext,
): TaskEligibility[] {
  return tasks.map((task) => evaluateTaskEligibility(task, context));
}

/** Tasks that are not excluded from scheduling (i.e. not completed/archived/past due). */
export function eligibleTasks(
  tasks: SchedulableTask[],
  context: SchedulingContext,
): TaskEligibility[] {
  return evaluateTasks(tasks, context).filter((result) => result.canSchedule);
}

export function buildContext(
  now: Date,
  capacity: DayCapacity | null,
  taskStatuses: Record<string, TaskStatus> = {},
): SchedulingContext {
  return { now, capacity, taskStatuses };
}

/** Builds the status lookup the eligibility engine needs from a task list. */
export function taskStatusesOf(tasks: SchedulableTask[]): Record<string, TaskStatus> {
  return Object.fromEntries(tasks.map((task) => [task.id, task.status]));
}
