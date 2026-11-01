# Energy Planner Project Status

Current Branch:
main

Current Phase:
Phase 7 - Dependencies & Scheduling Constraints

Known issue:
Prisma upsert() in development-user.ts fails with
"Unique constraint failed on users_pkey"

Manual findUnique() + create fallback works correctly.

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
- Quick Add
- Editing
- Completion
- Archive/restore
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
- Energy observations
- Per-type capacity

Scheduler Foundation
- Eligibility engine
- Constraint evaluation
- Capacity-aware logic
- Deadline evaluation
- Energy fit evaluation
- Scheduler service layer
- Deterministic rule evaluation

Known Technical Notes

- Prisma/pg adapter deprecation warning exists during tests.
- npm "tmp" configuration warning exists.
- ensureDevelopmentUser still runs from the layout request path.

Version 1.01 Candidates

## Due Date UX

Problem:
Date-only deadlines may display unnecessary timestamps.

Potential solution:
- Date-first UI
- Optional time disclosure
- Hide implicit end-of-day times
- Show explicitly chosen times

Status:
Version 1.01 review item.

## Capacity Check-In UX

Problem:
Display mode and edit mode appear simultaneously.

Potential solution:
Display
→ Update Capacity
→ Edit
→ Save
→ Display

Future possibility:
Directly editable capacity rows.

Status:
Version 1.01 review item.

## Task Card Polish

Potential review:
- spacing refinements
- Details behavior
- click targets
- metadata density

Status:
Version 1.01 review item.

Future Ideas

## Student Hub

Potential future features:
- Class schedules
- LMS links
- Campus locations
- Degree requirements
- Degree progress
- Advisor notes

Goal:
Make institutional systems friendlier and less overwhelming.

Upcoming Phase

Phase 7 - Dependencies & Scheduling Constraints

Goals:
- Task dependency evaluation
- Dependency graph logic
- Circular dependency handling
- Scheduler integration with eligibility engine

Not Yet Implemented

- Schedule generation
- Recommendations
- Week planning
- Survival Mode
- Recovery Mode
- Deadline Intervention
- Calendar integration
- Authentication
- Student Hub
- Mobile apps

Product Philosophy

Energy Planner should remain:
- calm
- supportive
- accessible
- low-pressure
- capacity-aware

Monetization Philosophy

- Web application remains free.
- No subscriptions.
- Optional donations only.
- Donations never unlock features.
- Core functionality remains available to everyone.