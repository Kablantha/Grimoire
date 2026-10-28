"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addDependencyAction, removeDependencyAction } from "../../app/(planner)/tasks/actions";
import type { DependencyActionState } from "../../app/(planner)/tasks/actions";

const INITIAL_STATE: DependencyActionState = { status: "idle" };

export type DependencyTaskRef = {
  id: string;
  title: string;
  status: string;
};

function DependencyList({
  headingId,
  tasks,
}: {
  headingId: string;
  tasks: DependencyTaskRef[];
}) {
  return (
    <ul aria-labelledby={headingId} className="mt-3 space-y-1">
      {tasks.map((task) => (
        <li key={task.id}>
          <Link
            className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
            href={`/tasks/${task.id}`}
          >
            {task.title}
            {task.status !== "active" && (
              <span className="ml-2 text-xs font-normal text-[var(--muted)]">({task.status})</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function TaskDependencies({
  taskId,
  prerequisites,
  dependents,
  candidates,
}: {
  taskId: string;
  prerequisites: DependencyTaskRef[];
  dependents: DependencyTaskRef[];
  candidates: DependencyTaskRef[];
}) {
  const [state, formAction] = useActionState(
    addDependencyAction.bind(null, taskId),
    INITIAL_STATE,
  );

  return (
    <section aria-labelledby="task-dependencies-heading" className="mt-8 border-t border-[var(--line)] pt-6">
      <h2 className="text-sm font-semibold text-[var(--muted)]" id="task-dependencies-heading">
        Dependencies
      </h2>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-[var(--ink)]" id="prerequisites-heading">
            Needs to happen first
          </h3>
          {prerequisites.length > 0 ? (
            <DependencyList headingId="prerequisites-heading" tasks={prerequisites} />
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">Nothing needs to happen first.</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-[var(--ink)]" id="dependents-heading">
            Unlocks
          </h3>
          {dependents.length > 0 ? (
            <DependencyList headingId="dependents-heading" tasks={dependents} />
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">Nothing is waiting on this task.</p>
          )}
        </div>
      </div>

      {candidates.length > 0 && (
        <form action={formAction} className="mt-6 max-w-md">
          <label className="mb-2 block text-sm font-medium" htmlFor="add-prerequisite">
            Add something that needs to happen first
          </label>
          <div className="flex gap-2">
            <select
              className="min-h-11 flex-1 rounded-md border border-[var(--line)] bg-white px-3"
              id="add-prerequisite"
              name="prerequisiteTaskId"
            >
              <option value="">Choose a task</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.title}
                </option>
              ))}
            </select>
            <button
              className="min-h-11 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium"
              type="submit"
            >
              Add
            </button>
          </div>
          {state.message && (
            <p
              className={`mt-2 text-sm ${state.status === "error" ? "text-rose-800" : "text-[var(--muted)]"}`}
              role={state.status === "error" ? "alert" : "status"}
            >
              {state.message}
            </p>
          )}
        </form>
      )}

      {prerequisites.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-[var(--ink)]">Remove a dependency</h3>
          <ul className="mt-2 space-y-2">
            {prerequisites.map((prerequisite) => (
              <li key={prerequisite.id}>
                <form action={removeDependencyAction}>
                  <input name="dependentTaskId" type="hidden" value={taskId} />
                  <input name="prerequisiteTaskId" type="hidden" value={prerequisite.id} />
                  <button
                    className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-[var(--muted)] hover:bg-[var(--canvas)]"
                    type="submit"
                  >
                    Remove &ldquo;{prerequisite.title}&rdquo;
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
