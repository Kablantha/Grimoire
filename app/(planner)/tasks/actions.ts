"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus } from "../../../src/generated/prisma/enums";
import { CreateTaskInputSchema } from "../../../src/domain/task/create-task-input";
import type { TaskActionState } from "../../../src/domain/task/task-action-state";
import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import {
  changeTaskStatus,
  createTask,
  TaskRelationshipError,
  updateTask,
} from "../../../src/lib/tasks/task-repository";
import { prisma } from "../../../src/lib/prisma";

function formValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function optionalText(value: string, clearEmpty: boolean): string | null | undefined {
  const trimmed = value.trim();
  return trimmed || (clearEmpty ? null : undefined);
}

function optionalNumber(
  value: string,
  clearEmpty: boolean,
): number | null | undefined {
  if (!value.trim()) return clearEmpty ? null : undefined;
  return Number(value);
}

function localDateTimeToDate(value: string, offsetValue: string): Date | null | undefined {
  if (!value.trim()) return undefined;

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return new Date(Number.NaN);

  const [, year, month, day, hour, minute] = match;
  const offsetMinutes = Number(offsetValue) || 0;
  const localAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  return new Date(localAsUtc + offsetMinutes * 60_000);
}

function parseTaskForm(formData: FormData, clearEmpty: boolean) {
  const variantTitle = formValue(formData, "minimumVariantTitle").trim();
  const minimumVariant = variantTitle
    ? {
        title: variantTitle,
        estimatedMinutes: optionalNumber(
          formValue(formData, "minimumVariantEstimatedMinutes"),
          false,
        ),
        energyLevel: optionalNumber(formValue(formData, "minimumVariantEnergyLevel"), false),
      }
    : clearEmpty
      ? null
      : undefined;

  return CreateTaskInputSchema.safeParse({
    title: formValue(formData, "title"),
    description: optionalText(formValue(formData, "description"), clearEmpty),
    priority: optionalText(formValue(formData, "priority"), clearEmpty),
    estimatedMinutes: optionalNumber(formValue(formData, "estimatedMinutes"), clearEmpty),
    energyLevel: optionalNumber(formValue(formData, "energyLevel"), clearEmpty),
    dueAt: localDateTimeToDate(
      formValue(formData, "dueAt"),
      formValue(formData, "timezoneOffsetMinutes"),
    ) ?? (clearEmpty ? null : undefined),
    categoryId: optionalText(formValue(formData, "categoryId"), clearEmpty),
    projectId: optionalText(formValue(formData, "projectId"), clearEmpty),
    courseId: optionalText(formValue(formData, "courseId"), clearEmpty),
    energyTypeIds: formData.getAll("energyTypeIds").filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    ),
    minimumVariant,
  });
}

function validationState(error: { issues: { path: PropertyKey[]; message: string }[] }): TaskActionState {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "title";
    fieldErrors[key] ??= issue.message;
  }

  return {
    status: "invalid",
    message: "Please review the highlighted fields.",
    fieldErrors,
  };
}

async function refreshTaskPaths(taskId?: string) {
  revalidatePath("/tasks");
  if (taskId) revalidatePath(`/tasks/${taskId}`);
}

export async function createTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = parseTaskForm(formData, false);
  if (!parsed.success) return validationState(parsed.error);

  try {
    const user = await ensureDevelopmentUser(prisma);
    const task = await createTask(prisma, user.id, parsed.data);
    await refreshTaskPaths(task.id);

    return { status: "success", taskId: task.id, message: "Task saved." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof TaskRelationshipError
          ? error.message
          : "I couldn't save that task. Your existing tasks are unchanged.",
    };
  }
}

export async function updateTaskAction(
  taskId: string,
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = parseTaskForm(formData, true);
  if (!parsed.success) return validationState(parsed.error);

  try {
    const user = await ensureDevelopmentUser(prisma);
    const task = await updateTask(prisma, user.id, taskId, parsed.data);
    if (!task) return { status: "error", message: "This task could not be found." };

    await refreshTaskPaths(task.id);
    return { status: "success", taskId: task.id, message: "Changes saved." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof TaskRelationshipError
          ? error.message
          : "I couldn't save those changes. The task is unchanged.",
    };
  }
}

async function updateTaskStatus(formData: FormData, status: TaskStatus) {
  const taskId = formValue(formData, "taskId");
  if (!/^[0-9a-f-]{36}$/i.test(taskId)) return;

  const user = await ensureDevelopmentUser(prisma);
  const task = await changeTaskStatus(prisma, user.id, taskId, status);
  if (task) await refreshTaskPaths(task.id);
}

export async function completeTaskAction(formData: FormData) {
  await updateTaskStatus(formData, TaskStatus.completed);
}

export async function archiveTaskAction(formData: FormData) {
  await updateTaskStatus(formData, TaskStatus.archived);
}

export async function restoreTaskAction(formData: FormData) {
  await updateTaskStatus(formData, TaskStatus.active);
}