"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_COURSE_ACTION_STATE } from "../../src/domain/course/course-action-state";
import type { CourseActionState } from "../../src/domain/course/course-action-state";
import type { InstructorRecord } from "../../src/lib/courses/course-repository";
import { createCourseAction, updateCourseAction } from "../../app/(planner)/courses/actions";

export type CourseFormValues = {
  name: string;
  code: string | null;
  term: string | null;
  startDate: Date | null;
  endDate: Date | null;
  lmsUrl: string | null;
  instructorId: string | null;
};

function dateValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-rose-800" id={id} role="alert">{message}</p>;
}

function CourseFields({
  state,
  initialValues,
  instructors,
  pending,
}: {
  state: CourseActionState;
  initialValues: CourseFormValues;
  instructors: InstructorRecord[];
  pending: boolean;
}) {
  const errors = state.fieldErrors ?? {};

  return (
    <fieldset className="space-y-5" disabled={pending}>
      {state.message && state.status !== "success" && (
        <p className="rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm" role="alert">{state.message}</p>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-name">Course name</label>
        <input aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "course-name-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.name} id="course-name" name="name" required />
        <ErrorMessage id="course-name-error" message={errors.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="course-code">Course prefix and number</label>
          <input aria-invalid={errors.code ? "true" : undefined} aria-describedby={errors.code ? "course-code-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.code ?? ""} id="course-code" name="code" placeholder="TCID 302" />
          <ErrorMessage id="course-code-error" message={errors.code} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="course-term">Term</label>
          <input className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.term ?? ""} id="course-term" name="term" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="course-start-date">Start date</label>
          <input aria-describedby={errors.startDate ? "course-date-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={dateValue(initialValues.startDate)} id="course-start-date" name="startDate" type="date" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="course-end-date">End date</label>
          <input aria-invalid={errors.endDate ? "true" : undefined} aria-describedby={errors.endDate ? "course-date-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={dateValue(initialValues.endDate)} id="course-end-date" name="endDate" type="date" />
          <ErrorMessage id="course-date-error" message={errors.endDate ?? errors.startDate} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-lms-url">LMS link</label>
        <input aria-invalid={errors.lmsUrl ? "true" : undefined} aria-describedby={errors.lmsUrl ? "course-lms-error" : undefined} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.lmsUrl ?? ""} id="course-lms-url" name="lmsUrl" type="url" />
        <ErrorMessage id="course-lms-error" message={errors.lmsUrl} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-instructor">Instructor</label>
        <select className="min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3" defaultValue={initialValues.instructorId ?? ""} id="course-instructor" name="instructorId">
          <option value="">No instructor</option>
          {instructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}
        </select>
        <Link className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href="/courses/instructors">
          Manage instructors
        </Link>
      </div>
    </fieldset>
  );
}

export default function CourseForm({
  courseId,
  initialValues,
  instructors,
}: {
  courseId?: string;
  initialValues: CourseFormValues;
  instructors: InstructorRecord[];
}) {
  const router = useRouter();
  const action = courseId ? updateCourseAction.bind(null, courseId) : createCourseAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_COURSE_ACTION_STATE);

  useEffect(() => {
    if (state.status === "success" && state.recordId) {
      router.push(`/courses/${state.recordId}`);
      router.refresh();
    }
  }, [router, state.recordId, state.status]);

  return (
    <form action={formAction} className="max-w-2xl">
      <CourseFields initialValues={initialValues} instructors={instructors} pending={pending} state={state} />
      <button className="mt-5 min-h-11 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:opacity-70" disabled={pending} type="submit">
        {pending ? "Saving…" : courseId ? "Save course" : "Add course"}
      </button>
    </form>
  );
}