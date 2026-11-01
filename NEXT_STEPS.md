# Energy Planner Project Status

Current Branch:
feature/dependencies

Current Phase:
Phase 7 - Dependencies & Scheduling Constraints

Completed

- Phase 0 Foundation
- Phase 1 Application Shell
- Phase 2 Database Layer
- Prisma Shadow Database Configuration
- Phase 3 Core Task System
- Phase 4 Student Features
- Phase 5 Energy & Capacity
- Phase 6 Scheduler Foundation

Current Functionality

Tasks
- Create tasks
- Edit tasks
- Complete tasks
- Archive tasks
- Academic task types
- Course associations
- Energy requirements

Courses
- Course management
- Instructor management
- Academic metadata

Capacity
- Daily capacity tracking
- Capacity history
- Energy-type capacity
- Optional observations

Scheduler Foundation
- Eligibility engine
- Scheduling reason codes
- Capacity-aware evaluation
- Energy-fit evaluation
- Deadline evaluation
- Constraint evaluation
- Scheduler service layer

Current Phase Goals

Phase 7 - Dependencies & Scheduling Constraints

Implement:
- Task dependencies
- Dependency validation
- Circular dependency prevention
- Dependency-aware eligibility
- Dependency visibility
- Scheduler integration

Do Not Implement:
- Schedule generation
- Recommendations
- Week planning
- Calendar integration
- Automatic task assignment
- Recovery Mode
- Survival Mode

Current Phase Architectural Direction

Dependencies should integrate into the scheduler foundation.

Scheduler responsibility remains:

"Can this task fit?"

Scheduler does not yet answer:

"Should this task be scheduled?"

Dependency completion is expected to be based primarily on
task completion state rather than scheduler eligibility.

Version 1.01 Candidates

## Due Date UX

Problem:
Date-only deadlines may display meaningless timestamps.

Potential solution:
- Date-first presentation
- Optional time disclosure
- Hide implicit end-of-day times
- Show only explicitly-selected times

Status:
Deferred.

## Capacity Check-In UX

Problem:
Display and edit modes appear simultaneously.

Potential solution:

Display
→ Update Capacity
→ Edit
→ Save
→ Display

Potential future refinement:
Inline editing of capacity rows.

Status:
Deferred.

## Task Card Polish

Potential future review:
- spacing
- metadata density
- Details behavior
- click targets

Status:
Deferred.

Technical Debt

## Development User Upsert

Current workaround:

- findUnique()
- create if missing

Original upsert path causes:

Unique constraint failed on users_pkey

Observed during desktop migration.

Future investigation required.

Known Technical Notes

- Prisma pg adapter warning during tests.
- npm tmp configuration warning.
- ensureDevelopmentUser should eventually be reviewed.

Future Ideas

## Student Hub

Goal:
Provide a friendlier layer over institutional systems.

Potential Features:
- Class schedules
- LMS links
- Campus locations
- Degree requirements
- Degree progress
- Advisor information

Principles:
- Optional
- Reduced cognitive load
- Manual entry first
- Imports later

## Gentle Habit Tracking

Potential future product or module.

Principles:
- No streak pressure
- No punishment for missed days
- Progress remains visible
- ADHD-friendly
- Accommodates fluctuating capacity

Product Philosophy

Energy Planner should remain:

- calm
- supportive
- accessible
- low-pressure
- capacity-aware

Monetization Philosophy

- Web app remains free
- No subscriptions
- Optional donations only
- No feature-gating
- No donor-exclusive features

Potential future mobile apps may use a one-time purchase model while keeping the web app free.