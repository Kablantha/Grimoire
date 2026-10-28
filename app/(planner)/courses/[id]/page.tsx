import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderPage from "../../../../components/placeholder-page";
import { archiveCourseAction, restoreCourseAction } from "../actions";
import { getCourse } from "../../../../src/lib/courses/course-repository";
import { ensureDevelopmentUser } from "../../../../src/lib/tasks/development-user";
import { prisma } from "../../../../src/lib/prisma";
import { formatAcademicTaskType, formatCourseIdentity, MetadataPill } from "../../../../components/tasks/task-metadata";

function formatCourseDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await ensureDevelopmentUser(prisma);
  const course = await getCourse(prisma, user.id, id);
  if (!course) notFound();

  return (
    <>
      <Link className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href={`/courses${course.archivedAt ? "?archived=true" : ""}`}>
        Back to courses
      </Link>
      <div className="mt-7">
        <PlaceholderPage
          description={course.archivedAt ? "Archived course" : course.term ?? "Course details"}
          title={formatCourseIdentity(course.code, course.name)}
        />
      </div>

      <section aria-labelledby="course-information-heading" className="mt-8 border-t border-[var(--line)] pt-6">
        <h2 className="text-lg font-semibold" id="course-information-heading">Course information</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {course.code && <div><dt className="text-xs text-[var(--muted)]">Course prefix and number</dt><dd className="mt-1">{course.code}</dd></div>}
          {course.term && <div><dt className="text-xs text-[var(--muted)]">Term</dt><dd className="mt-1">{course.term}</dd></div>}
          {course.startDate && <div><dt className="text-xs text-[var(--muted)]">Starts</dt><dd className="mt-1">{formatCourseDate(course.startDate)}</dd></div>}
          {course.endDate && <div><dt className="text-xs text-[var(--muted)]">Ends</dt><dd className="mt-1">{formatCourseDate(course.endDate)}</dd></div>}
          {course.lmsUrl && <div><dt className="text-xs text-[var(--muted)]">LMS</dt><dd className="mt-1"><a className="text-[var(--accent)] underline underline-offset-2" href={course.lmsUrl} rel="noreferrer" target="_blank">Open course site</a></dd></div>}
        </dl>
      </section>

      {course.instructor && (
        <section aria-labelledby="course-instructor-heading" className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-lg font-semibold" id="course-instructor-heading">Instructor Information</h2>
          <p className="mt-3 font-medium">{course.instructor.name}</p>
          {course.instructor.email && <p className="mt-1"><a className="text-[var(--accent)] underline underline-offset-2" href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a></p>}
          {course.instructor.officeHours && <p className="mt-2 text-sm text-[var(--muted)]">Office hours: {course.instructor.officeHours}</p>}
          {course.instructor.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">{course.instructor.notes}</p>}
          <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href={`/courses/instructors/${course.instructor.id}/edit`}>Edit instructor</Link>
        </section>
      )}

      <section aria-labelledby="course-tasks-heading" className="mt-8 border-t border-[var(--line)] pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold" id="course-tasks-heading">Tasks in this course</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Coursework stays together with the rest of your tasks.</p>
          </div>
          <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] bg-white px-3 text-sm font-medium" href={`/tasks?courseId=${course.id}`}>View in Tasks</Link>
        </div>

        {course.tasks.length === 0 ? (
          <p className="mt-4 rounded-md border border-dashed border-[var(--line)] bg-white px-4 py-5 text-sm text-[var(--muted)]">
            No tasks are linked yet. Add a task and choose this course in its planning details.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white">
            {course.tasks.map((task) => (
              <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-4" key={task.id}>
                <Link className="min-h-11 inline-flex items-center font-medium text-[var(--accent)] underline-offset-4 hover:underline" href={`/tasks/${task.id}`}>{task.title}</Link>
                <span className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                  {task.academicTaskType ? <MetadataPill>{formatAcademicTaskType(task.academicTaskType)}</MetadataPill> : <MetadataPill>Task</MetadataPill>}
                  {task.status !== "active" && <MetadataPill>{task.status}</MetadataPill>}
                  {task.dueAt && <span>Due {formatCourseDate(task.dueAt)}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--line)] pt-6">
        {!course.archivedAt && <Link className="inline-flex min-h-11 items-center rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white" href={`/courses/${course.id}/edit`}>Edit course</Link>}
        {course.archivedAt ? (
          <form action={restoreCourseAction}><input name="courseId" type="hidden" value={course.id} /><button className="min-h-11 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium" type="submit">Restore course</button></form>
        ) : (
          <form action={archiveCourseAction}><input name="courseId" type="hidden" value={course.id} /><button className="min-h-11 rounded-md px-4 text-sm font-medium text-[var(--muted)]" type="submit">Archive course</button></form>
        )}
      </div>
    </>
  );
}