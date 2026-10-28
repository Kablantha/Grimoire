import type { PrismaClient } from "../../generated/prisma/client";
import type { TaskDependencyType } from "../../generated/prisma/enums";
import { assertCanAddDependency, type DependencyEdge } from "../../domain/scheduler/dependency-graph";

export class DependencyTaskError extends Error {
  constructor() {
    super("One of those tasks is no longer available.");
    this.name = "DependencyTaskError";
  }
}

async function listEdges(client: PrismaClient, userId: string): Promise<DependencyEdge[]> {
  const links = await client.taskDependency.findMany({
    where: { dependentTask: { userId }, prerequisiteTask: { userId } },
    select: { prerequisiteTaskId: true, dependentTaskId: true, type: true },
  });
  return links;
}

/**
 * Adds a hard or soft dependency: `prerequisiteTaskId` must be completed
 * before `dependentTaskId`. Validates ownership and rejects self-dependencies,
 * duplicates, and any cycle (direct or indirect) via the domain graph rules.
 */
export async function addDependency(
  client: PrismaClient,
  userId: string,
  prerequisiteTaskId: string,
  dependentTaskId: string,
  type: TaskDependencyType,
) {
  const tasks = await client.task.findMany({
    where: { userId, id: { in: [prerequisiteTaskId, dependentTaskId] } },
    select: { id: true },
  });
  if (tasks.length !== 2) throw new DependencyTaskError();

  const edges = await listEdges(client, userId);
  assertCanAddDependency(edges, prerequisiteTaskId, dependentTaskId);

  return client.taskDependency.create({
    data: { prerequisiteTaskId, dependentTaskId, type },
  });
}

export async function removeDependency(
  client: PrismaClient,
  userId: string,
  prerequisiteTaskId: string,
  dependentTaskId: string,
): Promise<boolean> {
  const result = await client.taskDependency.deleteMany({
    where: {
      prerequisiteTaskId,
      dependentTaskId,
      dependentTask: { userId },
      prerequisiteTask: { userId },
    },
  });
  return result.count > 0;
}
