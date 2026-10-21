# Energy Planner
## Product Requirements

## 1. Product Summary

Energy Planner is a supportive, energy-aware planning application designed
primarily for students and neurodivergent users while remaining useful to
anyone who struggles with conventional task management.

Rather than expecting users to organize their lives around a fixed schedule,
the application creates realistic daily plans based on:

- available energy
- type of energy required
- available time
- fixed commitments
- recurring life responsibilities
- deadlines
- task priority
- dependencies between tasks
- historical task and energy information
- the user's own scheduling decisions

The application focuses primarily on what is manageable today while providing
a weekly view for reviewing and adjusting upcoming plans.

## 2. Core Philosophy

> The schedule adapts to the person. The person does not fail the schedule.

The application must never treat an inaccurate plan, unfinished task,
low-energy day, or missed deadline as a personal failure.

Automation exists to reduce the cognitive work of planning, not to remove
the user's control.

The application's primary measure of success is not how many tasks the user
completes. It is whether the application helps the user create realistic plans
and recover gracefully when those plans change.

When a technically clever option conflicts with the guilt-free,
user-autonomy philosophy, the philosophy wins.

---

# 3. Target Users

## 3.1 Primary Audience

Students who have difficulty planning work because their available energy,
executive function, and time may vary from day to day.

The design should be particularly supportive of users with:

- ADHD
- autism
- chronic illness
- mental health conditions
- variable work or school schedules
- executive-function difficulties
- fluctuating energy

No diagnosis is required to use the application.

The application must not present itself as medical treatment or as a tool
capable of diagnosing a medical or psychological condition.

## 3.2 Secondary Audience

Anyone who wants to plan tasks around realistic capacity rather than
conventional productivity metrics.

The underlying task system must therefore support school, work, household,
creative, personal, and other tasks in the same planner.

---

# 4. Product Modes

The application does not have separate student and general-purpose versions.

Instead, users can enable features appropriate to their circumstances.

## 4.1 General Features

All users can create and manage:

- tasks
- projects
- categories
- deadlines
- recurring responsibilities
- fixed commitments
- task dependencies
- daily energy
- weekly planning

## 4.2 Student Features

Student functionality is optional.

When enabled, users can additionally manage:

- courses
- instructors
- readings
- assignments
- discussions
- quizzes
- exams
- projects
- study tasks
- academic deadlines
- course schedules
- LMS links

Student users retain access to all ordinary task functionality.

A student must be able to schedule school tasks and ordinary life tasks in
the same planning system.

---

# 5. Energy Model

## 5.1 Energy Level

Energy represents perceived capacity rather than productivity, motivation,
morality, or personal worth.

The internal energy scale is:

1. Very low capacity
2. Low capacity
3. Moderate capacity
4. Good capacity
5. High capacity

These descriptions are intentionally flexible.

One user's Energy 3 does not need to represent the same amount of capacity as
another user's Energy 3.

## 5.2 Energy Types

Tasks may require one or more energy types.

Default types are:

- Mental
- Social
- Physical
- Creative
- Routine

Energy type and energy level are separate properties.

For example:

Class presentation:
- Energy level: 4
- Types: Mental, Social

Read textbook chapter:
- Energy level: 3
- Type: Mental

Users should not be required to assign separate numerical scores to every
energy type.

## 5.3 Energy Terminology

Users may choose how the energy system is presented.

Initial terminology options are:

- Energy
- Spoons
- Spell Slots
- Battery

These are presentation options only.

All terminology maps to the same underlying 1-5 energy model and must not
change scheduling behavior.

---

# 6. Typical and Daily Energy

During onboarding, users can provide a typical energy level for each day of
the week.

These values provide an initial planning baseline.

Over time, the application may identify differences between predicted and
reported energy and recommend changes.

For example:

"Your Wednesdays have usually been closer to Energy 2 recently. Would you like
me to start planning Wednesdays at 2 instead of 3?"

The application must not silently change a user's typical energy.

Each day, the user can review and change that day's predicted energy.

The user's current reported energy takes precedence over historical
predictions.

---

# 7. Capacity and Commitments

The planning engine must not assume that all unscheduled clock time is
available task capacity.

Daily planning must consider:

- fixed commitments
- recurring responsibilities
- flexible tasks
- duration
- energy demands
- transitions
- protected capacity

Examples of fixed commitments include:

- class
- work
- therapy
- appointments
- meetings

Examples of recurring responsibilities include:

- laundry
- grocery shopping
- exercise
- studying
- cleaning
- meal preparation

Life responsibilities count as genuine demands on a person's available
capacity.

---

# 8. Protected Capacity

The planner must deliberately avoid filling 100% of predicted capacity.

Initial planning styles are:

## Gentle

Approximately 60% planning target.

Leaves substantial open capacity.

## Balanced

Approximately 75% planning target.

This is the default.

## Full

Approximately 90% planning target.

Uses more anticipated capacity while retaining some buffer.

These percentages are planning targets rather than rigid mathematical quotas.

Protected capacity accounts for:

- transitions
- unexpected events
- executive dysfunction
- inaccurate estimates
- breaks
- additional tasks
- rest
- ordinary life

Unused capacity must not be framed as wasted productivity.

---

# 9. Product Personality

The application should feel:

- gentle
- reassuring
- matter-of-fact
- nonjudgmental
- calm
- supportive
- honest
- encouraging without being patronizing

The application should not behave like an aggressive productivity coach.

Avoid language such as:

- "You're falling behind!"
- "You failed."
- "7 OVERDUE TASKS!"
- "You missed your goal."
- productivity scores
- streak warnings

Prefer language such as:

- "A few things need another look."
- "Yesterday didn't go as planned, so I've moved the things that can safely wait."
- "There may not be enough comfortable working time before this deadline."
- "Today looks like a low-capacity day. That's okay."
- "Let's protect what matters most."

Approaching deadlines must be communicated clearly without panic-oriented
visual or written language.

Red styling should generally be reserved for genuinely dangerous or
destructive actions, such as permanent data deletion.

---

# 10. User Autonomy

Automation may:

- recommend
- schedule
- move
- estimate
- predict

The user has final authority.

Therefore:

- users can move automatically scheduled tasks
- manually placed tasks are respected
- predicted energy can be overridden
- learned estimates require approval before becoming defaults
- task splitting requires user involvement
- generated communications require user review
- automated schedules must be explainable
- users can reject recommendations without penalty

The application should eventually support questions such as:

"Why did you put this here?"

Example response:

"I placed your reading on Tuesday because it is required before Wednesday's
discussion post, Tuesday is normally a moderate-energy day for you, and you
have about 60 minutes available after class."

---

# 11. Functional Requirements

## 11.1 Task Management

### FR-TASK-001

Users can:

- create
- edit
- complete
- archive
- restore

tasks.

### FR-TASK-002

A task may contain:

- title
- description or notes
- due date and time
- estimated duration
- energy level
- one or more energy types
- priority
- category
- project
- course
- dependencies
- recurrence
- whether it can be divided into chunks
- optional minimum viable version

Only the title is required during quick task creation.

### FR-TASK-003

Task priorities are:

- Must Do
- Should Do
- Could Do
- Whenever

### FR-TASK-004

Tasks may be manually scheduled or left for automatic scheduling.

### FR-TASK-005

Manual placement takes precedence over automatic placement unless fulfilling
the manual decision becomes impossible.

When a conflict occurs, the application should inform the user rather than
silently overriding the decision.

### FR-TASK-006

Completing a task may optionally prompt the user to report how long it
actually took.

Skipping this question has no negative consequence.

---

# 12. Task Dependencies

### FR-DEP-001

Tasks can have dependencies.

### FR-DEP-002

Dependencies can be:

- Hard
- Soft

A hard dependency means the dependent task cannot reasonably begin before its
prerequisite.

A soft dependency expresses a preferred ordering.

### FR-DEP-003

Automatic scheduling must respect hard dependencies.

### FR-DEP-004

Dependency conflicts must be explained in normal language.

Example:

"I couldn't move the reading to Thursday because your response depends on it
and is due Wednesday."

### FR-DEP-005

Circular dependency chains must not be allowed.

---

# 13. Breaking Down Tasks

### FR-CHUNK-001

Tasks can optionally be divided into smaller tasks.

### FR-CHUNK-002

For large or long-duration tasks, the application may gently ask whether
breaking the task into smaller steps would help.

Possible responses include:

- Yes
- Suggest some steps
- Not right now
- This does not divide easily

### FR-CHUNK-003

Suggested chunks require user approval.

### FR-CHUNK-004

Chunks may inherit information such as:

- course
- project
- deadline
- energy requirements

while retaining individual duration and energy estimates.

---

# 14. Recurring Tasks and Commitments

### FR-REC-001

Recurring activities may be:

- Fixed
- Flexible
- Preferred

Fixed example:
Class every Tuesday from 6:00 PM to 8:00 PM.

Flexible example:
Laundry once per week.

Preferred example:
Grocery shopping once per week, preferably Sunday afternoon.

### FR-REC-002

Recurring responsibilities consume time and energy capacity.

### FR-REC-003

Flexible recurring tasks may be automatically relocated when appropriate.

### FR-REC-004

Fixed commitments cannot be automatically moved.

### FR-REC-005

Preferred recurring tasks should use their preferred timing when reasonable
but may move when necessary.

---

# 15. Student Features

### FR-STU-001

Student features are optional.

### FR-STU-002

Users can create courses containing:

- course name
- course code
- instructor
- instructor contact information
- meeting schedule
- start and end dates
- optional LMS link

### FR-STU-003

Academic tasks may be classified as:

- reading
- assignment
- discussion
- quiz
- exam
- project
- study
- other

### FR-STU-004

Academic tasks can depend on other academic tasks.

Example:

Reading
→ Discussion Post
→ Discussion Replies

### FR-STU-005

Academic and ordinary life tasks coexist in the same planning system.

---

# 16. Daily Planning

### FR-DAY-001

Today is the application's primary view.

### FR-DAY-002

At the beginning of the day, the application presents the predicted energy
level and allows the user to adjust it.

### FR-DAY-003

The user can change today's energy later in the day.

### FR-DAY-004

Changing energy may cause the scheduler to recommend appropriate changes.

### FR-DAY-005

Daily planning considers:

- available time
- current energy
- energy type
- fixed commitments
- recurring responsibilities
- deadlines
- dependencies
- task priority
- historical duration
- historical energy patterns
- manually scheduled work
- protected capacity

### FR-DAY-006

The application may deliberately leave capacity unused.

Rest is not an empty scheduling slot that the application needs to fill.

---

# 17. Weekly Planning

### FR-WEEK-001

Users can easily move between Today and Week views.

### FR-WEEK-002

Week view presents:

- scheduled tasks
- commitments
- expected energy
- available capacity
- major deadlines

without unnecessarily overwhelming the user.

### FR-WEEK-003

Users can manually move tasks between days.

### FR-WEEK-004

Manual adjustments are respected during future replanning.

### FR-WEEK-005

The application gently identifies days that appear unrealistically full.

---

# 18. Survival Mode

### FR-SURV-001

Survival Mode can be manually activated at any time.

The primary interaction may use language such as:

"I don't have it today."

### FR-SURV-002

Survival Mode substantially reduces the expected workload.

### FR-SURV-003

The scheduler identifies the smallest amount of work necessary to protect the
user's most consequential obligations.

### FR-SURV-004

Tasks may substitute their minimum viable versions where appropriate.

### FR-SURV-005

Movable work may be proposed for rescheduling.

### FR-SURV-006

Survival Mode does not:

- break streaks
- lower scores
- generate failure messages
- create punishment mechanics

The initial application has no productivity-score system.

---

# 19. Recovery Mode

### FR-RECOV-001

Recovery Mode helps users rebuild their schedules after multiple disrupted
days.

### FR-RECOV-002

It evaluates unfinished work against:

- remaining time
- deadlines
- dependencies
- future capacity
- priority

### FR-RECOV-003

Recovery may organize remaining work into concepts such as:

- still comfortably achievable
- achievable with replanning
- may need reduced scope
- may require deadline intervention
- safe to postpone

### FR-RECOV-004

A rebuilt Recovery Mode schedule requires user review.

The application must not simply move all unfinished work onto the current day.

---

# 20. Deadline Intervention

### FR-DEAD-001

The scheduler must detect when required work probably cannot comfortably fit
before a deadline.

It must not generate an impossible-looking schedule merely to place all work.

### FR-DEAD-002

Deadline warnings use supportive language.

Example:

"There may not be enough comfortable working time to finish this before
Friday."

### FR-DEAD-003

The system offers actionable options such as:

- Replan
- Reduce scope
- Break down the task
- Ask for help
- Contact instructor when applicable

### FR-DEAD-004

For academic tasks, the application may help draft communication to an
instructor.

### FR-DEAD-005

Generated messages are never sent automatically.

The user must be able to review and edit them.

---

# 21. Historical Learning

### FR-LEARN-001

The application gradually learns from voluntarily provided information.

### FR-LEARN-002

It may identify patterns involving:

- reported daily energy
- task duration
- typical energy required by task types
- days of the week
- recurring commitments

### FR-LEARN-003

Historical information produces recommendations rather than silent changes.

### FR-LEARN-004

Users can reject learned recommendations.

Rejected recommendations should not repeatedly nag the user.

### FR-LEARN-005

Providing actual completion time is optional.

Missing data must not be interpreted as zero.

---

# 22. Calendar Integration

### FR-CAL-001

The architecture must support external calendar integration.

### FR-CAL-002

Imported calendar events consume available time and may influence expected
capacity.

### FR-CAL-003

Initial calendar integration should be read-only.

The application must not automatically modify a user's external calendar in
the initial version.

Calendar events should initially be normalized into internal commitments for
planning.

---

# 23. Accessibility

### FR-ACCESS-001

All primary functionality must be keyboard accessible.

### FR-ACCESS-002

Energy levels cannot be communicated through color alone.

### FR-ACCESS-003

Energy types cannot depend exclusively on icons.

### FR-ACCESS-004

Drag-and-drop scheduling must have a non-drag alternative.

Example:

"Move to Thursday"

### FR-ACCESS-005

Important automated recommendations must work with screen readers.

### FR-ACCESS-006

Motion and animation must respect reduced-motion preferences.

### FR-ACCESS-007

The interface should minimize cognitive overload through progressive
disclosure.

Advanced task fields should remain available without requiring users to
complete them during quick entry.

### FR-ACCESS-008

Semantic HTML should be preferred over unnecessary ARIA.

### FR-ACCESS-009

Dialogs and overlays must provide appropriate:

- keyboard behavior
- focus management
- focus restoration
- accessible names
- accessible descriptions

---

# 24. Personalization

### FR-PERS-001

Users can choose energy terminology such as:

- Energy
- Spoons
- Spell Slots
- Battery

All terminology maps to the same internal energy model.

### FR-PERS-002

Theme and terminology choices must not alter scheduling meaning.

### FR-PERS-003

Users can choose among:

- Gentle
- Balanced
- Full

planning styles.

Balanced is the initial default.

---

# 25. Product Requirements Explicitly Excluded From Initial Versions

The initial product should not include:

- productivity scores
- social networking features
- leaderboards
- streaks
- competitive gamification
- punishment mechanics
- complicated time tracking
- separate numerical scores for every energy dimension
- native iOS application
- native Android application
- automatic external calendar modification
- automatic instructor emails
- AI making consequential decisions without user review
- large analytics dashboards
- machine-learning models where straightforward statistical methods are
  sufficient

The web application should be architected so future mobile expansion remains
possible.

---

# 26. Product Success

The application succeeds when users can answer:

"What can I realistically do today?"

without first being confronted by everything they have not completed.

A successful plan:

- reflects current capacity
- respects real-world obligations
- protects important deadlines
- leaves breathing room
- adapts when circumstances change
- communicates honestly when work will not fit
- helps the user recover without judgment
- keeps the user in control

The application should optimize for useful planning rather than maximizing
task completion.

The final guiding principle remains:

> The schedule adapts to the person. The person does not fail the schedule.