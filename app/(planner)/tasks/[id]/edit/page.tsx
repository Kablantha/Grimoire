import { notFound } from "next/navigation";
import { ensureDevelopmentUser } from "../../../../../src/lib/tasks/development-user";
import { getTask, getTaskFormOptions } from "../../../../../src/lib/tasks/task-repository";
import { prisma } from "../../../../../src/lib/prisma";
import TaskForm from "../../../../../components/tasks/task-form";
import PlaceholderPage from "../../../../../components/placeholder-page";

function asLocalDateTime(value: Date | null) {
  if (!value) return null;
  return value.toISOString();
}

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await ensureDevelopmentUser(prisma);
  const task = await getTask(prisma, user.id, id);
  if (!task) notFound();
  const options = await getTaskFormOptions(prisma, user.id, task.courseId);

  const minimumVariant = task.variants[0];

  return (
    <>
      <PlaceholderPage
        description="Change the details you know. The rest can stay open."
        title="Edit task"
      />
      <div className="mt-8 max-w-2xl">
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            dueAt: asLocalDateTime(task.dueAt),
            estimatedMinutes: task.estimatedMinutes,
            energyLevel: task.energyLevel,
            priority: task.priority,
            academicTaskType: task.academicTaskType,
            categoryId: task.categoryId,
            projectId: task.projectId,
            courseId: task.courseId,
            energyTypeIds: task.energyTypes.map(({ energyType }) => energyType.id),
            minimumVariant: minimumVariant
              ? {
                  title: minimumVariant.title,
                  estimatedMinutes: minimumVariant.estimatedMinutes,
                  energyLevel: minimumVariant.energyLevel,
                }
              : null,
          }}
          options={options}
          taskId={task.id}
        />
      </div>
    </>
  );
}