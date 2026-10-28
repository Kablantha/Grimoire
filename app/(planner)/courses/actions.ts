"use server";

import { revalidatePath } from "next/cache";
import { CourseInputSchema, InstructorInputSchema } from "../../../src/domain/course/course-input";
import type { CourseActionState } from "../../../src/domain/course/course-action-state";
import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import {
  CourseRelationshipError,
  createCourse,
  createInstructor,
  setCourseArchived,
  updateCourse,
  updateInstructor,
} from "../../../src/lib/courses/course-repository";
import { prisma } from "../../../src/lib/prisma";

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field : "";
}

function optionalDate(formData: FormData, key: string) {
  const raw = value(formData, key).trim();
  if (!raw) return null;
  return new Date(`${raw}T00:00:00.000Z`);
}

function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }): CourseActionState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "name";
    errors[key] ??= issue.message;
  }
  return { status: "invalid", message: "Please review the highlighted fields.", fieldErrors: errors };
}

function duplicateCodeError(error: unknown): CourseActionState | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return {
      status: "invalid",
      message: "That course code is already in use for one of your courses.",
      fieldErrors: { code: "Choose a different course code." },
    };
  }
  return null;
}

function parseCourse(formData: FormData) {
  const instructorId = value(formData, "instructorId").trim();
  return CourseInputSchema.safeParse({
    name: value(formData, "name"),
    code: value(formData, "code"),
    term: value(formData, "term"),
    startDate: optionalDate(formData, "startDate"),
    endDate: optionalDate(formData, "endDate"),
    instructorId: instructorId || null,
    lmsUrl: value(formData, "lmsUrl"),
  });
}

function parseInstructor(formData: FormData) {
  return InstructorInputSchema.safeParse({
    name: value(formData, "name"),
    email: value(formData, "email"),
    officeHours: value(formData, "officeHours"),
    notes: value(formData, "notes"),
  });
}

export async function createCourseAction(
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const parsed = parseCourse(formData);
  if (!parsed.success) return fieldErrors(parsed.error);

  try {
    const user = await ensureDevelopmentUser(prisma);
    const course = await createCourse(prisma, user.id, parsed.data);
    revalidatePath("/courses");
    return { status: "success", recordId: course.id, message: "Course saved." };
  } catch (error) {
    const duplicateError = duplicateCodeError(error);
    if (duplicateError) return duplicateError;
    return {
      status: "error",
      message: error instanceof CourseRelationshipError
        ? error.message
        : "I couldn't save that course. Your existing courses are unchanged.",
    };
  }
}

export async function updateCourseAction(
  courseId: string,
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const parsed = parseCourse(formData);
  if (!parsed.success) return fieldErrors(parsed.error);

  try {
    const user = await ensureDevelopmentUser(prisma);
    const course = await updateCourse(prisma, user.id, courseId, parsed.data);
    if (!course) return { status: "error", message: "This course could not be found." };
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.id}`);
    return { status: "success", recordId: course.id, message: "Course changes saved." };
  } catch (error) {
    const duplicateError = duplicateCodeError(error);
    if (duplicateError) return duplicateError;
    return {
      status: "error",
      message: error instanceof CourseRelationshipError
        ? error.message
        : "I couldn't save those course changes. The course is unchanged.",
    };
  }
}

async function setArchived(formData: FormData, archived: boolean) {
  const courseId = value(formData, "courseId");
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) return;
  const user = await ensureDevelopmentUser(prisma);
  const updated = await setCourseArchived(prisma, user.id, courseId, archived);
  if (updated) {
    revalidatePath("/courses");
    revalidatePath(`/courses/${courseId}`);
  }
}

export async function archiveCourseAction(formData: FormData) {
  await setArchived(formData, true);
}

export async function restoreCourseAction(formData: FormData) {
  await setArchived(formData, false);
}

export async function createInstructorAction(
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const parsed = parseInstructor(formData);
  if (!parsed.success) return fieldErrors(parsed.error);

  try {
    const user = await ensureDevelopmentUser(prisma);
    const instructor = await createInstructor(prisma, user.id, parsed.data);
    revalidatePath("/courses/instructors");
    revalidatePath("/courses");
    return { status: "success", recordId: instructor.id, message: "Instructor saved." };
  } catch {
    return { status: "error", message: "I couldn't save that instructor." };
  }
}

export async function updateInstructorAction(
  instructorId: string,
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const parsed = parseInstructor(formData);
  if (!parsed.success) return fieldErrors(parsed.error);

  const user = await ensureDevelopmentUser(prisma);
  const instructor = await updateInstructor(prisma, user.id, instructorId, parsed.data);
  if (!instructor) return { status: "error", message: "This instructor could not be found." };
  revalidatePath("/courses/instructors");
  revalidatePath("/courses");
  return { status: "success", recordId: instructor.id, message: "Instructor changes saved." };
}