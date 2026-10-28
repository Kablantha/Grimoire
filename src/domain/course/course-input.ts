import { z } from "zod";

const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

export const InstructorInputSchema = z.object({
  name: z.string().trim().min(1, "Enter an instructor name."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal(""))
    .transform((value) => value || null)
    .nullable()
    .optional(),
  officeHours: nullableText,
  notes: nullableText,
});

export const CourseInputSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a course name."),
    code: nullableText,
    term: nullableText,
    startDate: z.date().nullable().optional(),
    endDate: z.date().nullable().optional(),
    instructorId: z.string().uuid().nullable().optional(),
    lmsUrl: z
      .string()
      .trim()
      .url("Enter a valid course link.")
      .or(z.literal(""))
      .transform((value) => value || null)
      .nullable()
      .optional(),
  })
  .superRefine((course, context) => {
    if (course.startDate && course.endDate && course.endDate < course.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "The end date must be on or after the start date.",
      });
    }
  });

export type InstructorInput = z.infer<typeof InstructorInputSchema>;
export type CourseInput = z.infer<typeof CourseInputSchema>;