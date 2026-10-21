# Energy Planner
## Scheduling Specification

## 1. Purpose

This document defines the expected behavior of the Energy Planner scheduling
engine.

The scheduler's job is to answer:

> Given what the user needs to do, when it needs to happen, the energy they
> expect to have, and the life already happening around them, what is a
> realistic plan?

Its objective is NOT:

> Put every unfinished task somewhere.

A valid scheduling result may be:

> This work does not realistically fit.

That is a successful calculation, not an application error.

The scheduler must remain:

- deterministic where possible
- independently testable
- explainable
- respectful of user decisions
- honest about uncertainty
- conservative about available capacity

Scheduling business logic must remain separate from React presentation
components.

---

# 2. Core Scheduling Principles

## SCHED-001: User decisions outrank optimization

When a user deliberately schedules or moves a task, preserve that decision
whenever possible.

An algorithmically "better" placement is not sufficient reason to override
the user.

## SCHED-002: Hard dependencies are mandatory constraints

If Task B requires Task A, automatic scheduling cannot place B before A can
reasonably be completed.

## SCHED-003: Deadlines are constraints, not productivity scores

Approaching deadlines require the scheduler to protect enough capacity for
necessary work.

Do not implement deadline handling by merely creating an increasingly large
urgency score.

## SCHED-004: Energy and time are separate signals

Having three free hours does not automatically mean a user can complete a
three-hour Energy-5 task.

Likewise, low expected energy does not necessarily prohibit an important task
when no better realistic opportunity exists.

## SCHED-005: Life commitments consume real capacity

Classes, work, appointments, therapy, recurring responsibilities, chores,
and other commitments must influence flexible scheduling.

## SCHED-006: Capacity is intentionally underfilled

Protected capacity is a deliberate feature.

Do not optimize for 100% utilization.

## SCHED-007: Lower-priority optional work must not displace necessary work

Could Do and Whenever tasks should use genuinely comfortable remaining
capacity.

## SCHED-008: Impossible plans remain impossible

The scheduler must not make an infeasible workload appear feasible by
violating constraints.

## SCHED-009: Automation must be explainable

Automatic placement must retain enough structured reasoning to explain the
decision in plain language.

## SCHED-010: Replanning minimizes disruption

When circumstances change, preserve as much of the existing workable schedule
as reasonably possible.

A small change should generally result in a small replan.

---

# 3. Planning Horizons

## Primary Planning Horizon

The initial active planning horizon is:

7 days

This drives the Today and Week experiences.

## Deadline Awareness Horizon

The scheduler should also look ahead approximately:

30 days

This allows it to recognize large upcoming tasks whose prerequisite work may
need to begin before they enter the main seven-day planning window.

These values may eventually become configurable.

---

# 4. Scheduling Inputs

The scheduler may receive information including:

## User information

- timezone
- planning style
- typical energy patterns
- current reported energy

## Tasks

- status
- priority
- estimated duration
- energy requirement
- energy types
- deadline
- earliest start
- dependencies
- recurrence
- manual scheduling state
- minimum variants

## Commitments

- start
- end
- energy requirement
- energy types
- recurrence
- flexibility

## Existing schedule

- automatic placements
- manual placements
- user locks
- previously generated scheduling reasons

## Historical recommendations

Only accepted recommendations should modify normal scheduler inputs.

Pending or rejected recommendations must not silently alter scheduling.

---

# 5. Basic Scheduling

## BASIC-001: Straightforward Placement

GIVEN:

Monday:
- Energy 3
- 120 flexible minutes

Task A:
- 45 minutes
- Energy 2
- Must Do
- Due Monday

Task B:
- 30 minutes
- Energy 2
- Should Do
- Due Wednesday

WHEN:

Monday is planned.

THEN:

Both tasks may be scheduled Monday if doing so remains within protected
capacity.

Task A should precede Task B because its deadline is earlier and its priority
is greater.

---

## BASIC-002: Do Not Fill Space Needlessly

GIVEN:

Monday:
- Energy 3
- 180 flexible minutes
- Balanced planning style

Required work:
- 60 minutes total

WHEN:

Monday is planned.

THEN:

Scheduling only the required 60 minutes is valid.

The scheduler must not search the entire backlog merely to consume the
remaining clock time.

Open capacity is an acceptable scheduling result.

---

# 6. Deadline Planning

Deadline planning must look ahead.

Low current energy must not result in repeatedly postponing consequential
work until it becomes impossible.

## DEAD-001: Protect Future Capacity

GIVEN:

Research Paper:
- 240 minutes remaining
- Due Friday

Expected energy:
- Monday: 4
- Tuesday: 3
- Wednesday: 2
- Thursday: 4

WHEN:

The week is planned.

THEN:

The scheduler should distribute appropriate paper work before Friday.

It should not simply wait until Thursday because Thursday has the highest
remaining energy value.

The scheduler must protect sufficient future capacity as the deadline
approaches.

---

## DEAD-002: Low-Energy Day Before Deadline

GIVEN:

Assignment:
- 60 minutes
- Energy 3
- Due tomorrow

Today:
- Energy 1

WHEN:

Today is replanned.

THEN:

The scheduler first evaluates tomorrow's realistic pre-deadline capacity.

IF tomorrow comfortably accommodates the assignment:

Preserve today's low capacity when practical.

IF tomorrow cannot realistically accommodate the assignment:

Trigger Deadline Intervention.

The scheduler must not automatically force an Energy-3 task onto an Energy-1
day merely because the deadline is close.

---

# 7. Dependencies

## DEP-001: Hard Dependency

GIVEN:

Task A:
Read Chapter

Task B:
Write Response

Task B has a hard dependency on Task A.

Task B is due Wednesday.

THEN:

Task A must be scheduled with enough time for completion before Task B can
reasonably begin.

The following schedule is invalid:

Monday:
Write Response

Tuesday:
Read Chapter

---

## DEP-002: Soft Dependency

GIVEN:

Review Notes

soft dependency before:

Study for Exam

THEN:

Prefer Review Notes before Study for Exam.

IF capacity or deadlines make that ordering impractical:

Study for Exam may proceed without completing Review Notes first.

The system should preserve the fact that the soft preference was overridden.

---

## DEP-003: Dependency Chain Cannot Fit

GIVEN:

Reading:
- 90 minutes

hard dependency before:

Paper:
- 150 minutes
- Due tomorrow

Realistic available capacity:
- 120 minutes total before deadline

THEN:

The scheduler must not place 240 minutes of work into 120 minutes.

The dependency chain is infeasible.

Return a result requiring Deadline Intervention.

---

# 8. Dependency Cycles

## DEP-004: Circular Dependency Rejection

GIVEN:

A requires B

B requires C

WHEN the user attempts:

C requires A

THEN:

Reject the new dependency.

The scheduler must never attempt to resolve the circular graph.

User-facing language may say:

> That would create a loop where each task is waiting for another one to
> finish first.

Cycle detection must have automated tests.

---

# 9. Energy Matching

Energy level represents scheduling fit rather than an absolute eligibility
threshold.

This prevents high-energy work from remaining unscheduled forever for users
whose typical days rarely reach Energy 4 or 5.

## ENERGY-001: Prefer Better Energy Match

GIVEN:

Task:
- Energy 4

Tuesday:
- Expected Energy 4

Wednesday:
- Expected Energy 2

Both days otherwise have sufficient capacity.

THEN:

Prefer Tuesday.

---

## ENERGY-002: Imperfect Match May Be Necessary

GIVEN:

Task:
- Energy 4
- Must Do
- Due Wednesday

Monday:
- Energy 3

Tuesday:
- Energy 2

No other appropriate opportunities exist.

THEN:

Monday may receive the task.

This should be recognized as a less comfortable placement rather than
prohibited entirely.

---

# 10. Energy Types

Energy type is a secondary scheduling factor.

Example:

Class Presentation:
- Energy 4
- Mental
- Social

If Tuesday already contains several socially demanding commitments and
Thursday does not, Thursday may be preferable when both days otherwise offer
similar capacity.

Energy types guide decisions but must not be modeled as mathematically exact
currencies.

Avoid logic equivalent to:

Social Energy 5 - Meeting 2 - Presentation 3 = Social Energy 0

The application does not have sufficient evidence to make such precise claims.

---

# 11. Fixed Commitments

## COMMIT-001: Open Clock Time Is Not Automatically Usable Capacity

GIVEN:

Tuesday:
- Expected Energy 4

Class:
- 9 AM to 12 PM
- Energy 3

Therapy:
- 2 PM to 3 PM
- Energy 3

Several clock hours remain outside these commitments.

THEN:

The scheduler must not interpret every remaining minute as equivalent
high-quality flexible capacity.

The number, duration, timing, and intensity of existing commitments must
influence flexible scheduling.

---

# 12. Recurring Activities

Recurring activities may be:

- fixed
- flexible
- preferred

## Fixed

Example:

Class
Tuesday
6 PM to 8 PM

Automatic scheduling must not move it.

## Flexible

Example:

Laundry
Once per week
30 minutes

The scheduler may find an appropriate day.

## Preferred

Example:

Groceries
Once per week
Prefer Sunday afternoon

The scheduler should prefer Sunday afternoon but may move the task when
necessary.

---

## RECUR-001: Flexible Responsibility Gives Way to Consequential Work

GIVEN:

Laundry is tentatively planned Tuesday.

A Must Do assignment develops meaningful deadline pressure Tuesday.

Wednesday has comfortable capacity for laundry.

THEN:

Move laundry to Wednesday before jeopardizing the assignment.

The scheduling reason should indicate flexible recurrence or equivalent
structured reasoning.

---

# 13. Protected Capacity

Protected capacity is not merely:

availableMinutes multiplied by planningStylePercentage

Time is only one input.

The scheduler should also avoid:

- excessive task density
- too many high-energy activities
- excessive context switching
- back-to-back demanding work where avoidable
- consuming every open period

## Gentle

Approximately 60% planning target.

Conservative placement with substantial breathing room.

## Balanced

Approximately 75% planning target.

Default behavior.

## Full

Approximately 90% planning target.

Uses more anticipated capacity while retaining a buffer.

None of these mean:

"Fill exactly this percentage."

---

# 14. Manual Overrides

## MANUAL-001: Preserve User Placement

GIVEN:

The automatic scheduler places:

Research Paper -> Tuesday

WHEN:

The user manually moves it:

Research Paper -> Wednesday

THEN:

Wednesday becomes the authoritative normal placement.

Subsequent routine replanning should preserve Wednesday.

---

## MANUAL-002: User Chooses an Apparently Full Day

GIVEN:

Wednesday already appears fairly full.

WHEN:

The user moves another demanding task onto Wednesday.

THEN:

The application may warn:

> Wednesday is already looking pretty full. Moving this there may make the
> day harder than planned.

Offer choices such as:

- Move it anyway
- Find another day
- Cancel

IF the user chooses Move it anyway:

Respect the decision.

Do not repeatedly warn the user about the same deliberate placement.

---

# 15. Schedule Stability

When multiple schedules are similarly appropriate:

1. Prefer preserving the existing schedule.
2. Then prefer earlier comfortable completion.
3. Avoid unnecessary clustering of demanding tasks.
4. Preserve protected capacity.
5. Prefer fewer disruptive changes.

The scheduler does not need globally perfect mathematical optimization.

Predictable and stable good-enough behavior is preferable to constant schedule
churn.

---

# 16. Survival Mode

Survival Mode changes the scheduler's objective.

Normal planning asks:

> What is a sustainable plan?

Survival Mode asks:

> What is the smallest amount of work that protects what matters most?

## Survival Priority Order

1. Immediate unavoidable commitments
2. Critical deadline protection
3. Short Must Do tasks with significant consequences
4. Minimum viable task variants
5. Safe rescheduling of remaining work

Survival Mode must not create penalties, scores, streak losses, or failure
messages.

---

## SURV-001: Reduce Today's Plan

GIVEN:

Today's normal plan contains:

- Reading: 60 minutes
- Discussion: 30 minutes
- Laundry: 30 minutes
- Research: 60 minutes
- Optional Project: 45 minutes

WHEN:

The user activates Survival Mode.

THEN:

The scheduler may produce a reduced plan such as:

Protect:
- Discussion response: 20 to 30 minutes, due tonight

If capacity remains:
- Minimum reading variant: 15 minutes

Safely move:
- Laundry -> Saturday
- Research -> Friday
- Optional Project -> unscheduled

The exact result depends on deadlines, dependencies, commitments, and future
capacity.

The scheduler must not blindly use this example as a hard-coded ordering.

---

# 17. Survival Mode Review

Major Survival Mode changes should be reviewable before application.

The interface should distinguish:

- Keep today
- Move
- Optional or unscheduled

The user should be able to adjust the proposed survival plan.

Activating Survival Mode must not alter historical records to imply failure or
poor performance.

---

# 18. Recovery Mode

Recovery Mode helps rebuild the schedule after multiple disrupted days.

It must not simply move all unfinished work onto the current day.

Recovery Mode should evaluate each unfinished task by asking:

1. Is the task still necessary?
2. Is its deadline still active?
3. Does another task depend on it?
4. Can it still comfortably fit before its deadline?
5. Can it be moved?
6. Can it be reduced?
7. Does a minimum viable variant exist?
8. Does it require deadline intervention?

---

## RECOV-001: More Work Remains Than Capacity Allows

GIVEN:

Remaining required work:
- 8 hours

Comfortable remaining capacity:
- 4 hours

Important deadlines:
- Friday

WHEN:

Recovery Mode creates a new plan.

THEN:

The scheduler must explicitly recognize that the complete workload does not
fit.

It may organize work into categories such as:

Still achievable:
- 2 hours

Requires replanning:
- 2 hours

May need deadline flexibility:
- 4 hours

It must not create an eight-hour schedule inside four hours of realistic
capacity.

---

# 19. Recovery Plan Review

Recovery Mode should produce a proposed plan before applying major schedule
changes.

The user should be able to review categories such as:

- Still fits comfortably
- Needs replanning
- May need another option
- Safe to postpone

The user must remain able to adjust the resulting plan.

Recovery Mode exists to help the user regain a realistic schedule, not to
punish them for a disrupted previous schedule.

---

# 20. Impossible Workloads

Recognizing infeasibility is one of the scheduler's most important
responsibilities.

## IMPOSSIBLE-001: Required Work Exceeds Realistic Time

GIVEN:

Required work before applicable deadlines:
- 12 hours

Realistic available capacity:
- 5 hours

WHEN:

The scheduler evaluates the workload.

THEN:

The scheduler must return a result indicating that intervention is required.

Conceptually:

scheduleStatus = needs_intervention

The scheduler must not make the workload appear feasible by:

- incorrectly overlapping tasks
- violating hard dependencies
- eliminating protected capacity without user involvement
- changing user estimates without approval
- inventing shorter task durations
- scheduling required work after its deadline while claiming the plan
  satisfies that deadline

---

# 21. Communicating Infeasibility

The user-facing result of an infeasible schedule should remain calm and
actionable.

Avoid:

"You are 7 hours behind."

Prefer:

> This week needs another plan.
>
> It looks like there is more work here than will comfortably fit before these
> deadlines. Let's look at what can move, what can be simplified, and where
> asking for flexibility might help.

An infeasible schedule is a planning condition, not a personal failure.

---

# 22. Deadline Intervention

Deadline Intervention occurs when normal scheduling cannot produce a realistic
plan before a meaningful deadline.

Possible actions include:

- Replan
- Break the task into smaller steps
- Use a minimum viable variant
- Reduce scope
- Ask for help
- Contact instructor for academic work
- Dismiss or handle manually

The scheduler may recommend actions but should not automatically make
consequential decisions on the user's behalf.

---

## DEAD-003: Dependency Chain Requires Intervention

GIVEN:

Reading:
- 60 minutes

hard dependency before:

Assignment:
- 120 minutes

Available realistic capacity before deadline:
- 90 minutes

THEN:

The scheduler must not place both tasks into the available window.

Deadline Intervention is required.

The interface should explain that the prerequisite and dependent task together
require more capacity than appears available.

---

# 23. Academic Deadline Intervention

For academic work, Contact Instructor may be offered when:

- the workload does not realistically fit
- local replanning does not adequately resolve the conflict
- the user chooses to pursue communication

The communication workflow may use information already known by the
application such as:

- course
- assignment
- instructor
- current deadline
- possible completion date

Generated communication must:

- remain editable
- remain under user control
- never be sent automatically

Initial versions should prefer predictable templates over unnecessarily
complex generative systems.

---

# 24. Historical Learning

Historical learning should operate outside the core scheduling calculation.

Historical evidence may produce recommendations that modify future scheduler
inputs only after the user accepts them.

This preserves explainability and user control.

---

## LEARN-001: Typical Energy Recommendation

GIVEN:

Configured Wednesday energy:
- 3

Recent reported Wednesdays:
- 2
- 2
- 3
- 2
- 1
- 2

THEN:

The system may recommend:

> Wednesdays have usually landed closer to Energy 2 recently. Would you like
> me to start planning them that way?

The typical Wednesday value changes only if the user accepts the
recommendation.

---

# 25. Duration Learning

## LEARN-002: Duration Recommendation

GIVEN:

Default reading estimate:
- 30 minutes

Recent comparable task durations:
- 48 minutes
- 55 minutes
- 62 minutes
- 52 minutes
- 59 minutes

THEN:

The application may recommend a future estimate near the typical observed
duration.

For example:

> Your recent readings have usually taken around 55 minutes. Want me to use
> that as the starting estimate for future readings?

Accepting this recommendation changes future defaults.

It must not rewrite historical tasks or previous completion records.

Simple transparent statistical methods such as median or appropriately
filtered averages should be preferred over opaque machine-learning models in
the initial product.

---

# 26. Rejected Recommendations

When a user rejects a historical recommendation:

- preserve the existing preference
- record that the recommendation was declined
- avoid repeatedly resurfacing the same suggestion

A rejected recommendation does not mean historical observations must be
deleted.

It means the user's explicit preference continues to take precedence.

---

# 27. Unknown Task Information

A valid Task may contain only:

title

Example:

Work on final project

with no known:

- deadline
- duration
- energy
- priority

The application must permit this.

The scheduler may later request information when it actually needs that
information for planning.

User-facing language might say:

> Want to help me find a good time for this?

Quick task capture must not become a mandatory planning questionnaire.

---

# 28. Missing Duration

If a task has a deadline but no estimated duration, the scheduler cannot
honestly determine whether the task completely fits.

Permitted behavior includes:

1. Ask the user for an estimate.
2. Offer a suggested estimate when accepted historical evidence supports one.
3. Keep the task visible without pretending capacity calculations are precise.

Do not invent values and present them as user estimates.

If an internal fallback is ever necessary for a technical operation, it must
be clearly distinguished from user-provided data and must not create false
confidence in feasibility calculations.

---

# 29. Missing Energy

A task without an energy estimate remains valid.

The scheduler may:

- request an estimate
- use scheduling rules that do not depend on energy
- retain the task as partially scheduled or unscheduled until additional
  information is available

Unknown energy must not automatically mean Energy 1, Energy 3, or Energy 5.

---

# 30. Human Estimates Are Uncertain

Duration and energy estimates are human planning inputs.

They are not guarantees.

A duration of:

60 minutes

should conceptually mean:

approximately 60 minutes

rather than:

exactly 60.000 minutes under all circumstances

Protected capacity exists partly because actual task duration varies.

Future versions may support richer uncertainty representations such as:

- about one hour
- 30 to 60 minutes
- at least two hours
- unknown

The initial user interface does not need to implement these richer estimate
types unless explicitly included in the relevant development phase.

---

# 31. Equal or Nearly Equal Scheduling Options

Sometimes multiple placements are similarly appropriate.

Example:

Task:
- 30 minutes
- Energy 2
- Due Friday

Tuesday and Wednesday both have:
- sufficient time
- appropriate energy
- no conflicting dependencies
- comfortable capacity

THEN:

The scheduler should apply stable tie-breaking behavior.

Prefer, in general:

1. Existing placement
2. Earlier comfortable completion
3. Better distribution of demanding work
4. Protected capacity
5. Fewer unnecessary changes

The exact implementation may evolve, but equal choices must not produce
random schedule churn.

---

# 32. Replanning Triggers

Replanning may occur when:

- today's reported energy changes meaningfully
- Survival Mode is activated
- Recovery Mode is activated
- a consequential new task is created
- a task is completed
- a scheduled task remains unfinished
- task duration changes substantially
- a deadline changes
- a commitment is added
- a commitment is removed
- a task dependency changes
- the user explicitly requests replanning

Not every small data edit requires rebuilding the entire schedule.

Replanning should preserve unaffected placements whenever practical.

---

# 33. Handling an Unfinished Scheduled Task

When a scheduled task is not completed as planned, the scheduler must not
automatically treat that as failure.

Possible responses include:

- keep it later the same day if still realistic
- move it to another appropriate day
- reconsider lower-priority work
- use Recovery Mode when disruption is substantial
- trigger Deadline Intervention when necessary

The scheduler should minimize cascading changes.

---

# 34. Completed Tasks

When a task is completed:

- preserve historical schedule information
- preserve completion information
- remove the task from future active scheduling
- optionally collect actual duration
- reevaluate dependent tasks where appropriate

Completion may free future capacity.

That does not mean the scheduler must immediately fill the newly open space
with additional optional work.

Protected capacity remains valid after task completion.

---

# 35. Deleted or Archived Prerequisites

If a prerequisite task is archived or deleted while active dependent tasks
still reference it, the application must protect relational integrity.

Possible implementation strategies include:

- prevent deletion until dependencies are resolved
- require explicit confirmation and dependency cleanup
- preserve archived prerequisites while dependencies remain meaningful

The system must not silently leave broken hard dependency references.

The exact persistence behavior may be chosen during database implementation,
but the user-facing behavior must remain understandable.

---

# 36. Fixed Commitment Conflicts

If two fixed commitments overlap:

The scheduler must not attempt to "fix" the external commitments by moving
them.

Instead:

- preserve both commitments
- recognize the overlap
- reduce available flexible capacity appropriately
- optionally surface the conflict to the user

Do not double-subtract overlapping commitment minutes when calculating raw
clock availability.

Example:

Commitment A:
1 PM to 3 PM

Commitment B:
2 PM to 4 PM

Occupied clock interval:
1 PM to 4 PM

not:

4 total unavailable hours

The commitments may still have separate qualitative energy implications even
though their clock intervals overlap.

---

# 37. No Remaining Flexible Time

## TIME-001

GIVEN:

All realistically usable time for today is occupied by fixed commitments.

THEN:

The scheduler should schedule no additional timed flexible work today unless
the user explicitly overrides the plan.

The result:

"No realistic flexible time remains today"

is valid.

The scheduler does not need to force work into:

- meals
- sleep
- existing commitments
- protected personal time

merely to place tasks.

---

# 38. Manual Scheduling and Hard Constraints

User autonomy does not mean the system should lie.

If the user manually places a task in a way that conflicts with a hard
dependency or impossible clock interval:

- preserve the user's authority over their plan where technically possible
- clearly identify the conflict
- do not falsely claim that the schedule satisfies its constraints

Example:

The user manually places Write Response before its required reading.

The application might say:

> You can keep it here, but this response currently depends on completing the
> reading first.

The scheduler should distinguish:

- user-authored conflicting plan
- automatically valid plan

It must not silently rewrite one into the other.

---

# 39. Current-Day Energy Changes

## ENERGY-003

GIVEN:

Morning confirmed energy:
- 4

Afternoon updated energy:
- 2

Current plan contains:
- Must Do discussion response
- flexible research work
- laundry
- optional creative project

WHEN:

The user updates today's energy.

THEN:

The scheduler should attempt a minimal replan.

Likely behavior:

- preserve consequential immediate work where realistic
- move flexible demanding work when better future capacity exists
- defer optional work first
- preserve already completed work
- avoid reshuffling unaffected future days unnecessarily

Any major change should be reviewable.

---

# 40. Planning-Style Changes

If the user changes planning style:

Balanced -> Gentle

the scheduler may propose reducing future planned density.

If the user changes:

Gentle -> Full

the scheduler may make more capacity available for planning.

However:

Changing planning style does not automatically mean every open minute should
be populated.

Existing user-locked placements remain protected.

---

# 41. User-Facing Scheduling Explanations

Automatic decisions should support explanations such as:

## Why today?

> Your discussion is due tomorrow, and this reading needs to happen first.
> Today had the most comfortable available time before the deadline.

## Why did this move?

> Your energy changed from 4 to 2 today, so I moved your research work to
> Friday. Nothing else depends on completing it today.

## Why is this not scheduled?

> I don't know how long this will take yet, so I can't confidently find a
> realistic place for it.

## Why did this recurring task move?

> Laundry can happen on another day this week, and Tuesday became more
> important for your assignment deadline.

Do not show internal numerical optimization scores as though they explain
human planning decisions.

---

# 42. Scheduling Result Model

The implementation should distinguish successful scheduling from schedule
feasibility.

A scheduling operation may conceptually produce statuses such as:

- scheduled
- partially_scheduled
- needs_information
- needs_intervention
- user_conflict
- no_available_capacity

The exact enum names may differ in implementation.

What matters is that:

"Unable to fit all work"

must not be represented as an unexpected software exception.

It is a valid domain result.

---

# 43. Hard Constraints

Automatic scheduling should generally never violate:

1. Fixed commitments
2. Hard task dependencies
3. Applicable deadlines
4. Real clock availability
5. User-locked scheduling decisions, except by explicit user-approved change

User-authored choices may themselves create conflicts.

When that happens, expose the conflict rather than pretending it does not
exist.

---

# 44. Strong Planning Constraints

After hard constraints, strongly consider:

1. Must Do priority
2. Energy fit
3. Protected capacity
4. Required task duration
5. Existing demanding commitments
6. Deadline preparation
7. Current reported energy

These factors should materially influence scheduling.

---

# 45. Scheduling Preferences

After constraints are satisfied, preferences include:

1. Soft dependencies
2. Energy-type distribution
3. Preferred recurring timing
4. Should Do tasks
5. Could Do tasks
6. Whenever tasks
7. Earlier comfortable completion
8. Schedule stability

Preferences should not override hard constraints merely to improve an
optimization score.

---

# 46. Scheduling Architecture

The scheduler should be implemented as domain/business logic rather than UI
logic.

Prefer:

- deterministic functions
- explicit inputs
- explicit outputs
- pure calculations where practical
- small composable rules
- testable conflict detection
- structured scheduling reasons

Avoid:

- scheduling calculations embedded inside React components
- hidden global state controlling scheduler output
- random placement behavior
- untestable chains of UI side effects
- opaque machine-learning models in the initial implementation

Survival and Recovery Mode should reuse the same underlying scheduling
infrastructure where practical.

Do not implement completely independent scheduling engines for each mode.

Instead, consider different strategies, objectives, or policy configurations
over shared scheduling foundations.

---

# 47. Testing Requirements

Scheduler tests should include:

- straightforward placement
- protected unused capacity
- deadlines
- future capacity protection
- hard dependencies
- soft dependencies
- circular dependency rejection
- dependency chains that cannot fit
- energy matching
- imperfect energy matches
- commitments
- overlapping commitments
- flexible recurring tasks
- preferred recurring tasks
- manual placements
- schedule stability
- Survival Mode
- Recovery Mode
- impossible workloads
- missing duration
- missing energy
- current-day energy changes
- zero remaining capacity

New scheduling rules should normally include corresponding tests.

Regression tests should be added when scheduler bugs are discovered.

---

# 48. Development Strategy

Do not attempt to implement the entire scheduling specification in one
development step.

Implement incrementally.

Recommended progression:

1. Clock availability
2. Commitment handling
3. Basic task placement
4. Deadlines
5. Priority
6. Energy matching
7. Protected capacity
8. Dependencies
9. Schedule stability
10. Week planning
11. Survival Mode
12. Recovery Mode
13. Deadline Intervention
14. Historical recommendations

Each stage should leave existing tests passing before additional rules are
introduced.

---

# 49. Scheduler Non-Goals

The initial scheduler is not intended to:

- maximize completed task count
- maximize utilization
- calculate personal productivity
- diagnose energy or health conditions
- infer emotional states
- punish missed plans
- generate competitive rankings
- optimize external calendars automatically
- use machine learning simply because historical data exists

A straightforward, predictable scheduler is preferable to an opaque but
technically impressive one.

---

# 50. Final Correctness Principle

The scheduler is correct when it produces plans that are:

- realistic
- explainable
- stable
- deadline-aware
- dependency-aware
- energy-aware
- respectful of commitments
- protective of breathing room
- honest about impossible workloads
- subordinate to user autonomy

It is not correct merely because every task was assigned a date.

The scheduler must always preserve the central product principle:

> The schedule adapts to the person. The person does not fail the schedule.