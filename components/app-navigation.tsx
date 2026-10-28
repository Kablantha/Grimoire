"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuickAdd } from "./tasks/quick-add-provider";

// Keep Courses visible until Student Features preference state is introduced.
const SHOW_COURSES_DURING_PHASE_ONE = true;

const primaryDestinations = [
  { href: "/today", label: "Today" },
  { href: "/week", label: "Week" },
  { href: "/tasks", label: "Tasks" },
] as const;

function NavigationLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isCurrentPage = pathname === href;

  return (
    <Link
      aria-current={isCurrentPage ? "page" : undefined}
      className={`flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors ${
        isCurrentPage
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "text-[var(--muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

function AddButton() {
  const { openQuickAdd } = useQuickAdd();

  return (
    <button
      aria-label="Add task"
      className="min-h-11 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)]"
      onClick={(event) => openQuickAdd(event.currentTarget)}
      type="button"
    >
      Add
    </button>
  );
}

export function DesktopNavigation() {
  return (
    <nav aria-label="Primary navigation" className="mt-10">
      <ul className="space-y-1">
        {primaryDestinations.map((destination) => (
          <li key={destination.href}>
            <NavigationLink {...destination} />
          </li>
        ))}
        {SHOW_COURSES_DURING_PHASE_ONE && (
          <li>
            <NavigationLink href="/courses" label="Courses" />
          </li>
        )}
        <li>
          <AddButton />
        </li>
        <li>
          <NavigationLink href="/settings" label="Settings" />
        </li>
      </ul>
    </nav>
  );
}

export function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-white/95 px-2 pt-2 shadow-[0_-6px_24px_rgba(38,54,48,0.06)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5 items-end gap-1">
        <li>
          <NavigationLink href="/today" label="Today" />
        </li>
        <li>
          <NavigationLink href="/week" label="Week" />
        </li>
        <li className="flex justify-center">
          <AddButton />
        </li>
        <li>
          <NavigationLink href="/tasks" label="Tasks" />
        </li>
        <li className="relative">
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-md px-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--canvas)]">
              More
            </summary>
            <div className="absolute bottom-full right-0 mb-3 min-w-40 rounded-md border border-[var(--line)] bg-white p-2 shadow-lg">
              {SHOW_COURSES_DURING_PHASE_ONE && (
                <NavigationLink href="/courses" label="Courses" />
              )}
              <NavigationLink href="/settings" label="Settings" />
            </div>
          </details>
        </li>
      </ul>
    </nav>
  );
}