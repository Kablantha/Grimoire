import { notFound } from "next/navigation";
import CourseForm from "../../../../../components/courses/course-form";
import PlaceholderPage from "../../../../../components/placeholder-page";
import { getCourse, listInstructors } from "../../../../../src/lib/courses/course-repository";
import { ensureDevelopmentUser } from "../../../../../src/lib/tasks/development-user";
import { prisma } from "../../../../../src/lib/prisma";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await ensureDevelopmentUser(prisma);
  const [course, instructors] = await Promise.all([
    getCourse(prisma, user.id, id),
    listInstructors(prisma, user.id),
  ]);
  if (!course) notFound();

  return (
    <>
      <PlaceholderPage description="Update course information without changing its related tasks." title="Edit course" />
      <div className="mt-8">
        <CourseForm
          courseId={course.id}
          initialValues={{
            name: course.name,
            code: course.code,
            term: course.term,
            startDate: course.startDate,
            endDate: course.endDate,
            lmsUrl: course.lmsUrl,
            instructorId: course.instructorId,
          }}
          instructors={instructors}
        />
      </div>
    </>
  );
}