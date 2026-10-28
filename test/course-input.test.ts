// @vitest-environment node

import { describe, expect, it } from "vitest";
import { CourseInputSchema, InstructorInputSchema } from "../src/domain/course/course-input";

describe("CourseInputSchema", () => {
  it("accepts a course with only its required name", () => {
    expect(CourseInputSchema.safeParse({ name: "Design 101" }).success).toBe(true);
  });

  it("accepts optional dates, link, code, term, and instructor reference", () => {
    expect(CourseInputSchema.safeParse({
      name: "Design 101",
      code: "DES101",
      term: "Fall",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-15T00:00:00Z"),
      lmsUrl: "https://example.edu/course",
      instructorId: "00000000-0000-4000-8000-000000000001",
    }).success).toBe(true);
  });

  it("rejects blank names, invalid links, and reversed course dates", () => {
    expect(CourseInputSchema.safeParse({ name: "  " }).success).toBe(false);
    expect(CourseInputSchema.safeParse({ name: "Design 101", lmsUrl: "not a link" }).success).toBe(false);
    expect(CourseInputSchema.safeParse({
      name: "Design 101",
      startDate: new Date("2026-12-15T00:00:00Z"),
      endDate: new Date("2026-09-01T00:00:00Z"),
    }).success).toBe(false);
  });
});

describe("InstructorInputSchema", () => {
  it("accepts a name with optional contact details omitted", () => {
    expect(InstructorInputSchema.safeParse({ name: "Dr. Rivera" }).success).toBe(true);
  });

  it("rejects blank names and malformed email addresses", () => {
    expect(InstructorInputSchema.safeParse({ name: " " }).success).toBe(false);
    expect(InstructorInputSchema.safeParse({ name: "Dr. Rivera", email: "not-an-email" }).success).toBe(false);
  });
});