import type { Prisma, PrismaClient } from "../../generated/prisma/client";
import { TaskStatus, TaskVariantType } from "../../generated/prisma/enums";
import type { CreateTaskInput } from "../../domain/task/create-task-input";

const taskInclude = {
  category: { select: { id: true, name: true } },
  project: { select: { id: true, name: true } },
  course: { select: { id: true, name: true, code: true } },
  energyTypes: {
    include: {
      energyType: { select: { id: true, name: true, sortOrder: true } },
    },
  },
  variants: {
    where: { type: TaskVariantType.minimum },
    select: { id: true, title: true, estimatedMinutes: true, energyLevel: true },
  },
} satisfies Prisma.TaskInclude;

export type TaskRecord = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

export type TaskFormOptions = {
  energyTypes: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  projects: { id: string; name: string }[];
  courses: { id: string; name: string; code: string | null; archivedAt: Date | null }[];
};

export class TaskRelationshipError extends Error {
  constructor() {
    super("One or more selected options are no longer available.");
    this.name = "TaskRelationshipError";
  }
}

async function validateRelationships(
  client: PrismaClient,
  userId: string,
  input: CreateTaskInput,
) {
  const [category, project, course, parentTask, energyTypes] = await Promise.all([
    input.categoryId
      ? client.category.findFirst({ where: { id: input.categoryId, userId }, select: { id: true } })
      : null,
    input.projectId
      ? client.project.findFirst({ where: { id: input.projectId, userId }, select: { id: true } })
      : null,
    input.courseId
      ? client.course.findFirst({ where: { id: input.courseId, userId }, select: { id: true } })
      : null,
    input.parentTaskId
      ? client.task.findFirst({ where: { id: input.parentTaskId, userId }, select: { id: true } })
      : null,
    input.energyTypeIds?.length
      ? client.energyType.findMany({
          where: { id: { in: input.energyTypeIds }, userId },
          select: { id: true },
        })
      : [],
  ]);

  if (
    (input.categoryId && !category) ||
    (input.projectId && !project) ||
    (input.courseId && !course) ||
    (input.parentTaskId && !parentTask) ||
    (energyTypes.length !== (input.energyTypeIds?.length ?? 0))
  ) {
    throw new TaskRelationshipError();
  }
}

function splitTaskInput(input: CreateTaskInput) {
  const {
    energyTypeIds = [],
    minimumVariant,
    ...taskFields
  } = input;

  return { energyTypeIds, minimumVariant, taskFields };
}

export async function getTaskFormOptions(
  client: PrismaClient,
  userId: string,
  preserveCourseId?: string | null,
): Promise<TaskFormOptions> {
  const [energyTypes, categories, projects, courses] = await Promise.all([
    client.energyType.findMany({
      where: { userId, enabled: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
    client.category.findMany({ where: { userId }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    client.project.findMany({
      where: { userId, archivedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    client.course.findMany({
      where: {
        userId,
        ...(preserveCourseId
          ? { OR: [{ archivedAt: null }, { id: preserveCourseId }] }
          : { archivedAt: null }),
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, code: true, archivedAt: true },
    }),
  ]);

  return { energyTypes, categories, projects, courses };
}

export async function listTasks(
  client: PrismaClient,
  userId: string,
  status: TaskStatus,
  courseId?: string,
): Promise<TaskRecord[]> {
  return client.task.findMany({
    where: { userId, status, ...(courseId ? { courseId } : {}) },
    include: taskInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTask(
  client: PrismaClient,
  userId: string,
  id: string,
): Promise<TaskRecord | null> {
  return client.task.findFirst({ where: { id, userId }, include: taskInclude });
}

export async function createTask(
  client: PrismaClient,
  userId: string,
  input: CreateTaskInput,
): Promise<TaskRecord> {
  await validateRelationships(client, userId, input);
  const { energyTypeIds, minimumVariant, taskFields } = splitTaskInput(input);

  return client.task.create({
    data: {
      ...taskFields,
      userId,
      energyTypes: energyTypeIds.length
        ? {
            create: energyTypeIds.map((id) => ({
              energyType: { connect: { id } },
            })),
          }
        : undefined,
      variants: minimumVariant
        ? {
            create: {
              type: TaskVariantType.minimum,
              ...minimumVariant,
            },
          }
        : undefined,
    },
    include: taskInclude,
  });
}

export async function updateTask(
  client: PrismaClient,
  userId: string,
  id: string,
  input: CreateTaskInput,
): Promise<TaskRecord | null> {
  await validateRelationships(client, userId, input);
  const { energyTypeIds, minimumVariant, taskFields } = splitTaskInput(input);

  return client.$transaction(async (transaction) => {
    const existingTask = await transaction.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existingTask) return null;

    await transaction.taskEnergyType.deleteMany({ where: { taskId: id } });
    if (energyTypeIds.length) {
      await transaction.taskEnergyType.createMany({
        data: energyTypeIds.map((energyTypeId) => ({ taskId: id, energyTypeId })),
        skipDuplicates: true,
      });
    }

    if (minimumVariant === null) {
      await transaction.taskVariant.deleteMany({
        where: { taskId: id, type: TaskVariantType.minimum },
      });
    } else if (minimumVariant) {
      await transaction.taskVariant.upsert({
        where: { taskId_type: { taskId: id, type: TaskVariantType.minimum } },
        create: { taskId: id, type: TaskVariantType.minimum, ...minimumVariant },
        update: minimumVariant,
      });
    }

    return transaction.task.update({
      where: { id, userId },
      data: taskFields,
      include: taskInclude,
    });
  });
}

export async function changeTaskStatus(
  client: PrismaClient,
  userId: string,
  id: string,
  status: TaskStatus,
): Promise<TaskRecord | null> {
  const existingTask = await client.task.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existingTask) return null;

  const now = new Date();
  const data: Prisma.TaskUpdateInput =
    status === TaskStatus.completed
      ? { status, completedAt: now, archivedAt: null }
      : status === TaskStatus.archived
        ? { status, archivedAt: now }
        : { status, completedAt: null, archivedAt: null };

  return client.task.update({
    where: { id, userId },
    data,
    include: taskInclude,
  });
}