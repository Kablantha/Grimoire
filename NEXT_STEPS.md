# Energy Planner Project Status

Current Branch:
feature/scheduler-foundation

Current Phase:
Phase 6 - Scheduler Foundation

Completed

- Phase 0 Foundation
- Phase 1 Application Shell
- Phase 2 Database Layer
- Prisma Shadow Database Configuration
- Phase 3 Core Task System
- Phase 4 Student Features
- Phase 5 Energy & Capacity

Current Functionality

Tasks
- Quick Add
- Task editing
- Task completion
- Task archive/restore
- Academic task types
- Course associations
- Energy requirements

Courses
- Course creation/editing
- Course archive/restore
- Instructor management
- Course task relationships

Energy & Capacity
- Daily capacity tracking
- Capacity history
- Energy-type tracking
- Optional observations
- Capacity persistence
- Calm observational UI

Platform
- PostgreSQL
- Prisma migrations
- Responsive layouts
- Accessibility support
- Development-user architecture

Known Technical Notes

- Prisma/pg adapter deprecation warning exists during tests.
- npm "tmp" configuration warning exists.
- Neither warning currently affects functionality.
- ensureDevelopmentUser still runs from the layout request path and should be reviewed later.

## Version 1.01 Candidates

### Due Date UX

Problem:
Date-only deadlines can display technically correct but often meaningless timestamps.

Potential approach:

- Due date visible by default.
- Due time hidden behind optional disclosure.
- End-of-day defaults remain hidden.
- Explicitly chosen times remain visible.

Goal:
Show only meaningful deadline information.

Status:
Version 1.01 review item.

### Capacity Check-In UX

Current behavior:
Saved capacity display and editing controls remain visible simultaneously.

Potential future interaction:

Display
→ Update Capacity
→ Edit
→ Save
→ Display

Possible refinement:
Make displayed capacity directly editable.

Example:

Mental     ●●○○○

Clicking the row reveals:

[1] [2] [3] [4] [5]

Goals:
- Reduce duplication
- Reduce cognitive load
- Preserve low-friction updates
- Maintain accessibility

Status:
Version 1.01 review item.

### Task Card Polish

Task cards are significantly improved.

Potential future review:

- spacing adjustments
- card click behavior
- Details-link treatment
- metadata density

Not considered blockers.

Future Ideas

### Student Hub

Goal:
Create a friendlier layer over existing academic systems.

Potential Features:
- Class schedules
- LMS links
- Campus locations
- Degree requirements
- Graduation progress
- Academic reference information
- Advisor notes

Principles:
- Optional
- Manual entry first
- Imports later
- Reduced cognitive load

The goal is not to replace campus systems.

The goal is to make them easier to understand.

Upcoming Phase

Phase 6 - Scheduler Foundation

Goals:
- Scheduler architecture
- Scheduling data model
- Capacity-aware scheduling rules
- Task placement logic
- Foundation before recommendations

Not Yet Implemented

- Automatic scheduling UI
- Dependency workflows
- Week planning
- Survival Mode
- Recovery Mode
- Deadline Intervention
- Calendar integration
- Authentication
- Student Hub
- Degree planning imports
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
- No subscription model.
- Optional donations may cover hosting and development costs.
- Donations do not unlock features.
- Donations do not create user tiers.
- Core functionality remains available regardless of support level.

Possible future mobile apps may use a one-time purchase model while keeping the web application free.