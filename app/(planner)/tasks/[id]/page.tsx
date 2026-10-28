import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskStatus } from "../../../../src/generated/prisma/enums";
import { ensureDevelopmentUser } from "../../../../src/lib/tasks/development-user";
import { getTask } from "../../../../src/lib/tasks/task-repository";
import { prisma } from "../../../../src/lib/prisma";
import PlaceholderPage from "../../../../components/placeholder-page";
import { archiveTaskAction, completeTaskAction, restoreTaskAction } from "../actions";
import { formatAcademicTaskType, formatCourseIdentity, MetadataPill, PriorityPill } from "../../../../components/tasks/task-metadata";

function formatDueDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await ensureDevelopmentUser(prisma);
  const task = await getTask(prisma, user.id, id);
  if (!task) notFound();

  return (
    <>
      <Link className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href="/tasks">
        Back to tasks
      </Link>
      <div className="mt-7">
        <PlaceholderPage description={task.status === TaskStatus.completed ? "Completed" : task.status === TaskStatus.archived ? "Archived" : "Active"} title={task.title} />
      </div>

      {task.description && (
        <section aria-labelledby="task-notes-heading" className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-sm font-semibold text-[var(--muted)]" id="task-notes-heading">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap leading-7">{task.description}</p>
        </section>
      )}

      {(task.dueAt || task.estimatedMinutes !== null || task.energyLevel !== null || task.priority || task.academicTaskType || task.energyTypes.length > 0 || task.category || task.project || task.course) && (
        <section aria-labelledby="task-planning-heading" className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-sm font-semibold text-[var(--muted)]" id="task-planning-heading">Planning</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {task.dueAt && <div><dt className="text-xs text-[var(--muted)]">Due</dt><dd className="mt-1">{formatDueDate(task.dueAt)}</dd></div>}
            {task.estimatedMinutes !== null && <div><dt className="text-xs text-[var(--muted)]">Estimated time</dt><dd className="mt-1">{task.estimatedMinutes} minutes</dd></div>}
            {task.energyLevel !== null && <div><dt className="text-xs text-[var(--muted)]">Energy</dt><dd className="mt-1">{task.energyLevel}</dd></div>}
            {task.priority && <div><dt className="text-xs text-[var(--muted)]">Priority</dt><dd className="mt-1"><PriorityPill priority={task.priority} /></dd></div>}
            {task.academicTaskType && <div><dt className="text-xs text-[var(--muted)]">Academic task type</dt><dd className="mt-1"><MetadataPill>{formatAcademicTaskType(task.academicTaskType)}</MetadataPill></dd></div>}
            {task.energyTypes.length > 0 && <div><dt className="text-xs text-[var(--muted)]">Energy types</dt><dd className="mt-1 flex flex-wrap gap-2">{task.energyTypes.map(({ energyType }) => <MetadataPill key={energyType.id}>{energyType.name}</MetadataPill>)}</dd></div>}
            {task.category && <div><dt className="text-xs text-[var(--muted)]">Category</dt><dd className="mt-1">{task.category.name}</dd></div>}
            {task.project && <div><dt className="text-xs text-[var(--muted)]">Project</dt><dd className="mt-1">{task.project.name}</dd></div>}
            {task.course && <div><dt className="text-xs text-[var(--muted)]">Course</dt><dd className="mt-1"><Link className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]" href={`/courses/${task.course.id}`}><MetadataPill className="bg-[var(--accent-soft)] text-[var(--accent)]">{formatCourseIdentity(task.course.code, task.course.name)}</MetadataPill></Link></dd></div>}
          </dl>
        </section>
      )}

      {task.variants[0] && (
        <section aria-labelledby="minimum-task-heading" className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-sm font-semibold text-[var(--muted)]" id="minimum-task-heading">Minimum version</h2>
          <p className="mt-2">{task.variants[0].title}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {task.variants[0].estimatedMinutes !== null ? `${task.variants[0].estimatedMinutes} minutes` : ""}
            {task.variants[0].estimatedMinutes !== null && task.variants[0].energyLevel !== null ? " · " : ""}
            {task.variants[0].energyLevel !== null ? `Energy: ${task.variants[0].energyLevel}` : ""}
          </p>
        </section>
      )}

      <div className="mt-9 flex flex-wrap gap-2 border-t border-[var(--line)] pt-6">
        {task.status !== TaskStatus.archived && (
          <Link className="inline-flex min-h-11 items-center rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white" href={`/tasks/${task.id}/edit`}>Edit</Link>
        )}
        {task.status === TaskStatus.active && (
          <form action={completeTaskAction}>
            <input name="taskId" type="hidden" value={task.id} />
            <button className="min-h-11 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium" type="submit">Mark complete</button>
          </form>
        )}
        {task.status !== TaskStatus.archived && (
          <form action={archiveTaskAction}>
            <input name="taskId" type="hidden" value={task.id} />
            <button className="min-h-11 rounded-md px-4 text-sm font-medium text-[var(--muted)]" type="submit">Archive</button>
          </form>
        )}
        {task.status === TaskStatus.archived && (
          <form action={restoreTaskAction}>
            <input name="taskId" type="hidden" value={task.id} />
            <button className="min-h-11 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium" type="submit">Restore</button>
          </form>
        )}
      </div>
    </>
  );
}