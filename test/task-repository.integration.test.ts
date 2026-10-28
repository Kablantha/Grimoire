// @vitest-environment node

import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { TaskPriority, TaskStatus } from "../src/generated/prisma/enums";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { CreateTaskInputSchema } from "../src/domain/task/create-task-input";
import {
  changeTaskStatus,
  createTask,
  getTask,
  listTasks,
  updateTask,
} from "../src/lib/tasks/task-repository";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run task repository integration tests.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

let userId: string;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  const user = await prisma.user.create({
    data: { id: randomUUID(), name: "Phase 3 integration test user" },
    select: { id: true },
  });
  userId = user.id;
});

afterEach(async () => {
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("task repository", () => {
  it("persists title-only Quick Add input and returns it in the active task list", async () => {
    const input = CreateTaskInputSchema.parse({ title: "Finish assignment" });
    const created = await createTask(prisma, userId, input);
    const tasks = await listTasks(prisma, userId, TaskStatus.active);

    expect(created.title).toBe("Finish assignment");
    expect(tasks.map(({ id }) => id)).toContain(created.id);
  });

  it("keeps omitted planning metadata unknown", async () => {
    const task = await createTask(
      prisma,
      userId,
      CreateTaskInputSchema.parse({ title: "Remember this" }),
    );

    expect(task.estimatedMinutes).toBeNull();
    expect(task.dueAt).toBeNull();
    expect(task.energyLevel).toBeNull();
    expect(task.priority).toBeNull();
  });

  it("persists planning details, existing relationships, energy types, and a minimum variant", async () => {
    const energyType = await prisma.energyType.create({
      data: { userId, name: "Mental", sortOrder: 0, isDefault: true },
      select: { id: true },
    });
    const category = await prisma.category.create({
      data: { userId, name: "School" },
      select: { id: true },
    });
    const project = await prisma.project.create({
      data: { userId, name: "Term project" },
      select: { id: true },
    });
    const course = await prisma.course.create({
      data: { userId, name: "Design 101", code: "DES101" },
      select: { id: true },
    });
    const dueAt = new Date("2026-11-15T18:30:00.000Z");

    const task = await createTask(
      prisma,
      userId,
      CreateTaskInputSchema.parse({
        title: "Prepare project notes",
        description: "Gather the main points",
        dueAt,
        estimatedMinutes: 45,
        energyLevel: 3,
        priority: TaskPriority.should_do,
        categoryId: category.id,
        projectId: project.id,
        courseId: course.id,
        energyTypeIds: [energyType.id],
        minimumVariant: {
          title: "Write a short outline",
          estimatedMinutes: 15,
          energyLevel: 2,
        },
      }),
    );

    expect(task.description).toBe("Gather the main points");
    expect(task.dueAt).toEqual(dueAt);
    expect(task.estimatedMinutes).toBe(45);
    expect(task.energyLevel).toBe(3);
    expect(task.priority).toBe(TaskPriority.should_do);
    expect(task.category?.id).toBe(category.id);
    expect(task.project?.id).toBe(project.id);
    expect(task.course?.id).toBe(course.id);
    expect(task.energyTypes.map(({ energyType: item }) => item.id)).toEqual([energyType.id]);
    expect(task.variants[0]).toMatchObject({
      title: "Write a short outline",
      estimatedMinutes: 15,
      energyLevel: 2,
    });
  });

  it("edits supported task fields and preserves the updated task", async () => {
    const created = await createTask(
      prisma,
      userId,
      CreateTaskInputSchema.parse({ title: "Draft notes" }),
    );

    const updated = await updateTask(
      prisma,
      userId,
      created.id,
      CreateTaskInputSchema.parse({
        title: "Revise notes",
        description: "Add one example",
        estimatedMinutes: 20,
      }),
    );

    expect(updated).toMatchObject({
      id: created.id,
      title: "Revise notes",
      description: "Add one example",
      estimatedMinutes: 20,
    });
    await expect(getTask(prisma, userId, created.id)).resolves.toMatchObject({
      title: "Revise notes",
    });
  });

  it("marks a task completed with a persisted completion timestamp", async () => {
    const created = await createTask(
      prisma,
      userId,
      CreateTaskInputSchema.parse({ title: "Review outline" }),
    );

    const completed = await changeTaskStatus(prisma, userId, created.id, TaskStatus.completed);

    expect(completed?.status).toBe(TaskStatus.completed);
    expect(completed?.completedAt).toBeInstanceOf(Date);
    expect(await prisma.task.findUnique({ where: { id: created.id } })).toMatchObject({
      status: TaskStatus.completed,
    });
  });

  it("archives without deleting and restores to active status", async () => {
    const created = await createTask(
      prisma,
      userId,
      CreateTaskInputSchema.parse({ title: "Keep for later" }),
    );

    const archived = await changeTaskStatus(prisma, userId, created.id, TaskStatus.archived);
    expect(archived?.archivedAt).toBeInstanceOf(Date);
    expect(await prisma.task.findUnique({ where: { id: created.id } })).toMatchObject({
      status: TaskStatus.archived,
    });
    expect(await listTasks(prisma, userId, TaskStatus.archived)).toHaveLength(1);

    const restored = await changeTaskStatus(prisma, userId, created.id, TaskStatus.active);
    expect(restored).toMatchObject({ status: TaskStatus.active, archivedAt: null });
    expect(await listTasks(prisma, userId, TaskStatus.active)).toHaveLength(1);
  });
});