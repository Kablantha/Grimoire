# Energy Planner: GitHub Copilot Instructions

## Product purpose

Energy Planner is a guilt-free, energy-aware planning application designed
primarily for students and neurodivergent users while remaining useful to
anyone whose capacity varies from day to day.

The core philosophy is:

> The schedule adapts to the person. The person does not fail the schedule.

The application helps users decide what they can realistically accomplish
based on available energy, time, commitments, deadlines, dependencies, and
historical information.

Automation exists to reduce the cognitive work of planning, not to remove
the user's control.

## Core product principles

Always favor:

- user autonomy
- realistic planning
- supportive and neutral language
- accessibility
- progressive disclosure
- explainable automation
- predictable behavior
- recovery from disrupted plans
- protected unscheduled capacity

Never treat an unfinished task, missed plan, low-energy day, or inaccurate
estimate as a personal failure.

If a technically clever implementation conflicts with the guilt-free,
user-autonomy philosophy, the philosophy wins.

## User autonomy

Automation may recommend, schedule, move, estimate, and predict.

The user has final authority.

Therefore:

- Manual scheduling decisions take precedence over automatic optimization.
- Predicted energy can always be overridden.
- Learned recommendations require user approval before changing defaults.
- Suggested task chunks require user approval.
- Major schedule changes must be reviewable.
- Generated communications must remain editable and must never be
  automatically sent.
- Users may reject recommendations without penalty.
- Automatic scheduling decisions should be explainable in plain language.

## Scheduling principles

The scheduler's purpose is to determine what realistically fits.

Its purpose is NOT to force every unfinished task onto the calendar.

A valid scheduling result may be that the workload does not realistically
fit before its deadlines.

The scheduler must:

- respect hard task dependencies
- respect fixed commitments
- account for actual available time
- consider task energy requirements
- consider existing demanding commitments
- preserve protected capacity
- consider deadlines without using panic-oriented urgency mechanics
- respect manually locked scheduling
- prefer schedule stability when several solutions are reasonable
- minimize unnecessary replanning
- identify impossible or unrealistic workloads honestly

The scheduler must never make an impossible workload appear feasible by:

- overlapping tasks incorrectly
- violating hard dependencies
- inventing shorter durations
- ignoring commitments
- silently removing protected capacity
- pretending work scheduled after a deadline satisfies that deadline

Energy requirements represent scheduling fit rather than an absolute
eligibility threshold.

Energy types guide scheduling but must not be treated as mathematically
precise currencies.

## Product tone

The interface should feel:

- gentle
- reassuring
- calm
- matter-of-fact
- supportive
- honest
- nonjudgmental

Avoid language such as:

- "You're falling behind."
- "You failed."
- "7 OVERDUE TASKS!"
- productivity scores
- punishment language
- streak-loss messages

Prefer language such as:

- "A few things need another look."
- "Today changed, so let's adjust the plan."
- "This week may need another plan."
- "There may not be enough comfortable working time before this deadline."
- "Let's protect what matters most."

Do not use threatening visual treatments for ordinary deadlines.

Red should generally be reserved for genuinely destructive or dangerous
actions, such as permanent data deletion, rather than ordinary missed tasks
or approaching deadlines.

## Energy model

Energy uses an internal 1-5 scale.

Energy level and energy type are different properties.

Default energy types are:

- Mental
- Social
- Physical
- Creative
- Routine

Tasks may require multiple energy types.

Do not require users to individually score every energy type.

Energy terminology is presentation-only.

Supported terminology may include:

- Energy
- Spoons
- Spell Slots
- Battery

Changing terminology must never change scheduling behavior.

## Planning styles

The application supports:

- Gentle: approximately 60% planning target
- Balanced: approximately 75% planning target
- Full: approximately 90% planning target

Balanced is the default.

These percentages are planning guidelines, not rigid mathematical quotas.

The scheduler should deliberately leave some capacity unused.

Rest and open time are not empty spaces that must automatically be filled.

## Tasks

Creating a task should require only a title.

All other planning information may be supplied later.

Potential task information includes:

- description
- due date/time
- estimated duration
- energy level
- energy types
- priority
- category
- project
- course
- dependencies
- recurrence
- scheduling information
- minimum viable variant
- whether the task can be divided into chunks

Priorities are:

- Must Do
- Should Do
- Could Do
- Whenever

Do not create an "overdue" task status.

Overdue state should be derived from deadline and completion information.

## Task dependencies

Dependencies may be:

- hard
- soft

Hard dependencies must be respected by automatic scheduling.

Circular dependencies must not be allowed.

Dependency conflicts should be explained to users in normal language.

## Student features

Student functionality extends the generic task model.

An academic assignment is still a Task.

Do not create separate scheduling systems for:

- assignments
- readings
- chores
- personal tasks
- projects

Academic tasks may contain student-specific metadata such as:

- course
- academic task type
- instructor
- LMS information

Academic task types may include:

- reading
- assignment
- discussion
- quiz
- exam
- project
- study
- other

Life tasks and academic tasks must coexist in the same planner.

## Survival Mode

Survival Mode is a first-class feature.

It changes the scheduling objective from:

"What is a sustainable normal plan?"

to:

"What is the smallest amount of work that protects what matters most?"

Survival Mode should prioritize:

1. Immediate unavoidable commitments
2. Critical deadline protection
3. Short Must Do tasks with significant consequences
4. Minimum viable task variants
5. Safe rescheduling of remaining work

Survival Mode must never create:

- penalties
- lower productivity scores
- streak loss
- failure messages

## Recovery Mode

Recovery Mode helps users rebuild a plan after disrupted days.

It must not simply move all unfinished work onto the current day.

It should identify work that:

- still comfortably fits
- can fit with replanning
- may need reduced scope
- may require deadline intervention
- can safely wait

Recovery plans require user review.

## Historical learning

Historical learning produces recommendations.

It does not silently change user settings.

The application may learn from voluntarily supplied information such as:

- reported daily energy
- actual task duration
- typical task duration
- recurring weekly energy patterns

Users must be able to accept or reject learned recommendations.

Rejected recommendations should not repeatedly nag the user.

Missing historical information is missing data, not zero.

## Accessibility

Accessibility is part of the architecture, not final-stage polish.

All primary functionality must be keyboard accessible.

Never communicate important information through color alone.

Icons must have accessible labels where appropriate.

Energy values must have textual equivalents.

Drag-and-drop functionality must always have a non-drag alternative.

Use semantic HTML before adding ARIA.

Maintain logical heading hierarchy.

Interactive dialogs and overlays must correctly manage:

- focus
- keyboard access
- Escape behavior where appropriate
- focus restoration
- accessible names and descriptions

Respect reduced-motion preferences.

Design for screen magnification and responsive layouts.

Use progressive disclosure to reduce cognitive overload.

## Engineering principles

Use TypeScript.

Prefer explicit types over unsafe assumptions.

Avoid `any` unless there is a documented and compelling reason.

Validate data at system boundaries.

Keep business logic separate from presentation logic.

Scheduling logic must not live inside React UI components.

The scheduling engine should be deterministic and independently testable.

Prefer pure functions for scheduling calculations when practical.

Write tests for scheduler behavior.

New scheduling rules should include tests representing their expected
behavior.

Do not implement functionality outside the requested development phase
unless required to support that phase.

Do not silently refactor unrelated parts of the application.

Prefer small, reviewable changes over broad rewrites.

When modifying architecture, explain why the change is necessary.

## Development workflow

Before implementing a feature:

1. Read the relevant files in `/docs`.
2. Identify the requirements being implemented.
3. Keep implementation limited to the requested scope.
4. Write or update appropriate tests.
5. Implement the smallest coherent solution.
6. Run relevant tests.
7. Run linting and TypeScript checks where configured.
8. Report what changed and any remaining concerns.

Do not claim tests passed unless they were actually run successfully.

## Explicitly excluded from initial versions

Do not introduce these unless directly requested:

- productivity scores
- leaderboards
- competitive features
- streak systems
- punishment mechanics
- automatic instructor emails
- automatic external calendar modification
- complex time tracking
- machine-learning models
- separate scores for every energy dimension
- native iOS applications
- native Android applications
- social networking features
- large analytics dashboards

Simple, transparent calculations should be preferred over opaque AI or
machine-learning systems when they can solve the problem.

## Final guiding rule

When uncertain about an implementation decision, return to this principle:

> The schedule adapts to the person. The person does not fail the schedule.

Optimize the software for helping the user make realistic decisions, not
for maximizing the number of tasks completed.