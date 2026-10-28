// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AppShell from "../components/app-shell";
import CoursesPage from "../app/(planner)/courses/page";
import SettingsPage from "../app/(planner)/settings/page";
import TodayPage from "../app/(planner)/today/page";
import WeekPage from "../app/(planner)/week/page";
import HomePage from "../app/page";

const { redirectMock, pathnameMock, pushMock, refreshMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((destination: string) => {
    throw new Error(`Redirected to ${destination}`);
  }),
  pathnameMock: vi.fn(() => "/today"),
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: pathnameMock,
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

vi.mock("../app/(planner)/tasks/actions", () => ({
  createTaskAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
  redirectMock.mockClear();
  pathnameMock.mockReset();
  pathnameMock.mockReturnValue("/today");
  pushMock.mockClear();
  refreshMock.mockClear();
});

Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  configurable: true,
  value() {
    this.setAttribute("open", "");
  },
});

Object.defineProperty(HTMLDialogElement.prototype, "close", {
  configurable: true,
  value() {
    this.removeAttribute("open");
  },
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
    ["Tasks", "/tasks", () => <h1>Tasks</h1>],
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

  it("opens the accessible Quick Add dialog from the global Add controls", () => {
    render(
      <AppShell>
        <TodayPage />
      </AppShell>,
    );

    const addButtons = screen.getAllByRole("button", { name: "Add task" });
    expect(addButtons).toHaveLength(2);
    fireEvent.click(addButtons[0]);

    const dialog = screen.getByRole("dialog", { name: "What do you need to remember?" });
    expect(within(dialog).getByRole("textbox", { name: "Task title" })).toBeTruthy();
    expect(within(dialog).getByText("Add planning details")).toBeTruthy();
  });

  it("closes Quick Add with Escape and restores focus to the Add trigger", async () => {
    render(
      <AppShell>
        <TodayPage />
      </AppShell>,
    );

    const addButton = screen.getAllByRole("button", { name: "Add task" })[0];
    fireEvent.click(addButton);
    const dialog = screen.getByRole("dialog", { name: "What do you need to remember?" });

    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => expect(dialog.hasAttribute("open")).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(addButton));
  });
});