# Energy Planner AI Project Context

# Purpose

Energy Planner is a capacity-aware planning application.

It is designed around the idea that people have limited, fluctuating capacity and should be able to plan accordingly.

The goal is not productivity maximization.

The goal is realistic, compassionate planning.

---

# Mandatory Development Workflow

Before making recommendations, designs, implementation plans, or code changes:

1. Read AI_PROJECT_CONTEXT.md.
2. Read NEXT_STEPS.md.
3. Read all files relevant to the requested change.
4. Explain the current architecture.
5. Identify affected components.
6. Propose a design.
7. Critique the design.
8. Produce an implementation plan.
9. Await approval before coding.

Implementation may begin only after architecture review and implementation planning are complete.

This workflow is mandatory for:

- scheduler features
- dependency systems
- recommendation systems
- schedule generation
- Prisma schema changes
- database migrations
- application architecture changes
- workflow changes
- capacity evaluation logic

Simple UI refinements may skip architecture review if they do not affect business logic.

If uncertain whether a design already exists:

Investigate first.

Do not invent architecture that has not been verified in:

- source code
- Prisma schema
- project documentation
- existing implementation

Always prefer verified understanding over assumptions.

---

# Core Philosophy

Most planners assume:

- capacity is unlimited
- more output is always better
- missed tasks represent failure

Energy Planner assumes:

- capacity changes daily
- rest is valid
- planning should adapt to reality
- understanding capacity matters more than maximizing output

The application should feel:

- calm
- supportive
- accessible
- low-pressure

The application should never feel:

- judgmental
- guilt-inducing
- score-oriented
- streak-focused

---

# Product Principles

Every feature should:

- reduce cognitive load
- improve clarity
- respect limited capacity
- support accessibility
- avoid shame-based design

When in doubt:

Choose simplicity.

---

# Scheduler Philosophy

This project intentionally separates:

Eligibility

from

Recommendation

Current scheduler responsibility:

"Can this task fit?"

The scheduler does NOT currently answer:

"Should this task be scheduled?"

Recommendation logic belongs to later phases.

Schedule generation belongs to later phases.

Automatic planning belongs to later phases.

---

# Energy Philosophy

Energy is not:

- a score
- a currency
- a productivity metric

Energy is:

- a reflection of reality
- a planning signal

Energy is a fit signal.

Energy is NOT a hard gate.

Example:

Task:
Mental Energy Required = 5

Today:
Mental Capacity = 2

Meaning:

Poor fit today

NOT

Forbidden

---

# Current Project Status

Completed:

- Phase 0 Foundation
- Phase 1 Application Shell
- Phase 2 Database Layer
- Prisma Shadow Database Configuration
- Phase 3 Core Task System
- Phase 4 Student Features
- Phase 5 Energy & Capacity
- Phase 6 Scheduler Foundation

Current Branch:

feature/dependencies

Current Phase:

Phase 7 - Dependencies & Scheduling Constraints

---

# Current Architecture

## Tasks

- completion status
- archive status
- due dates
- priorities
- energy requirements
- academic metadata

## Courses

- instructors
- academic organization

## Capacity

- daily capacity
- energy types
- observations
- history

## Scheduler

- eligibility evaluation
- scheduling reason codes
- constraint evaluation
- capacity-aware logic

---

# Architectural Decisions

## Phase 5

Decision:

Track capacity before making recommendations.

Reason:

The planner should understand reality before attempting guidance.

---

## Phase 6

Decision:

Build eligibility evaluation before schedule generation.

Reason:

The scheduler should answer:

"Can this fit?"

before answering:

"What should I do?"

---

## Phase 7

Decision:

Dependencies integrate with eligibility evaluation.

Reason:

Dependency status is a scheduling constraint.

Dependencies should not create a separate planning system.

Dependency status should appear through scheduler eligibility results.

---

---

## Phase 7 Review Findings

Decision:

Review existing implementation before introducing additional dependency architecture.

Reason:

Investigation confirmed that substantial dependency functionality already exists in the codebase.

Verified implemented:

- Dependency persistence through TaskDependency
- Dependency repository layer
- Self-dependency prevention
- Duplicate dependency prevention
- Circular dependency prevention
- Dependency-aware scheduler evaluation
- Dependency-aware eligibility evaluation
- Dependency management user interface
- Dependency-related automated tests

Future Phase 7 work should focus on:

- User experience improvements
- Visibility of dependency status
- Workflow refinement
- Additional testing and validation

Avoid replacing or redesigning dependency architecture unless a verified defect or limitation is identified.

Current architectural principle:

Understand existing implementation before extending it.

---

# Dependency Philosophy

Dependencies represent prerequisites.

Example:

Read Chapter 4
↓
Discussion Post

The dependency question is:

"Has the prerequisite been completed?"

NOT:

"Is the prerequisite currently eligible?"

Dependency evaluation should primarily use completion state.

Dependency completion and scheduler eligibility are different concepts.

Circular dependencies must be prevented.

Examples:

A → B → A

A → B → C → A

Blocked tasks should appear through existing scheduler reasoning where possible.

Prefer integration over duplication.

---

# Accessibility Requirements

All new functionality must:

- support keyboard navigation
- use semantic HTML
- provide proper labels
- expose validation errors accessibly
- avoid color-only communication

Accessibility is mandatory.

It is not optional.

---

# UX Requirements

Favor:

- progressive disclosure
- clear hierarchy
- minimum cognitive load
- concise metadata

Avoid:

- overwhelming screens
- giant forms
- unnecessary warnings
- productivity pressure

---

# Documentation Requirements

After every completed phase:

1. Update NEXT_STEPS.md.
2. Update AI_PROJECT_CONTEXT.md.
3. Record any architectural decisions made during the phase.
4. Record any newly deferred work.
5. Record any significant product philosophy decisions.
6. Record any scheduler philosophy changes.

Do not consider a phase complete until documentation is updated.

---

# Future Ideas

## Future UX Improvements

### Related Task Completion Review

Observation:

Users may legitimately complete a task even when related prerequisite tasks remain incomplete.

Example:

Read Chapter 4
↓
Discussion Post

A student may skim, use outside knowledge, or otherwise complete the discussion post without considering the reading task complete.

Decision:

Do not block task completion solely because related tasks remain incomplete.

Potential future enhancement:

When marking a task complete, if related prerequisite or dependent tasks remain incomplete, offer a review dialog.

Example:

Other tasks associated with this task are still marked incomplete.

• Read Chapter 4

Would you like to update those tasks as well?

Options:

- Mark Related Tasks Complete
- Just Complete This Task
- Cancel

Reason:

This approach reflects reality without enforcing a prescribed workflow.

The planner should help users keep related tasks synchronized when appropriate, but should not assume work was or was not completed.

## Student Hub

A friendlier layer over institutional systems.

Potential features:

- LMS links
- schedules
- degree progress
- advisor information
- campus locations

Goal:

Make academic systems easier to understand.

---

## Gentle Habit Tracking

Potential future product or module.

Principles:

- no streak pressure
- no punishment for missed days
- progress remains visible
- ADHD-friendly
- accommodates varying capacity

Missing a day is not failure.

---

# Monetization Philosophy

Web application:

Free.

No subscriptions.

Optional donations may help cover:

- hosting
- development
- maintenance

Donations must never:

- unlock features
- create user tiers
- create pressure

Potential future mobile apps may use a one-time purchase model while keeping the web application free.

---

# Important Rule

Do not implement future phases early.

Do not introduce recommendation logic before recommendation phases.

Do not introduce schedule generation before schedule generation phases.

Do not introduce AI-driven prioritization before prioritization phases.

Implement only what the current phase requires.