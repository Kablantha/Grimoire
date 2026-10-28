import type { AcademicTaskType, TaskPriority, TaskStatus } from "../../generated/prisma/enums";

/**
 * The scheduling-relevant view of a task. This is a plain data shape so the
 * scheduler foundation can be evaluated deterministically and tested without a
 * database or React. It deliberately mirrors only the fields scheduling needs.
 */
export type SchedulableTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority | null;
  estimatedMinutes: number | null;
  energyLevel: number | null;
  dueAt: Date | null;
  earliestStartAt: Date | null;
  academicTaskType: AcademicTaskType | null;
  /** Names of the energy types this task draws on (e.g. "Mental", "Social"). */
  energyTypeNames: string[];
};

/**
 * The scheduling-relevant capacity for one calendar day. Derived from the
 * user's recorded daily capacity (Phase 5) but kept as a plain input so the
 * scheduler never queries persistence directly.
 */
export type DayCapacity = {
  /** Calendar day in `yyyy-mm-dd` form. */
  date: string;
  /** Overall reported level for the day (1-5), if the user recorded one. */
  overallLevel: number | null;
  /** Per-energy-type levels keyed by energy type name. */
  byType: Record<string, number>;
};

/** Everything the eligibility engine needs about "right now" / a given day. */
export type SchedulingContext = {
  /** The instant evaluation happens against (for deadline/overdue reasoning). */
  now: Date;
  /** The capacity for the day being evaluated, if any has been recorded. */
  capacity: DayCapacity | null;
};
