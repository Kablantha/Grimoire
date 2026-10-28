// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TaskDependencies from "../components/tasks/task-dependencies";

vi.mock("../app/(planner)/tasks/actions", () => ({
  addDependencyAction: vi.fn(),
  removeDependencyAction: vi.fn(),
}));

afterEach(() => cleanup());

const PREREQUISITES = [
  { id: "p1", title: "Read Chapter 8", status: "active" },
  { id: "p2", title: "Take notes", status: "completed" },
];
const DEPENDENTS = [{ id: "d1", title: "Write response", status: "active" }];
const CANDIDATES = [{ id: "c1", title: "Find sources", status: "active" }];

describe("task dependencies display", () => {
  it("lists prerequisites and dependents with links", () => {
    render(
      <TaskDependencies
        candidates={[]}
        dependents={DEPENDENTS}
        prerequisites={PREREQUISITES}
        taskId="task-1"
      />,
    );

    const prereqList = screen.getByRole("list", { name: "Needs to happen first" });
    expect(within(prereqList).getByRole("link", { name: "Read Chapter 8" })).toBeTruthy();
    expect(within(prereqList).getByRole("link", { name: /Take notes/ })).toBeTruthy();

    const dependentsList = screen.getByRole("list", { name: "Unlocks" });
    expect(within(dependentsList).getByRole("link", { name: "Write response" })).toBeTruthy();
  });

  it("shows empty states when there are no dependencies", () => {
    render(<TaskDependencies candidates={[]} dependents={[]} prerequisites={[]} taskId="task-1" />);

    expect(screen.getByText("Nothing needs to happen first.")).toBeTruthy();
    expect(screen.getByText("Nothing is waiting on this task.")).toBeTruthy();
  });

  it("offers an accessible control to add a prerequisite", () => {
    render(
      <TaskDependencies
        candidates={CANDIDATES}
        dependents={[]}
        prerequisites={[]}
        taskId="task-1"
      />,
    );

    const select = screen.getByLabelText("Add something that needs to happen first");
    expect(select).toBeTruthy();
    expect(within(select as HTMLElement).getByRole("option", { name: "Find sources" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add" })).toBeTruthy();
  });

  it("offers a removal action for each prerequisite", () => {
    render(
      <TaskDependencies
        candidates={[]}
        dependents={[]}
        prerequisites={PREREQUISITES}
        taskId="task-1"
      />,
    );

    expect(screen.getByRole("button", { name: /Remove .Read Chapter 8./ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Remove .Take notes./ })).toBeTruthy();
  });
});
