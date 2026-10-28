// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CourseForm from "../components/courses/course-form";
import InstructorForm from "../components/courses/instructor-form";

const { pushMock, refreshMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

vi.mock("../app/(planner)/courses/actions", () => ({
  createCourseAction: vi.fn(),
  updateCourseAction: vi.fn(),
  createInstructorAction: vi.fn(),
  updateInstructorAction: vi.fn(),
}));

afterEach(() => {
  pushMock.mockClear();
  refreshMock.mockClear();
});

describe("Phase 4 forms", () => {
  it("exposes accessible Course fields and the existing-instructor selector", () => {
    render(
      <CourseForm
        initialValues={{
          name: "Design 101",
          code: "DES101",
          term: "Fall",
          startDate: null,
          endDate: null,
          lmsUrl: null,
          instructorId: null,
        }}
        instructors={[
          {
            id: "00000000-0000-4000-8000-000000000001",
            name: "Dr. Rivera",
            email: "rivera@example.edu",
            officeHours: null,
            notes: null,
            createdAt: new Date(0),
            updatedAt: new Date(0),
          },
        ]}
      />,
    );

    for (const label of [
      "Course name",
      "Course prefix and number",
      "Term",
      "Start date",
      "End date",
      "LMS link",
      "Instructor",
    ]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    expect(screen.getByRole("option", { name: "Dr. Rivera" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Manage instructors" }).getAttribute("href")).toBe("/courses/instructors");
  });

  it("exposes accessible instructor contact and notes fields", () => {
    render(<InstructorForm />);

    for (const label of ["Name", "Email", "Office hours", "Notes"]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    expect(screen.getByRole("button", { name: "Add instructor" })).toBeTruthy();
  });
});