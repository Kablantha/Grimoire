"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_CAPACITY_ACTION_STATE } from "../../src/domain/capacity/capacity-action-state";
import { saveDailyCapacityAction } from "../../app/(planner)/today/actions";
import { capacityScaleHint } from "./capacity-presentation";

export type CapacityFormEnergyType = {
  id: string;
  name: string;
  level: number | null;
};

const SCALE = [1, 2, 3, 4, 5] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-rose-800" id={id} role="alert">
      {message}
    </p>
  );
}

export default function CapacityForm({
  date,
  energyTypes,
  notes,
}: {
  date: string;
  energyTypes: CapacityFormEnergyType[];
  notes: string | null;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveDailyCapacityAction,
    INITIAL_CAPACITY_ACTION_STATE,
  );

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [router, state.status]);

  return (
    <form action={formAction}>
      <fieldset className="space-y-6" disabled={pending}>
        <input name="date" type="hidden" value={date} />

        {state.message && state.status !== "success" && (
          <p className="rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm" role="alert">
            {state.message}
          </p>
        )}
        <FieldError id="capacity-form-error" message={state.fieldErrors?.capacities} />

        <div className="space-y-5">
          {energyTypes.map((type) => {
            const groupName = `capacity-${type.id}`;
            return (
              <fieldset key={type.id}>
                <legend className="text-sm font-medium text-[var(--ink)]">{type.name}</legend>
                <p className="mt-1 text-xs text-[var(--muted)]" id={`${groupName}-hint`}>
                  {capacityScaleHint()}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SCALE.map((value) => {
                    const inputId = `${groupName}-${value}`;
                    return (
                      <label
                        className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-[var(--line)] bg-white px-3 text-sm font-medium text-[var(--muted)] transition-colors has-checked:border-[var(--accent)] has-checked:bg-[var(--accent-soft)] has-checked:text-[var(--accent)] hover:bg-[var(--canvas)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--focus)]"
                        htmlFor={inputId}
                        key={value}
                      >
                        <input
                          className="sr-only"
                          defaultChecked={type.level === value}
                          id={inputId}
                          name={groupName}
                          type="radio"
                          value={value}
                        />
                        {value}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="capacity-notes">
            Anything worth noting about today? <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <textarea
            aria-describedby={state.fieldErrors?.notes ? "capacity-notes-error" : "capacity-notes-hint"}
            aria-invalid={state.fieldErrors?.notes ? "true" : undefined}
            className="min-h-24 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-base"
            defaultValue={notes ?? ""}
            id="capacity-notes"
            name="notes"
            rows={3}
          />
          <p className="mt-1 text-xs text-[var(--muted)]" id="capacity-notes-hint">
            For example: bad sleep, a long shift, or feeling socially drained.
          </p>
          <FieldError id="capacity-notes-error" message={state.fieldErrors?.notes} />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="min-h-11 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:opacity-70"
            disabled={pending}
            type="submit"
          >
            {pending ? "Saving…" : "Save today's capacity"}
          </button>
          {state.status === "success" && (
            <p className="text-sm text-[var(--muted)]" role="status">
              {state.message}
            </p>
          )}
        </div>
      </fieldset>
    </form>
  );
}
