"use client";

import { useEffect, useState } from "react";
import type { TaskFormOptions } from "../../src/lib/tasks/task-repository";
import type { TaskActionState } from "../../src/domain/task/task-action-state";

export type TaskFormValues = {
  title?: string;
  description?: string | null;
  dueAt?: string | null;
  estimatedMinutes?: number | null;
  energyLevel?: number | null;
  priority?: string | null;
  categoryId?: string | null;
  projectId?: string | null;
  courseId?: string | null;
  energyTypeIds?: string[];
  minimumVariant?: {
    title: string;
    estimatedMinutes: number | null;
    energyLevel: number | null;
  } | null;
};

type TaskFormFieldsProps = {
  mode: "quick-add" | "edit";
  options: TaskFormOptions;
  state: TaskActionState;
  initialValues?: TaskFormValues;
  pending: boolean;
  submitLabel: string;
};

function localDateTimeValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 text-sm text-rose-800" id={id} role="alert">
      {message}
    </p>
  );
}

export default function TaskFormFields({
  mode,
  options,
  state,
  initialValues,
  pending,
  submitLabel,
}: TaskFormFieldsProps) {
  const [dueAt, setDueAt] = useState(() => localDateTimeValue(initialValues?.dueAt));
  const [timezoneOffset, setTimezoneOffset] = useState("0");
  const idPrefix = mode === "quick-add" ? "quick-add" : "edit-task";
  const titleError = state.fieldErrors?.title;
  const energyScaleDescriptionId = `${idPrefix}-energy-scale-description`;

  useEffect(() => {
    setTimezoneOffset(String(new Date().getTimezoneOffset()));
    setDueAt(localDateTimeValue(initialValues?.dueAt));
  }, [initialValues?.dueAt]);

  return (
    <>
      {state.message && state.status !== "success" && (
        <p className="mb-4 rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm text-[var(--ink)]" role="alert">
          {state.message}
        </p>
      )}

      <fieldset className="space-y-5" disabled={pending}>
        <input name="timezoneOffsetMinutes" type="hidden" value={timezoneOffset} />
        <p className="sr-only" id={energyScaleDescriptionId}>
          Energy level on a five-level scale from 1 to 5.
        </p>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--ink)]" htmlFor={`${idPrefix}-title`}>
            {mode === "quick-add" ? "Task title" : "Title"}
          </label>
          <input
            aria-describedby={titleError ? `${idPrefix}-title-error` : undefined}
            aria-invalid={titleError ? "true" : undefined}
            autoComplete="off"
            autoFocus={mode === "quick-add"}
            className="min-h-12 w-full rounded-md border border-[var(--line)] bg-white px-3 text-base text-[var(--ink)] placeholder:text-[var(--muted)]"
            defaultValue={initialValues?.title ?? ""}
            id={`${idPrefix}-title`}
            maxLength={240}
            name="title"
            placeholder="What do you need to remember?"
            required
          />
          <FieldError id={`${idPrefix}-title-error`} message={titleError} />
        </div>

        <details className="rounded-md border border-[var(--line)] bg-white p-4" open={mode === "edit"}>
          <summary className="min-h-8 cursor-pointer py-1 text-sm font-semibold text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
            Add planning details
          </summary>
          <div className="mt-4 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-description`}>
                Description or notes
              </label>
              <textarea
                className="min-h-24 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-base"
                defaultValue={initialValues?.description ?? ""}
                id={`${idPrefix}-description`}
                name="description"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-due-at`}>
                  Due date and time
                </label>
                <input
                  className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3"
                  id={`${idPrefix}-due-at`}
                  name="dueAt"
                  onChange={(event) => setDueAt(event.currentTarget.value)}
                  type="datetime-local"
                  value={dueAt}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-estimated-minutes`}>
                  Estimated time (minutes)
                </label>
                <input
                  aria-describedby={state.fieldErrors?.estimatedMinutes ? `${idPrefix}-duration-error` : undefined}
                  aria-invalid={state.fieldErrors?.estimatedMinutes ? "true" : undefined}
                  className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3"
                  id={`${idPrefix}-estimated-minutes`}
                  min="0"
                  name="estimatedMinutes"
                  type="number"
                  defaultValue={initialValues?.estimatedMinutes ?? ""}
                />
                <FieldError id={`${idPrefix}-duration-error`} message={state.fieldErrors?.estimatedMinutes} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-energy-level`}>
                  Energy level
                </label>
                <select
                  aria-describedby={`${energyScaleDescriptionId}${state.fieldErrors?.energyLevel ? ` ${idPrefix}-energy-error` : ""}`}
                  aria-invalid={state.fieldErrors?.energyLevel ? "true" : undefined}
                  className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3"
                  defaultValue={initialValues?.energyLevel ?? ""}
                  id={`${idPrefix}-energy-level`}
                  name="energyLevel"
                >
                  <option value="">Not sure yet</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <FieldError id={`${idPrefix}-energy-error`} message={state.fieldErrors?.energyLevel} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-priority`}>
                  Priority
                </label>
                <select
                  className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3"
                  defaultValue={initialValues?.priority ?? ""}
                  id={`${idPrefix}-priority`}
                  name="priority"
                >
                  <option value="">No priority yet</option>
                  <option value="must_do">Must Do</option>
                  <option value="should_do">Should Do</option>
                  <option value="could_do">Could Do</option>
                  <option value="whenever">Whenever</option>
                </select>
              </div>
            </div>

            {options.energyTypes.length > 0 && (
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Energy types</legend>
                <div className="flex flex-wrap gap-2">
                  {options.energyTypes.map((energyType) => (
                    <label
                      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 text-sm"
                      key={energyType.id}
                    >
                      <input
                        defaultChecked={initialValues?.energyTypeIds?.includes(energyType.id)}
                        name="energyTypeIds"
                        type="checkbox"
                        value={energyType.id}
                      />
                      {energyType.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {options.categories.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-category`}>Category</label>
                <select className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues?.categoryId ?? ""} id={`${idPrefix}-category`} name="categoryId">
                  <option value="">No category</option>
                  {options.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            )}

            {options.projects.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-project`}>Project</label>
                <select className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues?.projectId ?? ""} id={`${idPrefix}-project`} name="projectId">
                  <option value="">No project</option>
                  {options.projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            )}

            {options.courses.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-course`}>Course</label>
                <select className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues?.courseId ?? ""} id={`${idPrefix}-course`} name="courseId">
                  <option value="">No course</option>
                  {options.courses.map((item) => <option key={item.id} value={item.id}>{item.code ? `${item.code} · ` : ""}{item.name}</option>)}
                </select>
              </div>
            )}

            <details className="rounded-md border border-[var(--line)] p-4" open={Boolean(initialValues?.minimumVariant)}>
              <summary className="min-h-8 cursor-pointer py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
                Add a minimum task variant
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-minimum-variant-title`}>Minimum version</label>
                  <input aria-describedby={state.fieldErrors?.minimumVariant ? `${idPrefix}-minimum-variant-error` : undefined} aria-invalid={state.fieldErrors?.minimumVariant ? "true" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues?.minimumVariant?.title ?? ""} id={`${idPrefix}-minimum-variant-title`} name="minimumVariantTitle" />
                  <FieldError id={`${idPrefix}-minimum-variant-error`} message={state.fieldErrors?.minimumVariant} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-minimum-variant-duration`}>Estimated minutes</label>
                  <input aria-invalid={state.fieldErrors?.minimumVariant ? "true" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues?.minimumVariant?.estimatedMinutes ?? ""} id={`${idPrefix}-minimum-variant-duration`} min="0" name="minimumVariantEstimatedMinutes" type="number" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor={`${idPrefix}-minimum-variant-energy`}>Energy level</label>
                  <select aria-describedby={energyScaleDescriptionId} aria-invalid={state.fieldErrors?.minimumVariant ? "true" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues?.minimumVariant?.energyLevel ?? ""} id={`${idPrefix}-minimum-variant-energy`} name="minimumVariantEnergyLevel">
                    <option value="">Not sure yet</option>
                    {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </div>
              </div>
            </details>
          </div>
        </details>
      </fieldset>

      <button
        className="mt-5 min-h-11 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </>
  );
}