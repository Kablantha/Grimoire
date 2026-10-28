"use server";

import { revalidatePath } from "next/cache";
import { DailyCapacityInputSchema } from "../../../src/domain/capacity/capacity-input";
import type { CapacityActionState } from "../../../src/domain/capacity/capacity-action-state";
import { todayDayString } from "../../../src/domain/capacity/day-key";
import { CapacityEnergyTypeError, upsertDailyCapacity } from "../../../src/lib/capacity/capacity-repository";
import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import { prisma } from "../../../src/lib/prisma";

function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }): CapacityActionState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "capacities";
    errors[key] ??= issue.message;
  }
  return {
    status: "invalid",
    message: "Please review the highlighted fields.",
    fieldErrors: errors,
  };
}

export async function saveDailyCapacityAction(
  _previousState: CapacityActionState,
  formData: FormData,
): Promise<CapacityActionState> {
  const user = await ensureDevelopmentUser(prisma);
  const timezone = user.timezone || "UTC";

  const dateField = formData.get("date");
  const date =
    typeof dateField === "string" && dateField.trim()
      ? dateField.trim()
      : todayDayString(timezone);

  const notesField = formData.get("notes");
  const notes = typeof notesField === "string" ? notesField : "";

  const capacities: Record<string, number> = {};
  for (const [key, rawValue] of formData.entries()) {
    if (!key.startsWith("capacity-")) continue;
    const energyTypeId = key.slice("capacity-".length);
    const level = typeof rawValue === "string" ? Number(rawValue) : Number.NaN;
    if (Number.isFinite(level)) capacities[energyTypeId] = level;
  }

  const parsed = DailyCapacityInputSchema.safeParse({ date, notes, capacities });
  if (!parsed.success) return fieldErrors(parsed.error);

  try {
    await upsertDailyCapacity(prisma, user.id, parsed.data);
    revalidatePath("/today");
    return { status: "success", message: "Today's capacity is saved." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof CapacityEnergyTypeError
          ? error.message
          : "I couldn't save today's capacity. Nothing was changed.",
    };
  }
}
