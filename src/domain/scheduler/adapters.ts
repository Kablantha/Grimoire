import type { DailyCapacityRecord } from "../../lib/capacity/capacity-repository";
import type { TaskRecord } from "../../lib/tasks/task-repository";
import type { DayCapacity, SchedulableTask } from "./types";

/**
 * Adapts persisted records into the scheduler's plain input shapes. This is
 * the only place the scheduler foundation touches persistence types, keeping
 * the rules and service free of Prisma and database concerns.
 */

export function toSchedulableTask(task: TaskRecord): SchedulableTask {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    estimatedMinutes: task.estimatedMinutes,
    energyLevel: task.energyLevel,
    dueAt: task.dueAt,
    earliestStartAt: task.earliestStartAt,
    academicTaskType: task.academicTaskType,
    energyTypeNames: task.energyTypes.map((entry) => entry.energyType.name),
    // dependentLinks are the edges where this task is the dependent, i.e. its
    // prerequisites (things that must finish first).
    hardPrerequisiteIds: task.dependentLinks
      .filter((link) => link.type === "hard")
      .map((link) => link.prerequisiteTask.id),
  };
}

export function toDayCapacity(record: DailyCapacityRecord | null): DayCapacity | null {
  if (!record) return null;

  const byType: Record<string, number> = {};
  let total = 0;
  for (const entry of record.energyTypes) {
    byType[entry.energyType.name] = entry.level;
    total += entry.level;
  }

  return {
    date: record.date,
    // The day's overall level is the mean of the recorded per-type levels.
    // This is a simple, transparent summary, not a precise currency.
    overallLevel: record.energyTypes.length > 0
      ? Math.round(total / record.energyTypes.length)
      : null,
    byType,
  };
}
