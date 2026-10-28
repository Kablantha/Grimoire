"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_COURSE_ACTION_STATE } from "../../src/domain/course/course-action-state";
import type { CourseActionState } from "../../src/domain/course/course-action-state";
import type { InstructorRecord } from "../../src/lib/courses/course-repository";
import { createInstructorAction, updateInstructorAction } from "../../app/(planner)/courses/actions";

function InstructorFields({
  state,
  initialValues,
  pending,
}: {
  state: CourseActionState;
  initialValues: Pick<InstructorRecord, "name" | "email" | "officeHours" | "notes">;
  pending: boolean;
}) {
  const errors = state.fieldErrors ?? {};
  return (
    <fieldset className="space-y-4" disabled={pending}>
      {state.message && state.status !== "success" && <p className="text-sm" role="alert">{state.message}</p>}
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="instructor-name">Name</label>
        <input aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "instructor-name-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.name} id="instructor-name" name="name" required />
        {errors.name && <p className="mt-1 text-sm text-rose-800" id="instructor-name-error" role="alert">{errors.name}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="instructor-email">Email</label>
        <input aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "instructor-email-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.email ?? ""} id="instructor-email" name="email" type="email" />
        {errors.email && <p className="mt-1 text-sm text-rose-800" id="instructor-email-error" role="alert">{errors.email}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="instructor-office-hours">Office hours</label>
        <textarea className="min-h-20 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2" defaultValue={initialValues.officeHours ?? ""} id="instructor-office-hours" name="officeHours" rows={2} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="instructor-notes">Notes</label>
        <textarea className="min-h-20 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2" defaultValue={initialValues.notes ?? ""} id="instructor-notes" name="notes" rows={3} />
      </div>
    </fieldset>
  );
}

export default function InstructorForm({
  instructor,
}: {
  instructor?: InstructorRecord;
}) {
  const router = useRouter();
  const action = instructor
    ? updateInstructorAction.bind(null, instructor.id)
    : createInstructorAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_COURSE_ACTION_STATE);

  useEffect(() => {
    if (state.status === "success") {
      router.push("/courses/instructors");
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="max-w-xl">
      <InstructorFields
        initialValues={instructor ?? { name: "", email: null, officeHours: null, notes: null }}
        pending={pending}
        state={state}
      />
      <button className="mt-5 min-h-11 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:opacity-70" disabled={pending} type="submit">
        {pending ? "Saving…" : instructor ? "Save instructor" : "Add instructor"}
      </button>
    </form>
  );
}