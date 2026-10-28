import { TaskStatus } from "../../../src/generated/prisma/enums";
import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import { listTasks } from "../../../src/lib/tasks/task-repository";
import { prisma } from "../../../src/lib/prisma";
import PlaceholderPage from "../../../components/placeholder-page";
import { TaskList, TaskStatusFilters } from "../../../components/tasks/task-list";

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
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const status = parseStatus((await searchParams).status);
  const user = await ensureDevelopmentUser(prisma);
  const tasks = await listTasks(prisma, user.id, status);

  return (
    <>
      <PlaceholderPage
        description="Keep track of the things you want to remember. You can add planning details when they become useful."
        title="Tasks"
      />
      <TaskStatusFilters selected={status} />
      <TaskList status={status} tasks={tasks} />
    </>
  );
}