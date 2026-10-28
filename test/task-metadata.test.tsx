// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskPriority } from "../src/generated/prisma/enums";
import { formatCourseCode, formatCourseIdentity, PriorityPill } from "../components/tasks/task-metadata";

describe("task metadata presentation", () => {
  it.each([
    [TaskPriority.must_do, "Must Do", "bg-pink-100"],
    [TaskPriority.should_do, "Should Do", "bg-orange-100"],
    [TaskPriority.could_do, "Could Do", "bg-yellow-100"],
    [TaskPriority.whenever, "Whenever", "bg-violet-100"],
  ])("presents %s as a calm labeled chip", (priority, label, background) => {
    render(<PriorityPill priority={priority} />);

    const pill = screen.getByLabelText(`Priority: ${label}`);
    expect(pill.textContent).toBe(label);
    expect(pill.className).toContain(background);
  });

  it("includes both the prefix/number and course name in course identity", () => {
    expect(formatCourseIdentity("TCID 302", "Technical Communication"))
      .toBe("TCID 302: Technical Communication");
  });

  it("uses only the course identifier in the course pill", () => {
    expect(formatCourseCode("TCID 302", "Technical Communication")).toBe("TCID 302");
    expect(formatCourseCode(null, "Technical Communication")).toBe("Technical Communication");
  });
});