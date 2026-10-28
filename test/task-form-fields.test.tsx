// @vitest-environment jsdom

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TaskActionState } from "../src/domain/task/task-action-state";
import type { TaskFormOptions } from "../src/lib/tasks/task-repository";
import TaskFormFields from "../components/tasks/task-form-fields";

const emptyOptions: TaskFormOptions = {
  energyTypes: [],
  categories: [],
  projects: [],
  courses: [],
};

describe("task form fields", () => {
  it("exposes a labeled title and progressive disclosure for optional fields", () => {
    render(
      <TaskFormFields
        mode="quick-add"
        options={emptyOptions}
        pending={false}
        state={{ status: "idle" }}
        submitLabel="Add task"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Task title" })).toBeTruthy();
    const planningDetails = screen.getAllByText("Add planning details")[0].closest("details");
    expect(planningDetails?.open).toBe(false);

    fireEvent.click(screen.getByText("Add planning details"));
    expect(planningDetails?.open).toBe(true);

    const planningFields = within(planningDetails as HTMLDetailsElement);
    expect(planningFields.getByRole("textbox", { name: "Description or notes" })).toBeTruthy();
    expect(planningFields.getByRole("spinbutton", { name: "Estimated time (minutes)" })).toBeTruthy();
    const energy = document.getElementById("quick-add-energy-level") as HTMLSelectElement;
    expect(Array.from(energy.options).slice(1).map(({ textContent }) => textContent)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
    expect(document.getElementById(energy.getAttribute("aria-describedby") ?? "")?.textContent?.trim()).toBe(
      "Energy level on a five-level scale from 1 to 5.",
    );
    expect(planningFields.getByRole("combobox", { name: "Priority" })).toBeTruthy();
  });

  it("associates validation errors with their controls and announces them", () => {
    const state: TaskActionState = {
      status: "invalid",
      message: "Please review the highlighted fields.",
      fieldErrors: {
        title: "Too short",
        estimatedMinutes: "Must be 0 or more",
        energyLevel: "Choose a value from 1 to 5",
      },
    };

    render(
      <TaskFormFields
        mode="quick-add"
        options={emptyOptions}
        pending={false}
        state={state}
        submitLabel="Add task"
      />,
    );

    const planningDetails = screen.getAllByText("Add planning details")[0].closest("details");
    const planningFields = within(planningDetails as HTMLDetailsElement);
    const title = screen.getByLabelText("Task title", { exact: true }) as HTMLInputElement;
    const duration = planningFields.getByLabelText("Estimated time (minutes)", { exact: true }) as HTMLInputElement;
    const energy = document.getElementById("quick-add-energy-level") as HTMLSelectElement | null;
    expect(energy).toBeTruthy();

    expect(title.labels?.[0]?.textContent).toBe("Task title");
    expect(duration.labels?.[0]?.textContent).toBe("Estimated time (minutes)");
    expect(energy?.labels?.[0]?.textContent).toBe("Energy level");
    expect(energy?.getAttribute("aria-describedby")).toContain("quick-add-energy-scale-description");
    const announcedErrors = screen.getAllByRole("alert").map((alert) => alert.textContent);
    expect(announcedErrors).toContain("Too short");
    expect(announcedErrors).toContain("Must be 0 or more");
    expect(announcedErrors).toContain("Choose a value from 1 to 5");
  });
});