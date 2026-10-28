import Link from "next/link";
import PlaceholderPage from "../../../../components/placeholder-page";
import InstructorForm from "../../../../components/courses/instructor-form";
import { listInstructors } from "../../../../src/lib/courses/course-repository";
import { ensureDevelopmentUser } from "../../../../src/lib/tasks/development-user";
import { prisma } from "../../../../src/lib/prisma";

export default async function InstructorsPage() {
  const user = await ensureDevelopmentUser(prisma);
  const instructors = await listInstructors(prisma, user.id);

  return (
    <>
      <Link className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline" href="/courses">Back to courses</Link>
      <div className="mt-7">
        <PlaceholderPage description="Keep instructor details available for the courses they support." title="Instructors" />
      </div>

      <section aria-labelledby="add-instructor-heading" className="mt-8 border-t border-[var(--line)] pt-6">
        <h2 className="mb-5 text-lg font-semibold" id="add-instructor-heading">Add instructor</h2>
        <InstructorForm />
      </section>

      <section aria-labelledby="instructor-list-heading" className="mt-10 border-t border-[var(--line)] pt-6">
        <h2 className="text-lg font-semibold" id="instructor-list-heading">Saved instructors</h2>
        {instructors.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Instructors are optional. You can add one whenever it helps.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white">
            {instructors.map((instructor) => (
              <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-4" key={instructor.id}>
                <div>
                  <h3 className="font-medium">{instructor.name}</h3>
                  {instructor.email && <a className="mt-1 inline-flex min-h-11 items-center text-sm text-[var(--accent)] underline underline-offset-2" href={`mailto:${instructor.email}`}>{instructor.email}</a>}
                </div>
                <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--line)] px-3 text-sm font-medium" href={`/courses/instructors/${instructor.id}/edit`}>Edit instructor</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}