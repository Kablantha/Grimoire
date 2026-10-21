# Energy Planner
## User Interface Specification

## 1. Purpose

This document defines the intended user experience and interface behavior for
Energy Planner.

The primary UX goal is:

> Opening the application should answer "What can I realistically do today?"
> rather than "Here is everything in your life you haven't done yet."

The interface must embody the product principles defined in
PRODUCT_REQUIREMENTS.md.

The application should feel:

- calm
- supportive
- predictable
- accessible
- nonjudgmental
- honest
- easy to navigate
- progressively disclosed rather than overwhelming

The user's current day should remain the center of the experience.

---

# 2. Primary Navigation

The main navigation should remain deliberately small.

## Desktop

Primary destinations:

- Today
- Week
- Tasks
- Courses, when Student Features are enabled
- Add
- Settings

Conceptually:

Today | Week | Tasks | Courses               + Add | Settings

Courses should not appear when Student Features are disabled.

## Mobile

Use a compact bottom navigation structure such as:

Today | Week | Add | Tasks | More

Additional destinations such as:

- Courses
- Recovery Mode
- Settings

may be available through More.

Navigation labels must not rely exclusively on icons.

---

# 3. First-Run Onboarding

Onboarding should be short, optional where practical, and easy to understand.

Avoid forcing users to configure every feature before they can begin using the
application.

The user should be able to revise onboarding choices later.

---

# 4. Onboarding: Introduction

Suggested content:

# Let's make a plan that actually fits.

This planner considers your time, energy, deadlines, and everyday
responsibilities to help figure out what's realistic.

Plans change. That's expected.

Primary action:

Get started

The introduction should not frame the application around maximizing
productivity.

---

# 5. Onboarding: What Are You Planning?

Prompt:

# What kinds of things are you planning?

Possible selections:

- School
- Work
- Home and life
- Creative projects
- Something else

Users may select multiple options.

Selecting School enables Student Features.

A student can also select other categories.

Student mode must never imply that non-school life disappears from the
planner.

---

# 6. Onboarding: Typical Weekly Energy

Prompt:

# What does a typical week look like?

Supporting text:

Don't worry about getting this exactly right. You can change it later.

Present each day with an Energy 1-5 selector.

Example:

Monday: 1 2 [3] 4 5
Tuesday: 1 2 3 [4] 5
Wednesday: 1 [2] 3 4 5

Include an explanation such as:

1 means you generally have very little capacity.

5 means you generally have quite a bit.

Your 3 doesn't need to look like anyone else's 3.

Users must be able to change these values later.

---

# 7. Onboarding: Planning Style

Prompt:

# How much breathing room should we leave?

Options:

## Gentle

Plan conservatively and leave substantial open capacity.

Approximately 60% planning target.

## Balanced

Recommended default.

Leave room for breaks, unexpected events, and tasks taking longer than
expected.

Approximately 75% planning target.

## Full

Use more anticipated capacity while retaining a buffer.

Approximately 90% planning target.

These descriptions must not imply that unused capacity is wasted.

---

# 8. Onboarding: Energy Terminology

Prompt:

# What should we call your capacity?

Options include:

## Energy

Example representation:

3 of 5

## Spoons

Example representation:

3 spoons

## Spell Slots

Example representation:

◆ ◆ ◆ ◇ ◇

## Battery

Example representation:

60%

Include supporting text:

This only changes how energy is displayed. Planning works the same way.

All representations require accessible textual equivalents.

---

# 9. Onboarding: Regular Commitments

Optionally ask:

# Anything that regularly takes up your time?

Possible actions:

- Add class
- Add work
- Add appointment
- Add recurring responsibility
- I'll do this later

This step must be skippable.

The purpose is to improve planning rather than block entry into the
application.

---

# 10. Today View

Today is the primary application screen.

The information hierarchy should prioritize:

1. Current expected/reported energy
2. Today's realistic plan
3. Immediate commitments
4. Optional work if additional capacity exists
5. Survival Mode access
6. Access to Week and other planning tools

The Today view should not begin with the user's entire backlog.

---

# 11. Today Header

Example:

# Good morning, Sammi

## How are you feeling today?

1 2 [3] 4 5

Supporting text:

We planned around a 3. Change it if today feels different.

If the user has selected alternate energy terminology, presentation should
change accordingly while underlying behavior remains identical.

For accessibility, the control must convey values such as:

"Energy level 3 of 5"

rather than depending on visual selection alone.

---

# 12. Today's Plan

Example:

## Your plan

### Read Chapter 7

45 min
Mental
Energy 2

Needed before tomorrow's discussion.

Actions:

- Start, if task timing functionality supports it
- Details
- Complete
- Move

### Discussion response

30 min
Mental
Energy 2

Due tomorrow.

### Laundry

About 10 minutes active
Routine
Energy 1

Flexible this week.

Tasks should present only the information necessary to understand today's
plan.

Do not display every optional task property by default.

---

# 13. Optional Capacity

When additional work could reasonably fit, separate it from the main plan.

Suggested heading:

## If you have more

Example:

Character sketch
30 min
Creative
Energy 3

Items in this section are explicitly optional.

Leaving them incomplete must not produce guilt-oriented language or visual
failure states.

---

# 14. Daily Summary

At the bottom of the main plan, the application may summarize the expected
active work.

Example:

Today's plan: about 1 hr 25 min

There's breathing room built in.

Avoid metrics such as:

- Productivity percentage
- Completion score
- Efficiency score
- Minutes wasted
- Capacity wasted

---

# 15. Survival Mode Entry

The Today screen should provide a clearly available but non-alarming action:

I don't have it today.

A small plant or similarly gentle visual may accompany the action, but the
text must remain available independently of the icon.

Survival Mode must not require the user to justify why their capacity changed.

Do not ask:

"Why are you less productive today?"

Do not require a reason before activation.

---

# 16. Changing Energy During the Day

The user may update today's energy at any time.

Example:

# How are you doing now?

1 [2] 3 4 5

If energy changes substantially, respond calmly.

Example:

# Got it. Today changed.

I've found a gentler version of the rest of the day.

Action:

Review changes

Avoid technical language such as:

"Daily capacity reduced by 50%."

---

# 17. Replanning Review

Before significant automatic changes are applied, present a review.

Example:

# Here's what I'd change

## Keep today

Discussion response
Due tomorrow

## Move

Research article
Today -> Friday

Laundry
Today -> Saturday

## Optional

Character sketch
Remove from today's plan

Actions:

- Looks good
- Adjust it

Users must be able to modify the recommendation.

---

# 18. Quick Add

Task capture must be extremely lightweight.

Primary interaction:

# What do you need to remember?

[ Task title ]

Add

Only the title is required.

The task must be created successfully even when no other planning information
is supplied.

Include a secondary action:

Add planning details

Selecting it progressively reveals additional fields.

---

# 19. Quick Add Planning Details

Optional planning fields may include:

- Due date/time
- Estimated duration
- Energy
- Energy types
- Priority
- Course
- Project
- Dependencies
- Repeat

Do not show all advanced fields automatically unless the user requests them.

The interface should favor progressive disclosure to reduce cognitive load.

---

# 20. Smart Follow-Up

When the scheduler later requires missing information, it may ask for only the
information needed.

Example:

# Help me find a good time for "Finish TCID response"

About how long might it take?

Options:

- 15 min
- 30 min
- 45 min
- 1 hour
- 2 hours
- Not sure

Possible following question:

How demanding does it feel?

1 2 3 4 5

Users must be able to leave information unknown.

---

# 21. Task Details

The Task Details screen should organize information into clear groups.

Example:

# Finish TCID Response

Must Do

## Planning

Due:
Thursday, 11:59 PM

Estimated time:
45 minutes

Energy:
3 of 5

Energy type:
Mental

Scheduled:
Wednesday

## Depends on

Read Chapter 8

## Course

TCID 572

## Smaller Version

Write the core response without optional additional examples.

20 minutes
Energy 2

Primary actions may include:

- Edit
- Mark complete
- Move
- Break into steps

Less-common actions such as Archive may appear in a secondary menu.

---

# 22. Breaking a Task Into Steps

From Task Details, users may select:

Break into steps

The interface may offer:

- Create steps myself
- Suggest steps
- Not now

Suggested steps always require review before creation.

Child tasks should be presented in an understandable sequence.

Example:

Research Paper

1. Choose topic
2. Find sources
3. Read sources
4. Create outline
5. Draft
6. Revise

The interface should make dependencies between steps understandable without
requiring users to understand graph terminology.

---

# 23. Dependency Editing

Users should be able to specify that a task:

- Requires another task first
- Would preferably follow another task

User-facing terminology may simplify:

Hard dependency -> Needs to happen first

Soft dependency -> Better to do first

If a dependency would create a cycle, reject it with calm language.

Example:

That would create a loop where each task is waiting for another one to
finish first.

Do not expose raw database or graph errors.

---

# 24. Week View

Week view serves as the planning and adjustment workspace.

It should show:

- days
- expected energy
- scheduled tasks
- fixed commitments
- recurring responsibilities
- important deadlines
- an understandable sense of daily capacity

On desktop, a multi-column week layout is appropriate when screen width
allows.

Example:

MON        TUE        WED        THU        FRI

Energy 3   Energy 4   Energy 2   Energy 3   Energy 2

Reading    Research   Class      Response   Appointment
Laundry    Outline    Therapy               Groceries

The actual visual design may differ as long as the information hierarchy is
preserved.

---

# 25. Week-Level Summary

The Week screen may provide a short interpretation.

Examples:

Overall, this week looks manageable.

Thursday is looking pretty full.

Some work may need another plan before Friday.

Do not produce:

- weekly productivity score
- performance ranking
- failure count
- red crisis dashboard for ordinary workload conflicts

---

# 26. Moving Tasks

Where pointer input is available, drag-and-drop may be supported.

However, every draggable task must also have a non-drag method.

Example:

Move to...

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday
- Choose another date

Keyboard users must be able to perform the same scheduling action.

---

# 27. Manual Placement Warning

When the user moves a task to a day that appears unusually full:

Example:

Wednesday is already looking pretty full. Moving this there may make the day
harder than planned.

Actions:

- Move it anyway
- Find another day
- Cancel

If the user chooses Move it anyway, respect the decision.

Do not repeatedly warn them about the same deliberate placement.

---

# 28. Daily Capacity Visualization

Capacity information should communicate how a day feels without encouraging
the user to fill every remaining space.

Possible labels:

- Plenty of room
- Comfortably planned
- Fairly full
- Very full
- Needs another look

A visual meter may supplement this information.

Do not label unused capacity as:

- wasted
- unused productivity
- lost opportunity
- incomplete

Capacity meaning cannot depend exclusively on color.

---

# 29. Survival Mode Screen

When the user selects:

I don't have it today

respond first with reassurance.

Example:

# That's okay.

Let's make today smaller.

Actions:

- Make me a survival plan
- Never mind

Do not require an explanation.

Do not collect a reason for reduced capacity unless a future user-controlled
feature explicitly requires it.

---

# 30. Survival Mode Result

Example:

# Just for today

I've kept the things that seem most important and found safer places for what
can wait.

## One thing to protect

Discussion response
20 minutes
Due tonight

## If you have a little more

Minimum reading
15 minutes

## Not today

Laundry -> Saturday
Research -> Friday
Personal project -> Unscheduled

Supporting message:

Nothing here means you've failed at the original plan. The plan changed
because today changed.

Actions:

- Use this plan
- Adjust it

Survival Mode suggestions must be reviewable before major schedule changes
are committed.

---

# 31. Recovery Mode Entry

Recovery Mode should be available through planning options rather than
permanently dominating the Today screen.

Possible action:

Help me recover my week

When several days have been substantially disrupted, the application may
gently offer Recovery Mode.

Example:

# Things have shifted a bit this week.

Want help rebuilding the remaining plan?

Actions:

- Help me replan
- Not now

The suggestion should be dismissible.

---

# 32. Recovery Mode Screen

Suggested heading:

# Let's make the rest of the week workable.

The interface may organize remaining work into sections such as:

## Still fits comfortably

Tasks that remain realistic within current capacity.

## Needs replanning

Tasks that can probably still fit after schedule adjustments.

## Let's look at these together

Tasks whose current deadlines, dependencies, or expected work no longer
appear realistic.

Example:

Final project section

There may not be enough comfortable time remaining before this deadline.

Action:

See options

Avoid alarm-oriented visual treatments for ordinary planning conflicts.

---

# 33. Deadline Intervention

Suggested heading:

# This task may need another plan.

Supporting text:

Based on the time remaining and the work you've estimated, it doesn't look
like everything will comfortably fit before the deadline.

Then:

# We have options.

Possible actions:

## Replan

Try distributing the remaining work differently.

## Break it down

Find smaller pieces that may be easier to place.

## Use a smaller version

Focus on a minimum viable task variant where one exists.

## Reduce scope

Help identify what may safely be simplified or removed.

## Ask for help

Consider what support might make the task more manageable.

## Contact instructor

Available when Student Features and appropriate instructor information are
present.

Deadline Intervention should present choices rather than imply that one
response is morally correct.

---

# 34. Instructor Communication

When Contact Instructor is selected:

# Draft a message

Supporting text:

I'll help you create something clear and respectful. Nothing will be sent
without you reviewing it.

Known information may be used to populate the draft:

- instructor
- course
- assignment
- deadline
- possible revised completion date

The resulting message must be editable.

Initial actions may include:

- Copy
- Edit
- Cancel

A later integration may support:

- Open in email

The application must never automatically send instructor communication.

---

# 35. Completing a Task

When a user marks a task complete, provide immediate lightweight feedback.

Example:

Done.

Then optionally ask:

Want to tell me how long that took?

Options might include:

- 15 min
- 30 min
- 45 min
- 1 hour
- Other
- Skip

Skip must be a first-class option.

If the user skips the question:

- complete the task normally
- do not repeatedly request the missing duration
- do not treat missing duration as zero

No productivity points or celebration streaks are required.

---

# 36. Learning Recommendations

Learning suggestions should appear occasionally and quietly.

Example:

# A small planning suggestion

Your readings have usually taken around 55 minutes lately.

You're currently estimating them at 30 minutes.

Use 55 minutes going forward?

Actions:

- Yes
- Keep 30
- Not now

If the user selects Keep 30:

Preserve the user's setting and avoid repeatedly resurfacing the same
recommendation.

Recommendations should be understandable without displaying statistical
analysis unless the user asks for more detail.

---

# 37. Courses

Courses are available when Student Features are enabled.

Courses screen example:

# Courses

TCID 572
3 upcoming tasks

Game Design
2 upcoming tasks

Cataloging
No upcoming deadlines

Opening a course may show:

# TCID 572

## Instructor

Instructor name and optional contact information

## Upcoming

Reading 7
Thursday

Discussion
Friday

Project Draft
November 4

## Recurring

Class
Wednesday at 6 PM

## Course Information

- LMS link
- Instructor
- Notes

Courses organize academic information.

They do not replace the Today view as the primary planning interface.

---

# 38. Tasks Screen

The Tasks screen exists for users who need to inspect their broader task
inventory.

Possible organization:

- Search
- Needs attention
- Upcoming
- No deadline
- Someday
- Completed
- Archived

Possible filters:

- Course
- Project
- Priority
- Energy
- Energy type
- Category

The Tasks screen may be information-dense compared with Today, but should
still maintain readable hierarchy.

Do not make the high-density Tasks view the application's default home
screen.

---

# 39. Settings

Settings should be organized into understandable groups.

## Planning

Possible settings:

- Planning style
- Typical weekly energy
- Protected capacity preferences
- Scheduling preferences

## Energy

Possible settings:

- Energy terminology
- Energy types
- Historical recommendations

## Student Features

Possible settings:

- Enable or disable Student Features
- Courses
- Academic defaults

## Calendar

Possible settings:

- Connected calendars
- Imported commitments
- Sync preferences

## Accessibility

Possible settings may include:

- Reduce motion
- High contrast preference where applicable
- Larger interface text
- Animation preferences

The application should also respect operating-system and browser accessibility
preferences automatically where appropriate.

## Data and Privacy

Possible settings:

- Export data
- Delete data
- Historical learning controls
- AI feature controls
- Connected service permissions

Privacy controls should be understandable rather than hidden in technical
language.

---

# 40. Empty States

Empty states should be positive without becoming patronizing.

## Nothing Scheduled Today

Suggested:

# Nothing needs your attention today.

Enjoy the breathing room, or add something if you'd like.

Action:

Add task

Do not automatically treat an empty day as something that needs to be filled.

## No Tasks

Suggested:

# Your list is clear.

Add something whenever there's something you want help planning.

---

# 41. Loading States

Loading states should explain what is happening where useful.

Example:

Working out a realistic plan...

If an operation takes unusually long:

This is taking longer than expected. Your current plan hasn't changed.

This language helps reassure users that an unfinished calculation has not
silently modified their schedule.

Avoid unnecessary animated loading effects when reduced motion is enabled.

---

# 42. Scheduling Error States

A scheduling condition that requires additional information is not necessarily
a software error.

Example:

# I couldn't make a realistic plan yet.

One or more tasks are missing information I need to place them confidently.

Action:

Review tasks

Do not display raw exceptions or stack traces to ordinary users.

Technical errors should be logged appropriately while the interface provides
a calm and useful recovery path.

---

# 43. Application Error States

When an actual software error occurs, communicate:

- what could not be completed
- whether user data remains safe
- what the user can try next

Example:

# I couldn't save that change.

Your previous plan is still here.

Actions:

- Try again
- Cancel

Avoid assigning blame to the user.

---

# 44. Mobile Behavior

The web application should be designed responsively from the beginning.

On mobile:

- Today uses vertically stacked content
- task cards use comfortable touch targets
- navigation remains reachable
- Quick Add remains easy to access
- important actions do not require hover
- complex desktop layouts receive purposeful mobile alternatives

Week view may use:

- a selected-day view
- horizontal day navigation
- a compact weekly overview

Example compact strip:

M  T  W  T  F  S  S
3  4  2  3  2  4  3

Selecting a day reveals its tasks and commitments.

Do not simply shrink a seven-column desktop board until it becomes
unreadable.

---

# 45. Desktop Behavior

Desktop layouts may use additional screen width while keeping Today focused.

A possible Today layout:

Left:
- Today's plan
- Optional work

Right:
- Energy/capacity
- Commitments
- Coming up

The main plan must remain visually dominant.

Desktop interfaces should not fill available screen space merely because that
space exists.

---

# 46. Future PWA Considerations

The responsive web application should eventually support Progressive Web App
installation.

UI architecture should therefore avoid unnecessary dependencies on:

- desktop-only interaction
- hover-only controls
- mouse-only behavior

The web application should remain usable on:

- desktop browsers
- tablets
- mobile browsers

before a native mobile application is considered.

---

# 47. Keyboard Accessibility

All primary workflows must be operable using a keyboard.

This includes:

- navigation
- Quick Add
- task editing
- completion
- moving tasks
- changing energy
- Survival Mode
- Recovery Mode
- deadline intervention
- dialog interaction
- settings

Visible focus indicators must be preserved.

Do not remove browser focus styling unless an equally visible replacement is
provided.

---

# 48. Drag-and-Drop Accessibility

Drag-and-drop may supplement scheduling interaction.

It may never be the only method.

Every draggable task must provide an equivalent command such as:

Move to...

Keyboard and assistive-technology users must be able to accomplish the same
result.

---

# 49. Screen Reader Support

Use semantic HTML wherever possible.

Examples:

- actual headings for section hierarchy
- buttons for actions
- links for navigation
- lists for meaningful collections
- appropriate form labels

Important information must have accessible text.

Example visual:

◆ ◆ ◆ ◇ ◇

Accessible equivalent:

Spell Slots: 3 of 5

Do not rely on:

- color
- icon shape
- visual position

as the sole carrier of meaning.

---

# 50. Dialog Accessibility

Dialogs must provide:

- an accessible name
- an accessible description when appropriate
- keyboard access
- intentional initial focus
- focus containment when modal
- Escape behavior when dismissal is appropriate
- focus restoration after closure

Destructive confirmation dialogs should clearly describe the consequence.

Do not use a generic:

Are you sure?

when a more specific statement is possible.

Prefer:

Delete this task permanently?

---

# 51. Automatic Update Announcements

When automatic scheduling updates visible content, use assistive-technology
announcements carefully.

Important changes should be perceivable.

However, do not announce every internal calculation or intermediate scheduler
decision.

A useful announcement might be:

"Today's plan updated. Two tasks moved to later this week."

Avoid repeatedly interrupting the user while the scheduler evaluates options.

---

# 52. Reduced Motion

Respect the user's system reduced-motion preference.

When reduced motion is requested:

- remove unnecessary movement
- avoid large animated transitions
- avoid motion-based celebration
- ensure state changes remain understandable without animation

Animations should never be required to understand schedule changes.

---

# 53. Zoom and Text Scaling

Primary workflows should remain usable with substantial browser zoom and
larger text.

Layouts should reflow rather than requiring horizontal scrolling wherever
reasonable.

Do not use fixed-height task cards that clip enlarged text.

---

# 54. Color Usage

Color may support organization but must never be the sole information channel.

Examples requiring non-color equivalents:

- course identity
- energy level
- capacity state
- task priority
- warnings
- selected state

Red should not mean:

"You failed."

Reserve strong danger styling primarily for genuinely destructive or dangerous
actions.

Ordinary due dates should use calm textual descriptions such as:

- Due Friday
- Due tomorrow
- Due tonight

rather than escalating bomb-timer visuals.

---

# 55. Cognitive Accessibility

Progressive disclosure is a core interaction pattern.

The application should show users:

- what they need now
- the minimum information necessary for the current decision
- additional details on request

Avoid:

- giant forms
- unnecessary configuration
- displaying every task field at once
- excessive notifications
- dashboards containing numerous simultaneous metrics
- unexplained technical terminology

Task capture should remain possible even when the user has little available
executive function.

---

# 56. Notifications

Notifications should be opt-in and configurable.

Possible notification types:

- Morning planning reminder
- Upcoming deadline reminder
- Important schedule-change reminder

Example:

# A gentle heads-up

Your discussion response is due tomorrow. It's already in today's plan.

Another example:

Today's plan is ready whenever you are.

Avoid:

- panic language
- repeated nagging
- streak reminders
- productivity guilt
- excessive notifications for optional tasks

Users must be able to disable notifications.

---

# 57. Privacy UX

The application may store information about:

- coursework
- routines
- commitments
- historical energy
- task completion
- instructor information

Privacy should therefore be visible and understandable.

Users should eventually have straightforward controls for:

- exporting their data
- deleting their data
- managing historical learning
- managing connected calendars
- understanding AI-assisted features

Do not hide consequential data behavior exclusively inside legalistic privacy
text.

---

# 58. AI-Assisted Features

AI assistance, if added, should remain clearly bounded.

Potential uses may include:

- suggesting task chunks
- drafting an instructor message
- helping summarize task descriptions

AI should not silently decide:

- whether the user can meet a deadline
- whether to contact an instructor
- whether to change the user's historical defaults
- whether to modify an external calendar

Core schedule feasibility should use transparent deterministic logic wherever
practical.

The user should know when content was AI-generated and retain editing control.

---

# 59. User-Controlled Explanations

When the scheduler makes an automatic decision, the interface should support
plain-language explanations.

Possible action:

Why today?

Example response:

Your discussion is due tomorrow, and this reading needs to happen first.
Today had the most comfortable available time before the deadline.

Possible action:

Why did this move?

Example response:

Your energy changed from 4 to 2 today, so I moved your research work to
Friday. Nothing else depends on completing it today.

The explanation should communicate relevant reasons rather than an internal
scheduler score.

---

# 60. Tone During Disruption

Language during disrupted plans is especially important.

Avoid:

You missed three tasks yesterday.

Prefer:

Yesterday didn't go as planned. Let's see what still matters and what can
move.

Avoid:

You're behind.

Prefer:

A few things need another look.

Avoid:

You failed to complete your goals.

Prefer:

Today's plan changed.

The application should remain honest about deadlines and consequences without
attaching moral judgment to the user.

---

# 61. Today-First Principle

Today is the primary experience.

The application should minimize how much future complexity reaches the user
unless it affects today's decisions.

Week exists for:

- context
- review
- manual adjustment
- upcoming capacity
- major deadlines

Tasks exists for:

- inventory
- search
- filtering
- broader management

Courses exists for:

- academic organization

Today exists to answer:

> What can I realistically do today?

---

# 62. Basic Daily User Flow

A normal interaction may look like:

1. User opens the application.
2. Today shows the predicted energy.
3. User confirms or changes their current energy.
4. The application shows a realistic daily plan.
5. User completes a task.
6. Application optionally asks how long it took.
7. User skips the question if desired.
8. Later, the user's energy changes.
9. User updates the energy value.
10. Application proposes a small replan.
11. User reviews and accepts or adjusts it.

The application should make this workflow straightforward without exposing
the complexity of the scheduling engine.

---

# 63. Low-Capacity User Flow

A low-capacity interaction may look like:

1. User opens Today.
2. User selects a low current energy value.
3. The application reduces normal expectations.
4. User selects "I don't have it today."
5. Survival Mode produces a minimal proposed plan.
6. Consequential work is protected.
7. Flexible work moves where safe.
8. Optional work is removed from today's expectations.
9. User reviews the changes.
10. User proceeds without penalties or failure states.

This flow is a primary product experience, not an edge case.

---

# 64. Recovery User Flow

A recovery interaction may look like:

1. Several scheduled tasks remain unfinished across multiple days.
2. User chooses "Help me recover my week."
3. Application reevaluates unfinished work.
4. Work that remains feasible is preserved.
5. Flexible work is moved.
6. Work that cannot comfortably fit is identified.
7. Deadline Intervention is offered when needed.
8. User reviews the proposed recovery plan.
9. Approved changes are applied.

Recovery Mode should reduce overwhelm rather than simply reorganize an
overwhelming list.

---

# 65. Design Non-Goals

The interface should not evolve into:

- a productivity dashboard
- a competitive tracker
- an achievement system
- a streak-maintenance game
- an analytics-heavy quantified-self dashboard
- a guilt-oriented overdue list
- a complicated project-management suite by default

Powerful planning features may exist underneath a deliberately calm surface.

---

# 66. Final UX Principle

Every interface decision should support the idea that planning is a tool for
helping the user, not a standard against which the user is judged.

The application should communicate:

- what matters today
- what can safely wait
- why something was scheduled
- when a plan no longer fits
- what choices remain available

without treating reduced capacity or changed circumstances as failure.

The final interface must preserve the central principle:

> The schedule adapts to the person. The person does not fail the schedule.