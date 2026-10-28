// @vitest-environment node

import "dotenv/config";
import { vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { afterAll, describe, expect, it } from "vitest";
import { createTaskAction } from "../app/(planner)/tasks/actions";
import { INITIAL_TASK_ACTION_STATE } from "../src/domain/task/task-action-state";
import { DEVELOPMENT_USER_ID } from "../src/lib/tasks/development-user";
import { listTasks } from "../src/lib/tasks/task-repository";
import { prisma } from "../src/lib/prisma";
import { TaskStatus } from "../src/generated/prisma/enums";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run task action integration tests.");
}

afterAll(async () => {
  await prisma.$disconnect();
});

function taskForm(title: string, values: Record<string, string> = {}) {
  const formData = new FormData();
  formData.set("title", title);
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

describe("Quick Add server action", () => {
  it("persists title-only input and includes the task in the active Tasks view", async () => {
    const title = `Action integration ${crypto.randomUUID()}`;
    const result = await createTaskAction(INITIAL_TASK_ACTION_STATE, taskForm(title));

    expect(result.status).toBe("success");
    expect(result.taskId).toBeTruthy();

    try {
      const tasks = await listTasks(prisma, DEVELOPMENT_USER_ID, TaskStatus.active);
      expect(tasks.find(({ id }) => id === result.taskId)).toMatchObject({
        title,
        estimatedMinutes: null,
        dueAt: null,
        energyLevel: null,
        priority: null,
      });
    } finally {
      await prisma.task.deleteMany({ where: { id: result.taskId } });
    }
  });

  it("returns an accessible title error for whitespace-only input", async () => {
    const result = await createTaskAction(
      INITIAL_TASK_ACTION_STATE,
      taskForm("  \n  "),
    );

    expect(result.status).toBe("invalid");
    expect(result.fieldErrors?.title).toBe("Enter a task title.");
  });

  it.each([
    ["energyLevel", "0", "energyLevel"],
    ["energyLevel", "6", "energyLevel"],
    ["estimatedMinutes", "-10", "estimatedMinutes"],
  ])("rejects invalid %s without creating a task", async (field, value, expectedError) => {
    const result = await createTaskAction(
      INITIAL_TASK_ACTION_STATE,
      taskForm(`Invalid ${crypto.randomUUID()}`, { [field]: value }),
    );

    expect(result.status).toBe("invalid");
    expect(result.fieldErrors?.[expectedError]).toBeTruthy();
  });
});