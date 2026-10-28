import type { Prisma, PrismaClient } from "../../generated/prisma/client";
import type { CourseInput, InstructorInput } from "../../domain/course/course-input";

const courseListInclude = {
  instructor: {
    select: { id: true, name: true, email: true, officeHours: true, notes: true },
  },
} satisfies Prisma.CourseInclude;

export type CourseRecord = Prisma.CourseGetPayload<{
  include: typeof courseListInclude;
}>;

export type InstructorRecord = {
  id: string;
  name: string;
  email: string | null;
  officeHours: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class CourseRelationshipError extends Error {
  constructor() {
    super("The selected instructor is no longer available.");
    this.name = "CourseRelationshipError";
  }
}

async function validateInstructor(
  client: PrismaClient,
  userId: string,
  instructorId?: string | null,
) {
  if (!instructorId) return;
  const instructor = await client.instructor.findFirst({
    where: { id: instructorId, userId },
    select: { id: true },
  });
  if (!instructor) throw new CourseRelationshipError();
}

export async function listCourses(
  client: PrismaClient,
  userId: string,
  archived = false,
): Promise<CourseRecord[]> {
  return client.course.findMany({
    where: { userId, archivedAt: archived ? { not: null } : null },
    include: courseListInclude,
    orderBy: [{ name: "asc" }, { code: "asc" }],
  });
}

export async function getCourse(
  client: PrismaClient,
  userId: string,
  id: string,
) {
  return client.course.findFirst({
    where: { id, userId },
    include: {
      instructor: {
        select: { id: true, name: true, email: true, officeHours: true, notes: true },
      },
      tasks: {
        where: { userId },
        select: {
          id: true,
          title: true,
          status: true,
          academicTaskType: true,
          dueAt: true,
          priority: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createCourse(
  client: PrismaClient,
  userId: string,
  input: CourseInput,
): Promise<CourseRecord> {
  await validateInstructor(client, userId, input.instructorId);
  return client.course.create({
    data: { ...input, userId },
    include: courseListInclude,
  });
}

export async function updateCourse(
  client: PrismaClient,
  userId: string,
  id: string,
  input: CourseInput,
): Promise<CourseRecord | null> {
  await validateInstructor(client, userId, input.instructorId);
  const existing = await client.course.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) return null;

  return client.course.update({
    where: { id, userId },
    data: input,
    include: courseListInclude,
  });
}

export async function setCourseArchived(
  client: PrismaClient,
  userId: string,
  id: string,
  archived: boolean,
) {
  const result = await client.course.updateMany({
    where: { id, userId },
    data: { archivedAt: archived ? new Date() : null },
  });
  return result.count > 0;
}

export async function listInstructors(
  client: PrismaClient,
  userId: string,
): Promise<InstructorRecord[]> {
  return client.instructor.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function getInstructor(
  client: PrismaClient,
  userId: string,
  id: string,
): Promise<InstructorRecord | null> {
  return client.instructor.findFirst({ where: { id, userId } });
}

export async function createInstructor(
  client: PrismaClient,
  userId: string,
  input: InstructorInput,
): Promise<InstructorRecord> {
  return client.instructor.create({ data: { ...input, userId } });
}

export async function updateInstructor(
  client: PrismaClient,
  userId: string,
  id: string,
  input: InstructorInput,
): Promise<InstructorRecord | null> {
  const result = await client.instructor.updateMany({
    where: { id, userId },
    data: input,
  });
  if (!result.count) return null;
  return getInstructor(client, userId, id);
}