import Link from "next/link";
import { TaskStatus } from "../../src/generated/prisma/enums";
import type { TaskRecord } from "../../src/lib/tasks/task-repository";
import { archiveTaskAction, completeTaskAction, restoreTaskAction } from "../../app/(planner)/tasks/actions";

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
        <li className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-5" key={task.id}>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--ink)]">
              <Link className="rounded-sm underline-offset-4 hover:underline" href={`/tasks/${task.id}`}>
                {task.title}
              </Link>
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
              {task.priority && <span>{task.priority.replaceAll("_", " ")}</span>}
              {task.dueAt && <span>Due {formatDueDate(task.dueAt)}</span>}
              {task.estimatedMinutes !== null && <span>{task.estimatedMinutes} min</span>}
              {task.energyLevel !== null && <span>Energy {task.energyLevel} of 5</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] px-3 text-sm font-medium" href={`/tasks/${task.id}`}>
              Details
            </Link>
            {status === TaskStatus.active && (
              <>
                <form action={completeTaskAction}>
                  <input name="taskId" type="hidden" value={task.id} />
                  <button className="min-h-11 rounded-md border border-[var(--line)] px-3 text-sm font-medium" type="submit">
                    Mark complete
                  </button>
                </form>
                <form action={archiveTaskAction}>
                  <input name="taskId" type="hidden" value={task.id} />
                  <button className="min-h-11 rounded-md px-3 text-sm font-medium text-[var(--muted)]" type="submit">
                    Archive
                  </button>
                </form>
              </>
            )}
            {status === TaskStatus.completed && (
              <form action={archiveTaskAction}>
                <input name="taskId" type="hidden" value={task.id} />
                <button className="min-h-11 rounded-md px-3 text-sm font-medium text-[var(--muted)]" type="submit">
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