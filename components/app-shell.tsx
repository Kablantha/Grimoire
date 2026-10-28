import Link from "next/link";
import type { ReactNode } from "react";
import { DesktopNavigation, MobileNavigation } from "./app-navigation";
import QuickAddProvider from "./tasks/quick-add-provider";
import type { TaskFormOptions } from "../src/lib/tasks/task-repository";

const EMPTY_TASK_FORM_OPTIONS: TaskFormOptions = {
  energyTypes: [],
  categories: [],
  projects: [],
  courses: [],
};

export default function AppShell({
  children,
  taskFormOptions = EMPTY_TASK_FORM_OPTIONS,
}: {
  children: ReactNode;
  taskFormOptions?: TaskFormOptions;
}) {
  return (
    <QuickAddProvider options={taskFormOptions}>
      <a
        className="sr-only z-50 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div className="min-h-screen lg:flex">
        <aside
          aria-label="Application navigation"
          className="hidden w-64 shrink-0 border-r border-[var(--line)] bg-white px-5 py-8 lg:block"
        >
          <Link
            className="inline-flex min-h-11 items-center rounded-sm text-lg font-semibold tracking-normal text-[var(--ink)]"
            href="/today"
          >
            Energy Planner
          </Link>
          <p className="mt-1 text-sm text-[var(--muted)]">
            A plan that fits.
          </p>
          <DesktopNavigation />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          <header className="flex min-h-16 items-center border-b border-[var(--line)] bg-white px-5 lg:hidden">
            <Link
              className="inline-flex min-h-11 items-center rounded-sm text-base font-semibold tracking-normal text-[var(--ink)]"
              href="/today"
            >
              Energy Planner
            </Link>
          </header>
          <main
            className="w-full flex-1 px-5 py-10 sm:px-8 sm:py-14"
            id="main-content"
            tabIndex={-1}
          >
            <div className="mx-auto w-full max-w-4xl">{children}</div>
          </main>
        </div>
      </div>
      <MobileNavigation />
    </QuickAddProvider>
  );
}