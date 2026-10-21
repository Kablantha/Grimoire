// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AppShell from "../components/app-shell";
import CoursesPage from "../app/(planner)/courses/page";
import SettingsPage from "../app/(planner)/settings/page";
import TasksPage from "../app/(planner)/tasks/page";
import TodayPage from "../app/(planner)/today/page";
import WeekPage from "../app/(planner)/week/page";
import HomePage from "../app/page";

const { redirectMock, pathnameMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((destination: string) => {
    throw new Error(`Redirected to ${destination}`);
  }),
  pathnameMock: vi.fn(() => "/today"),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: pathnameMock,
}));

afterEach(() => {
  cleanup();
  redirectMock.mockClear();
  pathnameMock.mockReset();
  pathnameMock.mockReturnValue("/today");
});

describe("application shell", () => {
  it("renders semantic landmarks and a clear Today heading", () => {
    render(
      <AppShell>
        <TodayPage />
      </AppShell>,
    );

    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Today" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Skip to main content" })).toBeTruthy();
  });

  it("redirects the root destination to Today", () => {
    expect(() => HomePage()).toThrow("Redirected to /today");
    expect(redirectMock).toHaveBeenCalledWith("/today");
  });

  it.each([
    ["Today", "/today", TodayPage],
    ["Week", "/week", WeekPage],
    ["Tasks", "/tasks", TasksPage],
    ["Courses", "/courses", CoursesPage],
    ["Settings", "/settings", SettingsPage],
  ])("renders the %s destination at %s", (title, path, Page) => {
    pathnameMock.mockReturnValue(path);

    render(
      <AppShell>
        <Page />
      </AppShell>,
    );

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeTruthy();
    expect(
      within(
        screen.getByRole("navigation", { name: "Primary navigation" }),
      ).getByRole("link", { name: title, current: "page" }),
    ).toBeTruthy();
  });

  it("provides desktop destinations and the compact mobile navigation", () => {
    render(
      <AppShell>
        <TodayPage />
      </AppShell>,
    );

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    for (const destination of ["Today", "Week", "Tasks", "Courses", "Settings"]) {
      expect(within(desktopNavigation).getByRole("link", { name: destination })).toBeTruthy();
    }

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    for (const destination of ["Today", "Week", "Tasks"]) {
      expect(within(mobileNavigation).getByRole("link", { name: destination })).toBeTruthy();
    }
    expect(within(mobileNavigation).getByText("More")).toBeTruthy();
  });

  it("exposes Courses and Settings through the mobile More control", () => {
    render(
      <AppShell>
        <TodayPage />
      </AppShell>,
    );

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    fireEvent.click(within(mobileNavigation).getByText("More"));

    expect(within(mobileNavigation).getByRole("link", { name: "Courses" })).toBeTruthy();
    expect(within(mobileNavigation).getByRole("link", { name: "Settings" })).toBeTruthy();
  });

  it("provides an accessible Add placeholder in both navigation patterns", () => {
    render(
      <AppShell>
        <TodayPage />
      </AppShell>,
    );

    const addButtons = screen.getAllByRole("button", { name: "Add" });
    expect(addButtons).toHaveLength(2);
    for (const button of addButtons) {
      expect(button.getAttribute("aria-disabled")).toBe("true");
      expect(button.getAttribute("aria-describedby")).toBe("quick-add-description");
    }
    expect(screen.getByText("Quick Add will be available in a later phase.")).toBeTruthy();
  });
});