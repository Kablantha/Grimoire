/**
 * The structured result of evaluating one task against scheduling constraints.
 *
 * These statuses are domain results, not errors. "This task cannot be
 * scheduled right now" is a valid, expected outcome — see SCHEDULER_SPEC
 * section 42.
 */
export type SchedulingStatus =
  | "eligible"
  | "not_ready"
  | "needs_information"
  | "infeasible";

/**
 * A single machine-readable reason a task evaluated the way it did. Kept
 * structured (not prose) so the presentation layer can phrase it later and so
 * scheduling decisions stay explainable.
 */
export type SchedulingReasonCode =
  | "task_completed"
  | "task_archived"
  | "deadline_passed"
  | "prerequisite_incomplete"
  | "missing_duration"
  | "missing_energy"
  | "no_capacity_recorded"
  | "capacity_below_energy"
  | "energy_type_shortfall"
  | "fits";

export type SchedulingReason = {
  code: SchedulingReasonCode;
  /** Energy type names relevant to the reason, when applicable. */
  energyTypeNames?: string[];
  /** Prerequisite task IDs relevant to the reason, when applicable. */
  prerequisiteTaskIds?: string[];
};

export type TaskEligibility = {
  taskId: string;
  status: SchedulingStatus;
  reasons: SchedulingReason[];
  /**
   * True when the task could be placed on the evaluated day even if the match
   * is imperfect. Per SCHEDULER_SPEC section 9, energy is a fit signal, not an
   * absolute eligibility threshold.
   */
  canSchedule: boolean;
};
