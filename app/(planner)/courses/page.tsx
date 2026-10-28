import Link from "next/link";
import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import { listCourses } from "../../../src/lib/courses/course-repository";
import { prisma } from "../../../src/lib/prisma";
import PlaceholderPage from "../../../components/placeholder-page";
import { formatCourseIdentity } from "../../../components/tasks/task-metadata";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string | string[] }>;
}) {
  const params = await searchParams;
  const archived = (Array.isArray(params.archived) ? params.archived[0] : params.archived) === "true";
  const user = await ensureDevelopmentUser(prisma);
  const courses = await listCourses(prisma, user.id, archived);

  return (
    <>
      <PlaceholderPage
        description="Keep course details and related academic tasks together. Ordinary tasks stay in the same list."
        title="Courses"
      />

      <div className="mt-7 flex flex-wrap gap-3">
        {!archived && (
          <Link className="inline-flex min-h-11 items-center rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white" href="/courses/new">
            Add course
          </Link>
        )}
        <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] bg-white px-4 text-sm font-medium" href="/courses/instructors">
          Manage instructors
        </Link>
      </div>

      <nav aria-label="Course status" className="mt-8 border-b border-[var(--line)]">
        <ul className="flex gap-2">
          <li><Link aria-current={!archived ? "page" : undefined} className={`inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium ${!archived ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)]"}`} href="/courses">Active</Link></li>
          <li><Link aria-current={archived ? "page" : undefined} className={`inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium ${archived ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)]"}`} href="/courses?archived=true">Archived</Link></li>
        </ul>
      </nav>

      {courses.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-[var(--line)] bg-white px-5 py-6 text-[var(--muted)]">
          {archived ? "Archived courses can be restored here." : "No courses yet. You can add one whenever it would help organize your tasks."}
        </p>
      ) : (
        <ul aria-label={archived ? "Archived courses" : "Active courses"} className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white">
          {courses.map((course) => (
            <li className="px-4 py-5 sm:px-5" key={course.id}>
              <h2 className="text-base font-semibold">
                <Link className="underline-offset-4 hover:underline" href={`/courses/${course.id}`}>
                  {formatCourseIdentity(course.code, course.name)}
                </Link>
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
                {course.term && <span>{course.term}</span>}
                {course.instructor && <span>Instructor: {course.instructor.name}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}