import Link from "next/link";
import { TaskStatus } from "../../src/generated/prisma/enums";
import type { TaskRecord } from "../../src/lib/tasks/task-repository";
import { archiveTaskAction, completeTaskAction, restoreTaskAction } from "../../app/(planner)/tasks/actions";
import { formatAcademicTaskType, formatCourseCode, MetadataPill, PriorityPill } from "./task-metadata";

function formatDueDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function TaskStatusFilters({ selected }: { selected: TaskStatus }) {
  const filters = [
    { status: TaskStatus.active, label: "Active", href: "/tasks" },
    { status: TaskStatus.completed, label: "Completed", href: "/tasks?status=completed" },
    { status: TaskStatus.archived, label: "Archived", href: "/tasks?status=archived" },
  ];

  return (
    <nav aria-label="Task status" className="mt-8 border-b border-[var(--line)]">
      <ul className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <li key={filter.status}>
            <Link
              aria-current={selected === filter.status ? "page" : undefined}
              className={`inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium ${
                selected === filter.status
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
              href={filter.href}
            >
              {filter.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function TaskList({ tasks, status }: { tasks: TaskRecord[]; status: TaskStatus }) {
  if (!tasks.length) {
    const emptyCopy = {
      [TaskStatus.active]: "Your active list is clear. Add something whenever you'd like.",
      [TaskStatus.completed]: "Completed tasks will be kept here.",
      [TaskStatus.archived]: "Archived tasks will be kept here and can be restored.",
    };

    return (
      <p className="mt-8 rounded-md border border-dashed border-[var(--line)] bg-white px-5 py-6 text-[var(--muted)]">
        {emptyCopy[status]}
      </p>
    );
  }

  return (
    <ul aria-label={`${status} tasks`} className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white">
      {tasks.map((task) => (
        <li className="px-4 py-5 sm:px-5" key={task.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="min-w-0 text-base font-semibold text-[var(--ink)]">
              <Link className="rounded-sm underline-offset-4 hover:underline" href={`/tasks/${task.id}`}>
                {task.title}
              </Link>
            </h2>
            {task.dueAt && (
              <p className="shrink-0 text-sm text-[var(--muted)]">Due {formatDueDate(task.dueAt)}</p>
            )}
          </div>

          <Link className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href={`/tasks/${task.id}`}>
            Details
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            {task.priority && <PriorityPill priority={task.priority} />}
            {task.course && (
              <Link
                aria-label={`Course: ${formatCourseCode(task.course.code, task.course.name)}`}
                className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                href={`/courses/${task.course.id}`}
              >
                <MetadataPill className="bg-[var(--accent-soft)] text-[var(--accent)]">{formatCourseCode(task.course.code, task.course.name)}</MetadataPill>
              </Link>
            )}
            {task.academicTaskType && <MetadataPill>{formatAcademicTaskType(task.academicTaskType)}</MetadataPill>}
            {task.energyLevel !== null && <MetadataPill>Energy: {task.energyLevel}</MetadataPill>}
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {status === TaskStatus.active && (
              <>
                <form action={archiveTaskAction}>
                  <input name="taskId" type="hidden" value={task.id} />
                  <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-medium text-[var(--muted)]" type="submit">
                    Archive
                  </button>
                </form>
                <form action={completeTaskAction}>
                  <input name="taskId" type="hidden" value={task.id} />
                  <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-medium" type="submit">
                    Mark complete
                  </button>
                </form>
              </>
            )}
            {status === TaskStatus.completed && (
              <form action={archiveTaskAction}>
                <input name="taskId" type="hidden" value={task.id} />
                <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-medium text-[var(--muted)]" type="submit">
                  Archive
                </button>
              </form>
            )}
            {status === TaskStatus.archived && (
              <form action={restoreTaskAction}>
                <input name="taskId" type="hidden" value={task.id} />
                <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-medium" type="submit">
                  Restore
                </button>
              </form>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}