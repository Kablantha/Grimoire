# Energy Planner Project Status

Current Branch:
main

Current Phase:
Phase 5 - Energy & Capacity

Completed:

- Phase 0 Foundation
- Phase 1 Application Shell
- Phase 2 Database Layer
- Prisma Shadow Database Configuration
- Phase 3 Core Task System
- Phase 4 Student Features

Current Functionality

Tasks
- Quick Add
- Task editing
- Task completion
- Task archive/restore
- Optional planning details
- Academic task types
- PostgreSQL persistence

Courses
- Course creation
- Course editing
- Course archive/restore
- Course details
- Instructor associations
- Task associations

Instructors
- Instructor creation
- Instructor editing
- Optional office hours
- Optional notes

Platform
- PostgreSQL + Prisma
- Accessible navigation
- Responsive layouts
- Test coverage
- Development-user architecture

Known Technical Notes

- Prisma/pg adapter emits an existing deprecation warning during tests.
- npm emits inherited "Unknown global config 'tmp'" warning.
- Neither warning currently affects functionality.
- ensureDevelopmentUser still runs from the layout request path and should be reviewed later.

Future UX Review

## Due Date Presentation

Current behavior can show technically valid but often meaningless timestamps.

Example:

Thursday, October 29, 2026 at 12:28 PM

Future review should distinguish:

Date-only deadlines:
- Oct 29
- Thu, Oct 29

Date and time deadlines:
- Oct 29 • 11:59 PM
- Thu, Oct 29 • 9:00 AM

Goal:
Show only information that is meaningful to planning decisions.

This is currently considered a display problem rather than a scheduling problem.

Future scheduling logic should not assume every due date has a meaningful time component.

## Task Card Polish

Phase 4 improved hierarchy significantly.

Future review may revisit:
- overall spacing
- density of metadata
- card click behavior vs Details link
- course metadata presentation

None of these are considered blockers.

Future Idea: Student Hub

Goal:
Create a friendly layer over existing academic systems.

Problem:
Academic information exists but is often difficult to navigate and emotionally overwhelming.

Potential Features:
- Class schedules
- LMS links
- Campus locations
- Degree requirements
- Graduation progress
- Academic reference information
- Advisor notes
- Optional degree planning

Principles:
- Entirely optional
- Manual entry first
- Imports later
- Present information more clearly than existing institutional systems
- Reduce cognitive load

The goal is not to replace campus systems.

The goal is to make them easier to understand.

Upcoming Phase

Phase 5 - Energy & Capacity

Goals:
- Capacity modeling
- Energy-aware planning
- Energy-type planning support
- Capacity concepts
- Foundations for future scheduling

Not Yet Implemented

- Automatic scheduling
- Dependency workflows
- Week planning
- Survival Mode
- Recovery Mode
- Deadline Intervention
- Calendar integration
- Authentication
- Mobile apps
- Student Hub
- Degree planning
- Import tools

Product Philosophy

Energy Planner should remain:

- calm
- supportive
- accessible
- low-pressure

Monetization Philosophy

- Web application remains free.
- No subscription model.
- Optional donations may help cover development and hosting costs.
- Donations do not unlock features.
- Donations do not create user tiers.
- Core functionality remains available regardless of support level.

Possible future mobile apps may use a one-time purchase model while keeping the web application free.

## Version 1.01 Candidates

### Due Date UX

Problem:
Date-only deadlines currently display technically correct timestamps
that are often not meaningful.

Example:
Thu, Oct 29, 12:28 PM

Potential future approach:

- Due date visible by default.
- Due time hidden behind optional disclosure.
- If user does not specify a time, default internally to end-of-day.
- Hide end-of-day times from normal display.
- Display time only when explicitly set by the user.

Goal:
Reduce cognitive load while preserving support for true time-specific deadlines.

Status:
Post-v1 review item.