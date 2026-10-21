import { AcademicTaskType, TaskPriority } from "../../generated/prisma/enums";
import { z } from "zod";

export const CreateTaskInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().nullable().optional(),
  priority: z.enum(TaskPriority).nullable().optional(),
  estimatedMinutes: z.number().int().nonnegative().nullable().optional(),
  energyLevel: z.number().int().min(1).max(5).nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
  earliestStartAt: z.coerce.date().nullable().optional(),
  manuallyScheduled: z.boolean().optional(),
  academicTaskType: z.enum(AcademicTaskType).nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  courseId: z.string().uuid().nullable().optional(),
  parentTaskId: z.string().uuid().nullable().optional(),
  energyTypeIds: z.array(z.string().uuid()).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;