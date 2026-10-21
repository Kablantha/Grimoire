# Energy Planner
## Implementation Plan

## 1. Purpose

This document defines the incremental development strategy for Energy Planner.

Development should proceed in small, testable phases.

Each phase should leave the application in a functional state.

Do not attempt to build the entire product at once.

The implementation strategy should favor:

- small reviewable changes
- explicit requirements
- automated tests
- accessibility from the beginning
- strong separation of business logic and presentation
- deterministic scheduling behavior
- user autonomy
- progressive complexity
- stable working branches

Before implementing functionality, consult:

- PRODUCT_REQUIREMENTS.md
- DATA_MODEL.md
- SCHEDULER_SPEC.md
- UI_SPEC.md

When implementation choices conflict with these documents, stop and resolve
the conflict rather than silently changing product behavior.

---

# 2. Recommended Technical Architecture

The initial application should use:

## Application Framework

Next.js using the App Router architecture.

## Language

TypeScript.

## User Interface

React.

## Styling

Tailwind CSS.

## Database

PostgreSQL.

## ORM

Prisma ORM.

## Runtime Validation

Zod.

## Source Control

Git and GitHub.

## Development Environment

Visual Studio Code with GitHub Copilot.

## Initial Deployment Target

Vercel is the preferred initial deployment environment.

These choices may be revisited when a concrete technical limitation requires
it, but architectural changes should be deliberate rather than incidental.

---

# 3. Architectural Boundaries

Keep the application divided conceptually into:

## Presentation

Responsible for:

- pages
- components
- forms
- interaction
- accessible presentation

## Application / Domain Logic

Responsible for:

- task rules
- recurrence rules
- dependency validation
- scheduling
- capacity calculations
- Survival Mode
- Recovery Mode
- deadline intervention
- learning recommendations

## Persistence

Responsible for:

- database access
- Prisma
- migrations
- repositories or equivalent data-access patterns

## Integrations

Responsible for:

- calendar providers
- future email integrations
- future AI providers
- external services

Do not place scheduler logic directly inside React components.

Do not couple the scheduling engine directly to a specific calendar provider.

---

# 4. Repository Documentation

The repository should maintain:

.github/copilot-instructions.md

docs/
- PRODUCT_REQUIREMENTS.md
- DATA_MODEL.md
- SCHEDULER_SPEC.md
- UI_SPEC.md
- IMPLEMENTATION_PLAN.md

These documents are part of the application's implementation source of truth.

When behavior intentionally changes, update the relevant documentation along
with the implementation.

---

# 5. Development Workflow

For each implementation unit:

1. Identify the exact requirements being implemented.
2. Read the relevant documentation.
3. Create or use an appropriate feature branch.
4. Write or update tests when applicable.
5. Implement the smallest coherent solution.
6. Run relevant tests.
7. Run linting.
8. Run TypeScript checks where configured.
9. Review for accessibility.
10. Review for unintended scope expansion.
11. Commit only when the application is in a coherent state.

Do not claim a test passed unless it was actually run successfully.

---

# 6. Git Strategy

The main branch should remain functional.

Use focused feature branches such as:

feature/task-quick-add

feature/daily-energy

feature/scheduler-time-capacity

feature/hard-dependencies

feature/survival-mode

feature/recovery-mode

Complete and test work before merging it into main.

Focused branches provide an easy recovery path if automated coding tools make
unwanted architectural changes.

---

# 7. Copilot Development Strategy

GitHub Copilot should receive bounded implementation tasks.

Avoid prompts such as:

"Build the scheduler."

Prefer prompts such as:

"Implement only the time-availability calculation defined for Scheduler Phase
6A. Write tests for the listed scenarios first. Do not implement energy,
priority, dependency, Survival Mode, or Recovery Mode behavior."

Each Copilot request should identify:

- relevant documentation
- requirements or scenarios
- allowed implementation scope
- explicit exclusions
- test expectations
- validation commands

Copilot should not be asked to invent unspecified product requirements.

---

# 8. Phase 0: Foundation

## Objective

Create an empty but operational development environment.

## Implement

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- testing framework
- base folder structure
- Git repository
- GitHub Copilot repository instructions
- project documentation
- environment configuration
- basic scripts for checking application health

## Do Not Implement Yet

- database
- authentication
- task management
- courses
- scheduler
- AI
- calendar integration

## Done When

The project can successfully run its configured development and quality
commands.

Expected commands should include equivalents of:

npm run dev

npm run lint

npm test

A TypeScript validation command should also be available, either directly or
through the framework build/typecheck configuration.

---

# 9. Phase 1: Application Shell

## Objective

Create the accessible responsive structure of the application without
substantial domain functionality.

## Implement

Primary routes:

- /today
- /week
- /tasks
- /courses
- /settings

The root route may redirect to or render Today.

Implement:

- responsive primary navigation
- mobile navigation
- placeholder Today page
- placeholder Week page
- placeholder Tasks page
- placeholder Courses page
- placeholder Settings page
- global Quick Add affordance
- semantic page landmarks
- visible keyboard focus
- basic responsive layout

Courses navigation should respect whether Student Features are enabled once
that preference exists.

During this phase, a temporary placeholder is acceptable.

## Test

- routes render
- primary navigation works
- keyboard navigation works
- page headings are present
- basic responsive layout is usable
- no primary action requires hover

## Done When

A user can navigate through the application shell using keyboard, pointer, or
touch interaction.

---

# 10. Phase 2: Core Persistence and Database

## Objective

Introduce persistent domain data.

## Implement Initial Entities

Begin with the entities necessary for core task management:

- User
- Task
- TaskDependency
- TaskVariant
- EnergyType
- TaskEnergyType
- Project
- Category
- Course
- Instructor

Do not implement all future entities merely because they appear in
DATA_MODEL.md.

Later phases should introduce their own required persistence structures.

## Implement

- Prisma configuration
- PostgreSQL connection
- initial schema
- initial migration
- seed or development data only when useful
- runtime validation where appropriate
- data access abstractions where they improve separation

## Integrity Requirements

Preserve:

- Task title requirement
- optional task metadata
- simple Task status model
- no stored overdue status
- academic work remains Task
- relational energy types
- dependency relationships

Circular dependency validation may be fully implemented during the dependency
phase if appropriate, but the schema must not prevent future implementation.

## Done When

The application can reliably create and retrieve core domain records against
the development database and migrations work from a clean development state.

---

# 11. Phase 3: Core Task System

## Objective

Produce the first genuinely useful version of Energy Planner.

## Implement

Quick Add:

- title input
- Add action
- title-only task creation

Task management:

- create
- view
- edit
- complete
- archive
- restore

Optional task information:

- description
- due date/time
- estimated duration
- energy level
- energy types
- priority
- category
- project
- course where available
- minimum variant

## Critical Requirement

The following is valid:

Task:
"Finish assignment"

Everything else:
unknown or null

Do not force users to populate planning metadata merely to capture a task.

## UX Requirements

Quick Add should initially expose only what is necessary.

Additional information uses progressive disclosure.

## Test

Include tests for:

- title-only creation
- optional fields
- completion
- archival
- restoration
- invalid empty title
- valid missing duration
- valid missing deadline
- valid missing energy

## Done When

Energy Planner is usable as a basic task manager even though automatic
scheduling is not yet implemented.

---

# 12. Phase 4: Student Features

## Objective

Extend the generic task system for academic use without creating a parallel
assignment system.

## Implement

Course management:

- create course
- edit course
- archive course if needed
- instructor association
- course code
- term
- dates
- LMS link

Instructor management:

- name
- email
- office hours
- notes

Academic task metadata:

- reading
- assignment
- discussion
- quiz
- exam
- project
- study
- other

Course task views.

## Architectural Rule

An assignment is still a Task.

Do not introduce separate core models such as:

- Assignment scheduler
- Reading scheduler
- Chore scheduler

All participate in the same task and scheduling infrastructure.

## Done When

A student can organize academic work by course while continuing to manage
ordinary life tasks in the same application.

---

# 13. Phase 5: Energy, Capacity, and Commitments

## Objective

Introduce the core information necessary for energy-aware planning.

## Implement

- DailyCapacity
- EnergyObservation
- Commitment
- RecurrenceRule
- typical weekly energy
- daily energy confirmation
- mid-day energy changes
- planning style
- energy terminology
- default energy types

## Terminology

Support:

- Energy
- Spoons
- Spell Slots
- Battery

Terminology affects presentation only.

## Commitments

Support manually created fixed commitments.

Recurring responsibility structures should support:

- fixed
- flexible
- preferred

Full automatic recurrence placement may evolve with the scheduler phases.

## UX

Implement the daily check-in concept:

"We planned around a 3. How are you actually feeling?"

Do not require daily check-in before the application can be used.

## Done When

The application can represent:

- expected energy
- reported energy
- fixed commitments
- recurring responsibilities
- planning style

without yet requiring a sophisticated scheduler.

---

# 14. Phase 6: Scheduler Core

## Objective

Build the scheduler incrementally.

Do not implement the entire scheduling engine in one task.

The scheduler must remain independently testable outside React components.

---

# 15. Phase 6A: Clock Availability

## Implement

Calculate raw available time from:

- planning window
- fixed commitments
- overlapping commitments

Avoid double-counting overlapping commitment intervals.

## Required Tests

1. Day with no commitments
2. Day with one fixed commitment
3. Multiple non-overlapping commitments
4. Overlapping commitments
5. Day with no remaining flexible time

## Explicitly Exclude

- priority
- energy
- dependencies
- Survival Mode
- Recovery Mode
- historical learning

---

# 16. Phase 6B: Basic Task Placement

## Implement

Place tasks into valid available clock intervals using estimated duration.

Support tasks with enough information to be scheduled.

Tasks missing required planning information may return a needs-information
result rather than receiving invented values.

## Tests

Include:

- one fitting task
- multiple fitting tasks
- task larger than available interval
- no available interval
- unknown duration

---

# 17. Phase 6C: Deadlines

## Implement

Add deadline awareness to scheduler placement.

Tasks should be placed early enough to protect consequential deadlines.

The scheduler must detect when work does not fit before its deadline.

## Tests

Use scenarios from SCHEDULER_SPEC.md including:

- DEAD-001
- DEAD-002
- DEP-003 where relevant
- IMPOSSIBLE-001 where foundational support exists

The exact deadline intervention UI may be implemented later.

During this phase, returning a structured needs-intervention result is
sufficient.

---

# 18. Phase 6D: Priority

## Implement

Integrate:

- Must Do
- Should Do
- Could Do
- Whenever

Lower-priority optional work should not displace consequential required work.

Priority must not override hard constraints.

## Tests

Include mixed-priority tasks competing for limited realistic capacity.

---

# 19. Phase 6E: Energy Matching

## Implement

Use:

- current or predicted daily energy
- task energy requirement

Energy is a fit signal rather than an absolute eligibility threshold.

## Tests

Include:

- ENERGY-001
- ENERGY-002
- tasks with unknown energy
- low-energy days
- higher-energy work that still must eventually be placed

Do not yet implement mathematically precise per-energy-type budgets.

---

# 20. Phase 6F: Protected Capacity

## Implement

Apply planning style:

- Gentle
- Balanced
- Full

Protected capacity should consider more than raw minute multiplication where
practical.

At minimum, avoid scheduling every technically free minute.

The implementation may become more sophisticated as additional commitment and
energy rules are introduced.

## Tests

Include:

- BASIC-002
- capacity remains open after required work
- Full still retains a buffer
- task completion does not automatically cause open capacity to be refilled

---

# 21. Phase 6G: Scheduling Reasons

## Objective

Make scheduler output explainable.

## Implement

Structured reason data sufficient to explain decisions such as:

- dependency
- deadline
- energy match
- available time
- priority
- recurrence
- protected capacity
- manual choice

User-facing phrasing belongs primarily to the presentation layer.

The scheduler should return meaningful structured reasons rather than final
paragraphs of UI copy.

---

# 22. Phase 7: Dependencies

## Objective

Add task dependency behavior after the scheduler fundamentals are stable.

## Implement

- hard dependencies
- soft dependencies
- dependency ordering
- cycle detection
- dependency conflict reporting

## Required Tests

A -> B

A -> B -> C

A -> B and A -> C

Soft dependency bypass

Circular dependency:

A -> B
B -> C
C -> A

Expected:

the final relationship is rejected.

## UX

Translate cycle errors into language such as:

"That would create a loop where each task is waiting for another one to
finish first."

Do not expose graph/database terminology unless useful in developer logs.

---

# 23. Phase 8: Week Planning and ScheduleEntry

## Objective

Connect scheduler output to a durable and editable weekly plan.

## Implement

- ScheduleEntry
- automatic placements
- manual placements
- user locks
- Week view scheduling
- Move To interaction
- drag-and-drop where appropriate
- accessible non-drag alternative
- schedule explanations
- schedule stability

## Manual Decisions

Manually moved tasks become protected from routine replanning.

When a manual placement conflicts with planning constraints, present the
conflict rather than silently undoing the user decision.

## Required Tests

Include:

- MANUAL-001
- MANUAL-002
- equal scheduling options
- preservation of existing placements
- minimal replan after small changes

## Done When

A user can see, understand, and manually adjust the automatically generated
week.

---

# 24. Phase 9: Survival Mode

## Objective

Implement the low-capacity planning experience after normal scheduling is
stable.

Survival Mode should reuse the underlying scheduling infrastructure rather
than becoming a separate independent scheduler.

Conceptually, the system may support strategies such as:

- normal scheduling
- survival scheduling

over shared scheduling rules.

## Implement

- Survival Mode activation
- minimum task variants
- consequential-task protection
- safe rescheduling
- optional-task removal from today's expectations
- review-before-apply workflow
- Survival Mode scheduling reasons

## Required Behavior

Survival Mode asks:

"What is the smallest amount of work that protects what matters most?"

Priority order:

1. Immediate unavoidable commitments
2. Critical deadline protection
3. Short Must Do tasks with significant consequences
4. Minimum viable task variants
5. Safe rescheduling of remaining work

## Required Tests

Include:

- SURV-001
- task with minimum variant
- task without minimum variant
- imminent deadline
- flexible recurring responsibility
- optional task removal
- hard dependency during Survival Mode
- impossible workload even after Survival Mode reduction

## UX

Use supportive language.

Do not create:

- productivity penalties
- streak loss
- failure states
- performance scores

## Done When

A user can activate Survival Mode, review a substantially reduced proposed
plan, adjust it, and apply it without losing control of their schedule.

---

# 25. Phase 10: Recovery Mode

## Objective

Help users reconstruct realistic schedules after multiple disrupted days.

Recovery Mode must use existing scheduler capabilities.

Do not implement it as an unrelated second planning system.

## Implement

Evaluation of unfinished work against:

- deadlines
- dependencies
- remaining time
- future energy
- priority
- commitments
- minimum variants
- user-locked scheduling

Possible recovery classifications:

- still comfortably achievable
- achievable with replanning
- may need reduced scope
- may require deadline intervention
- safe to postpone

## Required Tests

Include:

- RECOV-001
- multiple unfinished days
- completed work remains completed
- flexible tasks move safely
- user-locked placements remain protected
- dependency chains remain valid
- required workload exceeding remaining capacity

## Critical Requirement

Recovery Mode must never simply move all unfinished work onto the current day.

## Done When

A user can request help rebuilding the week and receive a realistic,
reviewable plan that explicitly identifies work that cannot comfortably fit.

---

# 26. Phase 11: Deadline Intervention

## Objective

Turn scheduler infeasibility into useful next actions.

## Implement

DeadlineIntervention persistence where appropriate.

Possible actions:

- Replan
- Break into steps
- Use minimum variant
- Reduce scope
- Ask for help
- Contact instructor
- Dismiss or handle manually

## Required Behavior

The application must clearly distinguish:

"Scheduling calculation failed"

from:

"The workload does not realistically fit."

The second is a valid domain result.

## Student Communication

Initial instructor communication should prefer predictable editable templates.

Generative AI is not required for the first implementation.

Known information may populate:

- instructor name
- course
- assignment
- deadline
- proposed completion date

Messages must never be sent automatically.

## Done When

Users encountering an infeasible deadline receive calm, actionable options
rather than an impossible schedule.

---

# 27. Phase 12: Historical Learning

## Objective

Use voluntarily provided historical information to improve planning
recommendations.

## Implement

- TaskCompletion
- expanded EnergyObservation usage
- LearningRecommendation
- recommendation acceptance
- recommendation rejection
- recommendation dismissal

Initial learning should use simple transparent statistics.

Examples:

- median actual duration
- recent typical reported energy
- appropriately filtered averages when justified

Do not introduce machine-learning models merely because historical data is
available.

## Important Rule

Historical analysis recommends changes to scheduling inputs.

It does not silently change scheduler behavior.

## Required Tests

Include:

- accepted energy recommendation
- declined energy recommendation
- accepted duration recommendation
- missing actual duration
- historical records remain unchanged
- declined recommendation does not immediately return

## Done When

The application can make useful historical recommendations while the user
retains authority over whether those recommendations change future planning.

---

# 28. Phase 13: Calendar Integration

## Objective

Allow external calendar commitments to inform available time and capacity.

## Initial Scope

Read-only calendar integration.

External events should be normalized into internal Commitment records or an
equivalent normalized structure.

The scheduler should not depend directly on provider-specific event objects.

## Provider Boundary

Use a provider abstraction or equivalent architecture.

Conceptually:

CalendarProvider
- connect
- disconnect
- fetchEvents

Provider-specific implementation belongs in the integrations layer.

## Initial Behavior

Imported events:

- reduce clock availability appropriately
- appear as commitments
- may contribute qualitative energy information when the user configures it

Energy Planner does not automatically:

- move external events
- cancel external events
- create external events
- modify external event times

unless a future product phase explicitly introduces such functionality.

## Done When

A connected calendar can inform Energy Planner capacity without giving Energy
Planner authority to rearrange the user's external calendar.

---

# 29. Phase 14: Progressive Web App

## Objective

Make the responsive web application useful as an installable web experience
before committing to native mobile development.

## Implement as appropriate

- web app manifest
- application icons
- installable experience
- responsive standalone layouts
- appropriate caching strategy
- offline-safe behavior where feasible

Do not promise full offline scheduling or data synchronization unless it is
explicitly implemented and tested.

## Mobile Principle

The PWA should validate whether the responsive web application adequately
serves mobile use before maintaining separate:

- iOS
- Android

applications.

## Done When

The application can be installed where supported and its core interface
remains usable in the installed responsive experience.

---

# 30. Phase 15: Accessibility and Resilience Hardening

## Objective

Perform a dedicated quality pass without treating accessibility as something
that begins only in this phase.

Accessibility requirements should already have been implemented throughout
development.

This phase verifies them comprehensively.

## Accessibility Review

Test:

- keyboard-only use
- focus visibility
- focus order
- dialog focus handling
- screen-reader labels
- semantic headings
- form labels
- reduced motion
- color contrast
- non-color status indicators
- 200% browser zoom
- larger text
- mobile touch targets
- non-drag scheduling alternatives

Use automated accessibility testing where useful, but do not treat automated
checks as a substitute for manual interaction testing.

## Important Workflows to Test

Keyboard-only testing should cover:

- Quick Add
- task editing
- marking complete
- changing daily energy
- moving a task
- Week navigation
- Survival Mode
- Recovery Mode
- Deadline Intervention
- settings

---

# 31. Scheduler Resilience Testing

Test scheduler behavior around:

- daylight-saving transitions
- timezone changes
- deadlines near midnight
- recurring activities across month boundaries
- overlapping commitments
- deleted or archived prerequisites
- missing task durations
- missing task energy
- no flexible capacity
- sustained low-energy periods
- large task inventories
- multiple dependencies
- user-created conflicting placements
- partial schedule generation
- failed persistence after schedule calculation

The scheduler should fail safely and return meaningful domain results.

---

# 32. Data Safety Hardening

Review:

- database constraints
- migrations
- transaction boundaries
- deletion behavior
- dependency integrity
- user-data export
- user-data deletion
- backup strategy
- connected-service credentials
- secret handling
- environment variables

Never commit secrets to Git.

Do not expose database credentials or integration tokens to browser-side
client code.

---

# 33. Performance Review

Measure rather than guess.

Review:

- Today rendering
- Week rendering
- task-list performance
- scheduler calculation time
- database query behavior
- unnecessary client JavaScript
- excessive network requests

Do not prematurely optimize hypothetical performance problems during early
phases.

Correctness and architectural clarity come first.

---

# 34. Phase 16: Product Polish

## Objective

Improve visual and emotional quality after core behavior is reliable.

Possible work includes:

- refined visual hierarchy
- improved empty states
- polished microcopy
- icons
- optional themes
- tasteful transitions
- PWA assets
- onboarding refinements
- Spell Slot presentation improvements

Do not prioritize decorative animation over scheduler correctness,
accessibility, or data integrity.

The application should remain visually calm.

---

# 35. Authentication Strategy

Authentication is intentionally not required in the earliest local prototype.

The application should first prove:

- task behavior
- capacity behavior
- scheduler behavior
- core UX

before authentication complexity is introduced.

Before a publicly deployed version stores real user data, authentication and
user isolation must be implemented.

The exact provider should be selected during the deployment/security phase
using current platform requirements.

Do not hard-code the domain model around a specific authentication vendor.

---

# 36. Local Development Versus Production Data

Local development should use development-only data.

Do not put real personal, academic, or sensitive planning data into:

- test fixtures
- example source files
- committed seed data
- screenshots committed to the repository

Production data must remain separated from test and development data.

---

# 37. Testing Layers

Use multiple test levels as appropriate.

## Unit Tests

Appropriate for:

- scheduler functions
- dependency validation
- duration calculations
- capacity calculations
- learning statistics

## Component Tests

Appropriate for:

- energy controls
- Quick Add
- task cards
- dialogs
- Move To controls

## Integration Tests

Appropriate for:

- task creation and persistence
- scheduler plus persistence
- course/task relationships
- schedule application
- Recovery Mode

## End-to-End Tests

Introduce for critical complete workflows when the application reaches the
appropriate maturity.

Potential workflows:

- create task -> schedule -> complete
- create dependency chain -> generate plan
- change today's energy -> review replan
- activate Survival Mode -> accept plan
- recover disrupted week
- handle impossible deadline

---

# 38. Test Philosophy

Tests should focus on user-visible and domain behavior rather than incidental
implementation details.

Prefer:

"Hard dependencies are never automatically reversed."

over:

"Private helper function X was called three times."

A refactor that preserves behavior should not require rewriting the entire
test suite.

Scheduler scenarios in SCHEDULER_SPEC.md should serve as acceptance criteria
where applicable.

---

# 39. Logging

Developer logs may contain technical information necessary for diagnosis.

User-facing messages should remain clear and nontechnical.

Do not expose:

- stack traces
- raw query failures
- database internals
- secret values
- authentication tokens

to users.

Logging must also avoid unnecessarily capturing sensitive user content.

---

# 40. Privacy Principles

Energy Planner may eventually store information that reveals patterns about a
person's:

- schedule
- coursework
- routines
- reported capacity
- task completion

Treat this information conservatively.

Collect only information needed for product functionality.

Do not build behavioral advertising functionality.

Do not sell or expose planning-history data through product features.

Any future analytics should be deliberately designed with privacy in mind.

---

# 41. AI Integration Boundary

AI should not become a fundamental dependency of the core planner.

Core functionality should continue working without generative AI.

Potential future AI-assisted features include:

- suggesting task chunks
- drafting optional communications
- helping describe task scope

AI must not silently control:

- schedule feasibility
- user energy assumptions
- historical preference changes
- calendar mutation
- communication sending

Where deterministic code can solve the problem transparently, prefer
deterministic code.

---

# 42. Prompting GitHub Copilot

Each implementation prompt should contain:

## Context

Which documentation Copilot should inspect.

Example:

Read:
- docs/PRODUCT_REQUIREMENTS.md
- docs/SCHEDULER_SPEC.md
- .github/copilot-instructions.md

## Task

One bounded implementation objective.

## Scope

What Copilot is allowed to change.

## Explicit Exclusions

What must not be implemented during this prompt.

## Tests

Exact behaviors that must be tested.

## Validation

Commands to run before considering the task finished.

## Report

Ask Copilot to summarize:

- files changed
- behavior implemented
- tests added
- commands run
- unresolved concerns

---

# 43. Example Copilot Prompt Pattern

Example:

Read `.github/copilot-instructions.md` and
`docs/SCHEDULER_SPEC.md` before making changes.

Implement only Phase 6A clock-availability calculation.

Requirements:
- Calculate available time around fixed commitments.
- Merge overlapping commitment intervals before calculating unavailable time.
- Return zero available flexible time when commitments consume the complete
  planning window.

Write tests first for:
1. No commitments.
2. One commitment.
3. Multiple non-overlapping commitments.
4. Overlapping commitments.
5. No remaining time.

Do not implement:
- priority
- energy
- dependencies
- recurrence scheduling
- Survival Mode
- Recovery Mode
- historical learning

Keep scheduler logic outside React components.

Run the relevant test suite and TypeScript validation when finished.

Do not modify unrelated files.

Report:
- files changed
- tests added
- commands run
- any unresolved issue

This pattern should be adapted to each development task.

---

# 44. Copilot Scope Control

If Copilot proposes unrelated changes:

- reject them
- narrow the prompt
- restore the feature branch if necessary

Do not accept a broad rewrite merely because it appears sophisticated.

Before architectural changes, ask:

1. Is the change required by the current phase?
2. Does it preserve the domain model?
3. Does it preserve scheduler behavior?
4. Does it preserve accessibility?
5. Does it preserve user autonomy?
6. Does it simplify the system enough to justify migration risk?

If not, defer it.

---

# 45. Initial Milestones

## Milestone A: Navigable Prototype

Completed after Phase 1.

User can:

- open application
- navigate primary pages
- use accessible responsive navigation

No meaningful task persistence is required yet.

## Milestone B: Functional Task Manager

Completed after Phase 3.

User can:

- add tasks quickly
- manage task details
- complete tasks
- archive tasks

## Milestone C: Energy-Aware Planner Foundation

Completed after Phase 5.

User can:

- establish typical energy
- report today's energy
- manage commitments
- choose planning style
- use preferred energy terminology

## Milestone D: Core Automatic Planner

Completed after Phase 8.

User can:

- receive an automatic plan
- understand why tasks were placed
- view the week
- move tasks
- preserve manual choices
- use dependencies

This is the primary initial product milestone.

## Milestone E: Supportive Recovery Planner

Completed after Phase 11.

User can:

- activate Survival Mode
- recover a disrupted week
- receive deadline intervention
- identify work that genuinely does not fit

This is a major product differentiation milestone.

## Milestone F: Adaptive Planner

Completed after Phase 12.

User receives historical recommendations while retaining control over whether
they alter future planning.

---

# 46. Definition of Done for a Feature

A feature is not finished merely because the interface appears to work.

Where applicable, Done means:

- relevant requirements are implemented
- appropriate tests pass
- TypeScript validation passes
- linting passes
- accessibility behavior is reviewed
- keyboard behavior works
- errors have usable recovery behavior
- documentation is updated if behavior changed
- unrelated functionality remains intact
- no known blocking defect remains hidden

---

# 47. Definition of Done for Scheduler Work

Scheduler work additionally requires:

- deterministic test coverage
- explicit handling of infeasible results
- no React dependency in core scheduling logic
- correct hard-constraint behavior
- structured reasons where relevant
- no invented user data
- no silent user-preference changes
- existing scheduler tests remain passing

---

# 48. Definition of Done for UI Work

UI work additionally requires:

- meaningful semantic elements
- keyboard operability
- visible focus
- responsive behavior
- non-color communication of important state
- loading behavior where required
- error behavior where required
- labels for icon-only controls
- reduced-motion consideration when animation exists

---

# 49. Dependency Management

Add dependencies only when they solve a concrete problem.

Before adding a package, consider:

- Is the functionality already available through the framework?
- Is the package maintained?
- Does it add substantial client-side weight?
- Does it introduce accessibility concerns?
- Is its functionality difficult enough to justify another dependency?
- Can it be isolated from core domain logic?

Do not add large libraries solely for one trivial helper function.

---

# 50. Database Migration Strategy

Database changes should use migrations.

Do not directly mutate production schema outside the application's migration
process.

Before destructive migration:

- understand existing data impact
- create an appropriate backup strategy
- provide transformation when necessary
- test migration against representative development data

Early local development may tolerate resettable development databases.

Production deployment may not.

---

# 51. Deployment Strategy

Initial deployment should favor a simple supported path for:

- Next.js
- PostgreSQL
- environment secrets
- database migrations

Vercel is the initial preferred hosting target, but deployment architecture
should not put scheduler or domain behavior inside hosting-provider-specific
code.

Before production deployment, verify current platform guidance rather than
relying on outdated setup instructions.

---

# 52. Version 1 Scope

Version 1 should prioritize the complete core experience:

- task capture
- task management
- student features
- daily energy
- commitments
- recurring responsibilities
- automatic planning
- dependencies
- Week view
- manual schedule adjustment
- Survival Mode
- Recovery Mode
- Deadline Intervention
- basic historical recommendations
- accessibility
- responsive web experience

Calendar integration and PWA functionality may ship with Version 1 or shortly
after depending on implementation complexity.

Do not delay the useful core planner simply to include every future
integration.

---

# 53. Explicit Version 1 Non-Goals

Do not require Version 1 to include:

- native iOS app
- native Android app
- social networking
- collaborative task planning
- leaderboards
- achievements
- productivity scores
- completion streaks
- machine-learning prediction models
- automatic instructor email sending
- automatic external calendar editing
- enterprise project-management features
- extensive analytics dashboards

---

# 54. Project Health Rule

At the end of each phase:

Stop.

Run the application.

Run tests.

Run linting.

Run type validation.

Inspect the feature manually.

Do not immediately continue generating the next phase without verifying that
the current phase works.

A slower sequence of working milestones is preferable to a fast accumulation
of unverified code.

---

# 55. Final Implementation Principle

Energy Planner should become sophisticated through small, understandable
layers rather than through one enormous automated build.

The project should remain:

- testable
- accessible
- understandable
- maintainable
- privacy-conscious
- resistant to unnecessary scope expansion

Technical architecture exists to support the product philosophy, not replace
it.

The implementation must preserve the central principle:

> The schedule adapts to the person. The person does not fail the schedule.