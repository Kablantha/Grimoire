// @vitest-environment node

import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { CreateTaskInputSchema } from "../src/domain/task/create-task-input";
import { addDependency, removeDependency } from "../src/lib/tasks/dependency-repository";
import { createTask, getTask } from "../src/lib/tasks/task-repository";
import { CircularDependencyError } from "../src/domain/scheduler/dependency-graph";
import { TaskDependencyType } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for dependency integration tests.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
let userId: string;

async function makeTask(title: string) {
  return createTask(prisma, userId, CreateTaskInputSchema.parse({ title }));
}

beforeAll(async () => prisma.$connect());
beforeEach(async () => {
  const user = await prisma.user.create({ data: { id: randomUUID(), name: "Phase 7 test user" }, select: { id: true } });
  userId = user.id;
});
afterEach(async () => {
  if (userId) await prisma.user.deleteMany({ where: { id: userId } });
});
afterAll(async () => prisma.$disconnect());

describe("dependency repository", () => {
  it("creates a dependency and exposes it on both tasks", async () => {
    const reading = await makeTask("Read Chapter 8");
    const response = await makeTask("Write response");

    await addDependency(prisma, userId, reading.id, response.id, TaskDependencyType.hard);

    const dependent = await getTask(prisma, userId, response.id);
    expect(dependent?.dependentLinks).toHaveLength(1);
    expect(dependent?.dependentLinks[0].prerequisiteTask.title).toBe("Read Chapter 8");

    const prerequisite = await getTask(prisma, userId, reading.id);
    expect(prerequisite?.prerequisiteLinks).toHaveLength(1);
    expect(prerequisite?.prerequisiteLinks[0].dependentTask.title).toBe("Write response");
  });

  it("removes a dependency", async () => {
    const reading = await makeTask("Read Chapter 8");
    const response = await makeTask("Write response");
    await addDependency(prisma, userId, reading.id, response.id, TaskDependencyType.hard);

    const removed = await removeDependency(prisma, userId, reading.id, response.id);
    expect(removed).toBe(true);

    const dependent = await getTask(prisma, userId, response.id);
    expect(dependent?.dependentLinks).toHaveLength(0);
  });

  it("supports indirect dependency chains without a cycle", async () => {
    const a = await makeTask("A");
    const b = await makeTask("B");
    const c = await makeTask("C");

    await addDependency(prisma, userId, a.id, b.id, TaskDependencyType.hard);
    await addDependency(prisma, userId, b.id, c.id, TaskDependencyType.hard);

    const taskC = await getTask(prisma, userId, c.id);
    expect(taskC?.dependentLinks[0].prerequisiteTask.id).toBe(b.id);
  });

  it("rejects a circular dependency across a chain", async () => {
    const a = await makeTask("A");
    const b = await makeTask("B");
    const c = await makeTask("C");

    await addDependency(prisma, userId, a.id, b.id, TaskDependencyType.hard);
    await addDependency(prisma, userId, b.id, c.id, TaskDependencyType.hard);

    await expect(
      addDependency(prisma, userId, c.id, a.id, TaskDependencyType.hard),
    ).rejects.toBeInstanceOf(CircularDependencyError);
  });

  it("rejects a dependency on a task belonging to another user", async () => {
    const otherUser = await prisma.user.create({ data: { id: randomUUID() }, select: { id: true } });
    const ours = await makeTask("Ours");
    const theirs = await createTask(prisma, otherUser.id, CreateTaskInputSchema.parse({ title: "Theirs" }));

    await expect(
      addDependency(prisma, userId, theirs.id, ours.id, TaskDependencyType.hard),
    ).rejects.toBeInstanceOf(Error);

    await prisma.user.delete({ where: { id: otherUser.id } });
  });
});
