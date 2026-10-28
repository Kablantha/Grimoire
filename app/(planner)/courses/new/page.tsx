import PlaceholderPage from "../../../../components/placeholder-page";
import CourseForm from "../../../../components/courses/course-form";
import { ensureDevelopmentUser } from "../../../../src/lib/tasks/development-user";
import { listInstructors } from "../../../../src/lib/courses/course-repository";
import { prisma } from "../../../../src/lib/prisma";

export default async function NewCoursePage() {
  const user = await ensureDevelopmentUser(prisma);
  const instructors = await listInstructors(prisma, user.id);

  return (
    <>
      <PlaceholderPage description="Add the course details you know. You can leave the rest blank." title="Add course" />
      <div className="mt-8">
        <CourseForm
          initialValues={{
            name: "",
            code: null,
            term: null,
            startDate: null,
            endDate: null,
            lmsUrl: null,
            instructorId: null,
          }}
          instructors={instructors}
        />
      </div>
    </>
  );
}