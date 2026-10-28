import { notFound } from "next/navigation";
import InstructorForm from "../../../../../../components/courses/instructor-form";
import PlaceholderPage from "../../../../../../components/placeholder-page";
import { getInstructor } from "../../../../../../src/lib/courses/course-repository";
import { ensureDevelopmentUser } from "../../../../../../src/lib/tasks/development-user";
import { prisma } from "../../../../../../src/lib/prisma";

export default async function EditInstructorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await ensureDevelopmentUser(prisma);
  const instructor = await getInstructor(prisma, user.id, id);
  if (!instructor) notFound();

  return (
    <>
      <PlaceholderPage description="Update instructor contact information." title="Edit instructor" />
      <div className="mt-8">
        <InstructorForm instructor={instructor} />
      </div>
    </>
  );
}