# Energy Planner
## Conceptual Data Model

## 1. Purpose

This document defines the conceptual data model for Energy Planner.

It describes what the application needs to understand and the relationships
between those concepts.

This is not a final database schema.

Implementation details may evolve, but changes must preserve the product
behavior defined in PRODUCT_REQUIREMENTS.md and SCHEDULER_SPEC.md.

The model should favor:

- explicit relationships
- data integrity
- understandable domain concepts
- user autonomy
- historical accuracy
- testability
- future extensibility without premature complexity

---

# 2. User

Represents the person using the application.

Conceptual fields:

User
- id
- name
- timezone
- studentFeaturesEnabled
- energyTerminology
- planningStyle
- typicalEnergyByDay
- preferences
- createdAt
- updatedAt

## Energy Terminology

Supported presentation options initially include:

- energy
- spoons
- spell_slots
- battery

Energy terminology affects presentation only.

It must not alter scheduler behavior.

## Planning Style

Supported options:

- gentle
- balanced
- full

These correspond approximately to:

- Gentle: 60% planning target
- Balanced: 75% planning target
- Full: 90% planning target

Balanced is the default.

These values are planning targets rather than strict utilization quotas.

---

# 3. Task

Task is the central unit of work.

Academic assignments, readings, household tasks, creative work, errands,
and similar activities all use the same Task model.

Conceptual fields:

Task
- id
- userId
- title
- description
- status
- priority
- estimatedMinutes
- energyLevel
- dueAt
- earliestStartAt
- manuallyScheduled
- academicTaskType
- categoryId
- projectId
- courseId
- parentTaskId
- recurrenceRuleId
- createdAt
- updatedAt
- completedAt
- archivedAt

## Task Status

Initial stored states should remain simple:

- active
- completed
- archived

"Overdue" must not be stored as a task status.

Whether a deadline has passed should be derived from:

- dueAt
- completedAt
- current date/time

A task whose deadline has passed remains a task rather than becoming an
"overdue task" as a permanent identity.

## Priority

Task priority values are:

- must_do
- should_do
- could_do
- whenever

User-facing labels should be:

- Must Do
- Should Do
- Could Do
- Whenever

## Optional Data

Only Task.title is required for rapid task capture.

The scheduler must tolerate tasks whose duration, deadline, energy,
priority, or other planning information is unknown.

Missing information is missing data.

Do not silently replace unknown user data with invented values.

---

# 4. Task Hierarchy and Chunks

Task chunks should use the Task model rather than an independent chunk model.

A child task references its parent using:

parentTaskId

Example:

Research Paper
- Choose topic
- Find sources
- Read sources
- Create outline
- Draft
- Revise

Each child remains a normal Task and can therefore have its own:

- duration
- energy requirement
- dependencies
- schedule entries
- completion history

This avoids creating separate scheduling logic for task chunks.

---

# 5. TaskDependency

Represents a relationship between two tasks.

Conceptual fields:

TaskDependency
- id
- prerequisiteTaskId
- dependentTaskId
- type
- createdAt

Dependency types:

- hard
- soft

## Hard Dependency

The dependent task cannot reasonably begin before the prerequisite is
completed.

Example:

Read Chapter 8
-> hard ->
Write Discussion Post

## Soft Dependency

The prerequisite should preferably happen first but may be bypassed when
capacity, deadlines, or other constraints require it.

## Integrity Rule

Circular dependencies are prohibited.

The application must reject dependency graphs such as:

A requires B
B requires C
C requires A

Cycle detection belongs in domain/business logic and must have automated tests.

---

# 6. EnergyType

Represents a kind of energy associated with a task or commitment.

Conceptual fields:

EnergyType
- id
- userId
- name
- iconIdentifier
- sortOrder
- enabled
- isDefault

Initial defaults:

- Mental
- Social
- Physical
- Creative
- Routine

The model should allow additional user-defined energy types in the future.

---

# 7. TaskEnergyType

Tasks and EnergyTypes have a many-to-many relationship.

Conceptual fields:

TaskEnergyType
- taskId
- energyTypeId

Example:

Class Presentation
- Mental
- Social

Energy types guide scheduling decisions.

They are not independent numerical energy currencies.

---

# 8. DailyCapacity

Represents planning information about a specific calendar day.

Conceptual fields:

DailyCapacity
- id
- userId
- date
- predictedEnergy
- confirmedEnergy
- availableMinutes
- planningStyleOverride
- survivalModeActive
- notes
- createdAt
- updatedAt

## Predicted Energy

The expected energy level based initially on user configuration and later
potentially informed by approved historical recommendations.

## Confirmed Energy

The energy level the user reports for the specific day.

When present, confirmedEnergy takes precedence over predictedEnergy for
current-day planning.

## Important Distinction

Daily energy is an ordinal capacity signal.

It is not a numerical currency from which individual commitments should be
directly subtracted.

Do not implement logic such as:

Energy 4 - Class Energy 2 = Remaining Energy 2

The scheduler should evaluate energy demands together with:

- time occupancy
- task intensity
- commitment density
- energy type
- protected capacity
- transitions

---

# 9. EnergyObservation

Stores voluntarily provided historical energy observations.

Conceptual fields:

EnergyObservation
- id
- userId
- observedAt
- energyLevel
- source
- notes

Possible sources include:

- morning_checkin
- manual_update
- survival_mode

EnergyObservation should capture capacity information.

It should not attempt to infer or diagnose:

- mood
- emotion
- mental health state
- medical status

---

# 10. ScheduleEntry

Separates the existence of a Task from the decision to perform it at a
particular time.

Conceptual fields:

ScheduleEntry
- id
- taskId
- date
- startTime
- plannedMinutes
- schedulingSource
- lockedByUser
- minimumVersionScheduled
- createdAt
- updatedAt

Possible schedulingSource values:

- automatic
- manual
- recovery
- survival

## User Locking

When a user deliberately places or moves a task, lockedByUser should protect
that scheduling decision from ordinary automatic replanning.

If keeping the placement becomes impossible, the application should present
the conflict rather than silently overriding the user.

---

# 11. Scheduling Reasons

The system must preserve enough information to explain automatic scheduling
decisions.

This may be modeled as structured reason records, codes associated with a
ScheduleEntry, or another normalized mechanism.

Possible reasons include:

- dependency
- deadline
- energy_match
- available_time
- manual_choice
- recurrence
- protected_capacity
- priority
- schedule_stability

These reasons should support user-facing explanations such as:

"I placed this reading today because your discussion post depends on it and
is due tomorrow."

Do not expose internal optimization scores as explanations.

---

# 12. RecurrenceRule

Represents recurrence independently from Tasks and Commitments.

Conceptual fields:

RecurrenceRule
- id
- frequency
- interval
- daysOfWeek
- preferredTime
- recurrenceType
- startsOn
- endsOn
- flexibilityWindow

Recurrence types:

- fixed
- flexible
- preferred

## Fixed

Example:

Class every Tuesday from 6 PM to 8 PM.

Automatic scheduling cannot move it.

## Flexible

Example:

Laundry once each week.

The scheduler may decide which appropriate day receives it.

## Preferred

Example:

Grocery shopping once each week, preferably Sunday afternoon.

The scheduler prefers the requested timing but may move it when capacity or
more consequential work makes that appropriate.

---

# 13. Commitment

Represents time or capacity demands that are not ordinary schedulable Tasks.

Examples include:

- class
- work shift
- appointment
- therapy
- meeting
- imported calendar event

Conceptual fields:

Commitment
- id
- userId
- title
- startsAt
- endsAt
- energyLevel
- source
- externalId
- recurrenceRuleId
- flexibility
- createdAt
- updatedAt

Commitments may also have EnergyType relationships.

Possible sources include:

- manual
- outlook_calendar
- google_calendar
- apple_calendar

External source names are illustrative and should not force calendar
provider implementation before the relevant development phase.

## Important Rule

Imported external calendar events initially inform planning.

Energy Planner must not automatically modify external calendar events in the
initial version.

---

# 14. Capacity Model

The scheduler should conceptually evaluate each day using factors such as:

Total expected capacity
-> Fixed commitments
-> Recurring responsibilities
-> Existing scheduled work
-> Protected capacity
-> Flexible scheduling opportunities

This is conceptual rather than direct arithmetic.

A day with several demanding commitments may have substantial open clock time
while still offering relatively little realistic flexible capacity.

Time and energy must therefore remain distinct scheduling signals.

---

# 15. TaskVariant

Represents an alternate version of a task.

Conceptual fields:

TaskVariant
- id
- taskId
- type
- title
- estimatedMinutes
- energyLevel
- createdAt
- updatedAt

Initial supported type:

- minimum

Example:

Original:
Read Chapter 7 and take notes
60 minutes
Energy 3

Minimum variant:
Read chapter summary and review headings
15 minutes
Energy 1

Task variants allow Survival Mode and deadline intervention to reason about an
actual alternate duration and energy requirement rather than relying only on
descriptive text.

---

# 16. TaskCompletion

Stores historical completion information.

Conceptual fields:

TaskCompletion
- id
- taskId
- completedAt
- plannedMinutes
- actualMinutes
- plannedEnergy
- optionalObservedEnergy
- minimumVersionUsed
- entrySource

Actual duration is optional.

actualMinutes = null means:

"The user did not provide this information."

It must never mean:

"The task took zero minutes."

Historical completion information may eventually inform learning
recommendations.

---

# 17. LearningRecommendation

Stores recommendations generated from historical information.

Conceptual fields:

LearningRecommendation
- id
- userId
- type
- evidenceSummary
- currentValue
- suggestedValue
- status
- createdAt
- resolvedAt

Possible statuses:

- pending
- accepted
- declined
- dismissed

Possible recommendation types may include:

- typical_daily_energy
- typical_task_duration
- task_energy_estimate

Recommendations must not change the user's settings until they are accepted.

Storing recommendation history helps prevent repeatedly resurfacing rejected
suggestions.

---

# 18. Course

Course extends the generic task model with student organization.

Conceptual fields:

Course
- id
- userId
- name
- code
- term
- startDate
- endDate
- instructorId
- lmsUrl
- color
- createdAt
- updatedAt

Tasks may reference a Course using courseId.

Course color is organizational presentation data only and must never be the
sole way course identity is communicated.

---

# 19. Instructor

Stores optional contact information for student features.

Conceptual fields:

Instructor
- id
- userId
- name
- email
- officeHours
- notes
- createdAt
- updatedAt

Instructor information may later support deadline intervention communication.

Messages must never be automatically sent.

---

# 20. Academic Task Type

Academic work remains a Task.

Do not create a separate Assignment scheduling model.

Task may optionally contain an academicTaskType such as:

- reading
- assignment
- discussion
- quiz
- exam
- project
- study
- other

This prevents parallel task systems and allows school and life tasks to
participate in the same scheduler.

---

# 21. Project

Represents a set of related tasks.

Conceptual fields:

Project
- id
- userId
- name
- description
- createdAt
- updatedAt
- archivedAt

Examples:

- Research Paper
- Portfolio
- Game Project
- Apartment Move
- Personal Creative Project

Projects are optional.

A Task does not need a Project in order to exist or be scheduled.

---

# 22. Category

Provides lightweight task organization.

Conceptual fields:

Category
- id
- userId
- name
- color
- createdAt
- updatedAt

Examples:

- School
- Home
- Health
- Creative
- Errands

Categories are optional.

Category color must never be the only indicator of category identity.

---

# 23. DeadlineIntervention

Represents a detected conflict between remaining work and realistic available
capacity.

Conceptual fields:

DeadlineIntervention
- id
- taskId
- detectedAt
- availableCapacityEstimate
- requiredWorkEstimate
- status
- resolution
- resolvedAt

Possible resolutions include:

- replanned
- reduced_scope
- chunked
- used_minimum_variant
- asked_for_help
- contacted_instructor
- dismissed

The purpose of recording an intervention is to support the workflow and avoid
repeatedly raising already addressed issues.

It must not be used to create a failure score or crisis counter.

---

# 24. Concepts Explicitly Excluded

Do not create domain models for:

- ProductivityScore
- UserRank
- FailureCount
- MissedTaskScore
- Leaderboard
- Punishment
- StreakPenalty

The product is intentionally not built around measuring personal worth,
productivity performance, or competitive output.

A completion streak should not be introduced indirectly through another
entity name without an explicit product decision.

---

# 25. Key Relationships

Conceptually:

User
- has many Tasks
- has many DailyCapacity records
- has many EnergyObservations
- has many Commitments
- has many Courses
- has many Projects
- has many Categories
- has many LearningRecommendations

Task
- belongs to User
- may belong to Course
- may belong to Project
- may belong to Category
- may belong to parent Task
- may have child Tasks
- may have many EnergyTypes
- may have many prerequisite Tasks
- may have many dependent Tasks
- may have TaskVariants
- may have ScheduleEntries
- may have TaskCompletions
- may use a RecurrenceRule
- may have DeadlineInterventions

Course
- belongs to User
- may reference Instructor
- has many Tasks

Commitment
- belongs to User
- may use a RecurrenceRule
- may have EnergyTypes

---

# 26. Worked Example

A student creates:

TCID Reading Response

Task information:

- Priority: Must Do
- Due: Thursday at 11:59 PM
- Estimated duration: 45 minutes
- Energy level: 3
- Energy type: Mental
- Course: TCID
- Status: active

Dependency:

Read Chapter 8
-> hard ->
TCID Reading Response

Read Chapter 8:

- Estimated duration: 60 minutes
- Energy level: 3
- Energy type: Mental

Wednesday:

- Predicted energy: 3
- Confirmed morning energy: 1

Wednesday commitments:

- Class from 10 AM to 12 PM
- Therapy from 2 PM to 3 PM

The data model provides the scheduler with enough information to determine
that the original Wednesday plan may no longer be appropriate.

The scheduler can examine Thursday's remaining capacity.

If the complete dependency chain no longer fits comfortably before the
deadline, the appropriate result is a DeadlineIntervention rather than an
impossible schedule.

The interface can then offer:

- Replan
- Break down
- Use minimum variant where available
- Ask for help
- Contact instructor

No failure state is required.

---

# 27. Data Integrity Principles

Implementation should preserve the following:

1. A Task requires only a title for initial capture.
2. Missing data is not zero.
3. Hard dependency cycles are prohibited.
4. User-created schedule locks are preserved.
5. Historical observations remain separate from current defaults.
6. Recommendations do not become settings without user approval.
7. Academic tasks remain Tasks.
8. Commitments remain separate from schedulable Tasks.
9. ScheduleEntry remains separate from Task.
10. Human estimates are treated as estimates rather than guarantees.
11. Historical records should not be silently rewritten when a user's
    future defaults change.
12. Presentation choices such as Spell Slots do not change domain logic.

---

# 28. Implementation Guidance

When this conceptual model is translated into a database schema:

- Use database constraints where they meaningfully protect integrity.
- Use application/domain validation where database constraints cannot express
  the necessary rule.
- Avoid storing values that can safely and reliably be derived.
- Avoid premature abstraction.
- Do not put arbitrary unrelated application state into large JSON blobs merely
  to avoid modeling relationships.
- Keep scheduler-specific business logic outside database models and React
  components.
- Use migrations for schema changes.
- Include tests for important relational and domain rules.

The database implementation may differ syntactically from this document, but
it must preserve these concepts and relationships unless the documentation is
deliberately revised.

---

# 29. Guiding Principle

The model exists to support realistic and humane planning.

It should provide enough structure for the application to understand:

- what needs doing
- when it matters
- what must happen first
- what capacity may be available
- what life is already consuming that capacity
- what the user explicitly decided
- what happened historically
- when the planner does not have enough information to know

The data model must support the central product principle:

> The schedule adapts to the person. The person does not fail the schedule.