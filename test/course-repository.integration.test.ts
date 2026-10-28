// @vitest-environment node

import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { AcademicTaskType } from "../src/generated/prisma/enums";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { CreateTaskInputSchema } from "../src/domain/task/create-task-input";
import { CourseInputSchema, InstructorInputSchema } from "../src/domain/course/course-input";
import {
  CourseRelationshipError,
  createCourse,
  createInstructor,
  getCourse,
  listCourses,
  setCourseArchived,
  updateCourse,
  updateInstructor,
} from "../src/lib/courses/course-repository";
import { createTask } from "../src/lib/tasks/task-repository";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for course integration tests.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
let userId: string;

beforeAll(async () => prisma.$connect());
beforeEach(async () => {
  const user = await prisma.user.create({ data: { id: randomUUID(), name: "Phase 4 test user" }, select: { id: true } });
  userId = user.id;
});
afterEach(async () => {
  if (userId) await prisma.user.deleteMany({ where: { id: userId } });
});
afterAll(async () => prisma.$disconnect());

describe("course and instructor repository", () => {
  it("creates a course with an independently created instructor", async () => {
    const instructor = await createInstructor(
      prisma,
      userId,
      InstructorInputSchema.parse({ name: "Dr. Rivera", email: "rivera@example.edu" }),
    );
    const course = await createCourse(
      prisma,
      userId,
      CourseInputSchema.parse({
        name: "Design 101",
        code: "DES101",
        term: "Fall",
        startDate: new Date("2026-09-01T00:00:00Z"),
        endDate: new Date("2026-12-15T00:00:00Z"),
        lmsUrl: "https://example.edu/course",
        instructorId: instructor.id,
      }),
    );

    expect(course).toMatchObject({ name: "Design 101", code: "DES101", instructor: { id: instructor.id } });
  });

  it("edits course data and archives/restores the course without deleting it", async () => {
    const instructor = await createInstructor(prisma, userId, InstructorInputSchema.parse({ name: "Dr. Rivera" }));
    const course = await createCourse(prisma, userId, CourseInputSchema.parse({ name: "Design 101", instructorId: instructor.id }));

    const updated = await updateCourse(prisma, userId, course.id, CourseInputSchema.parse({ name: "Design Studio", instructorId: instructor.id }));
    expect(updated?.name).toBe("Design Studio");
    expect(await prisma.instructor.findUnique({ where: { id: instructor.id } })).toMatchObject({ name: "Dr. Rivera" });

    expect(await setCourseArchived(prisma, userId, course.id, true)).toBe(true);
    expect(await listCourses(prisma, userId)).toHaveLength(0);
    expect(await listCourses(prisma, userId, true)).toHaveLength(1);
    expect(await prisma.course.findUnique({ where: { id: course.id } })).toMatchObject({ name: "Design Studio" });

    expect(await setCourseArchived(prisma, userId, course.id, false)).toBe(true);
    expect(await listCourses(prisma, userId)).toHaveLength(1);
  });

  it("creates and edits instructors independently", async () => {
    const instructor = await createInstructor(prisma, userId, InstructorInputSchema.parse({
      name: "Dr. Rivera",
      email: "rivera@example.edu",
      officeHours: "Tuesday afternoon",
      notes: "Contact through the department office",
    }));

    const updated = await updateInstructor(prisma, userId, instructor.id, InstructorInputSchema.parse({
      name: "Dr. Rivera-Smith",
      email: "rivera.smith@example.edu",
      officeHours: "Wednesday afternoon",
      notes: "Email is preferred",
    }));

    expect(updated).toMatchObject({
      name: "Dr. Rivera-Smith",
      email: "rivera.smith@example.edu",
      officeHours: "Wednesday afternoon",
      notes: "Email is preferred",
    });
  });

  it("rejects an instructor belonging to a different user", async () => {
    const otherUser = await prisma.user.create({ data: { id: randomUUID() }, select: { id: true } });
    const instructor = await createInstructor(prisma, otherUser.id, InstructorInputSchema.parse({ name: "Other instructor" }));

    await expect(createCourse(prisma, userId, CourseInputSchema.parse({ name: "Design 101", instructorId: instructor.id })))
      .rejects.toBeInstanceOf(CourseRelationshipError);

    await prisma.user.delete({ where: { id: otherUser.id } });
  });

  it("associates academic Tasks and leaves ordinary tasks valid without a course", async () => {
    const course = await createCourse(prisma, userId, CourseInputSchema.parse({ name: "Design 101" }));
    const academicTask = await createTask(prisma, userId, CreateTaskInputSchema.parse({
      title: "Read the brief",
      courseId: course.id,
      academicTaskType: AcademicTaskType.reading,
    }));
    const ordinaryTask = await createTask(prisma, userId, CreateTaskInputSchema.parse({ title: "Pick up groceries" }));
    const courseWithTasks = await getCourse(prisma, userId, course.id);

    expect(courseWithTasks?.tasks).toEqual([
      expect.objectContaining({ id: academicTask.id, academicTaskType: AcademicTaskType.reading }),
    ]);
    expect(ordinaryTask.courseId).toBeNull();
    expect(ordinaryTask.academicTaskType).toBeNull();

    await setCourseArchived(prisma, userId, course.id, true);
    const archivedCourseWithTasks = await getCourse(prisma, userId, course.id);
    expect(archivedCourseWithTasks?.tasks.map(({ id }) => id)).toContain(academicTask.id);
  });
});