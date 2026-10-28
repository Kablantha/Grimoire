import type { ReactNode } from "react";
import { connection } from "next/server";
import AppShell from "../../components/app-shell";
import { ensureDevelopmentUser } from "../../src/lib/tasks/development-user";
import { getTaskFormOptions } from "../../src/lib/tasks/task-repository";
import { prisma } from "../../src/lib/prisma";

export default async function PlannerLayout({ children }: { children: ReactNode }) {
  await connection();
  const user = await ensureDevelopmentUser(prisma);
  const taskFormOptions = await getTaskFormOptions(prisma, user.id);

  return <AppShell taskFormOptions={taskFormOptions}>{children}</AppShell>;
}