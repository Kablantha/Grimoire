import { TaskStatus } from "../../../src/generated/prisma/enums";
import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import { listTasks } from "../../../src/lib/tasks/task-repository";
import { prisma } from "../../../src/lib/prisma";
import PlaceholderPage from "../../../components/placeholder-page";
import { TaskList, TaskStatusFilters } from "../../../components/tasks/task-list";
import Link from "next/link";

function parseStatus(value?: string | string[]): TaskStatus {
  const requested = Array.isArray(value) ? value[0] : value;
  if (requested === TaskStatus.completed || requested === TaskStatus.archived) {
    return requested;
  }
  return TaskStatus.active;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; courseId?: string | string[] }>;
}) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const user = await ensureDevelopmentUser(prisma);
  const requestedCourseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const selectedCourse = requestedCourseId
    ? await prisma.course.findFirst({
        where: { id: requestedCourseId, userId: user.id },
        select: { id: true, name: true, code: true },
      })
    : null;
  const courseId = selectedCourse?.id;
  const tasks = await listTasks(prisma, user.id, status, courseId);

  return (
    <>
      <PlaceholderPage
        description={selectedCourse
          ? `Tasks associated with ${selectedCourse.code ? `${selectedCourse.code} · ` : ""}${selectedCourse.name}.`
          : "Keep track of the things you want to remember. You can add planning details when they become useful."}
        title={selectedCourse ? "Course tasks" : "Tasks"}
      />
      {selectedCourse && (
        <p className="mt-5">
          <Link className="min-h-11 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href={`/courses/${selectedCourse.id}`}>
            Back to course
          </Link>
          <span className="px-2 text-[var(--muted)]" aria-hidden="true">·</span>
          <Link className="min-h-11 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href="/tasks">
            View all tasks
          </Link>
        </p>
      )}
      <TaskStatusFilters selected={status} />
      <TaskList status={status} tasks={tasks} />
    </>
  );
}