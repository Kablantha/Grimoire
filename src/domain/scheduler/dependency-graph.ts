import type { TaskDependencyType } from "../../generated/prisma/enums";

/**
 * A single directed edge: `prerequisiteTaskId` must be completed before
 * `dependentTaskId`. Plain data so dependency logic stays deterministic and
 * testable without a database.
 */
export type DependencyEdge = {
  prerequisiteTaskId: string;
  dependentTaskId: string;
  type: TaskDependencyType;
};

export class CircularDependencyError extends Error {
  constructor() {
    super("That would create a loop where each task is waiting for another one to finish first.");
    this.name = "CircularDependencyError";
  }
}

export class DuplicateDependencyError extends Error {
  constructor() {
    super("That dependency already exists.");
    this.name = "DuplicateDependencyError";
  }
}

export class SelfDependencyError extends Error {
  constructor() {
    super("A task can't depend on itself.");
    this.name = "SelfDependencyError";
  }
}

/**
 * Returns true when `startId` can reach `targetId` by following prerequisite
 * -> dependent edges. Used to detect whether adding an edge would close a
 * cycle.
 */
function canReach(
  edges: DependencyEdge[],
  startId: string,
  targetId: string,
): boolean {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.prerequisiteTaskId) ?? [];
    list.push(edge.dependentTaskId);
    adjacency.set(edge.prerequisiteTaskId, list);
  }

  const visited = new Set<string>();
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.pop()!;
    if (current === targetId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const next of adjacency.get(current) ?? []) queue.push(next);
  }
  return false;
}

/**
 * Validates that a new dependency edge may be added to the existing graph.
 * Throws a domain error describing why the edge is not allowed. The graph is
 * the full set of existing edges for the user.
 *
 * A new edge prerequisite -> dependent is invalid when `dependent` can already
 * reach `prerequisite`, because that would close a cycle (A -> B -> A, or
 * A -> B -> C -> A, and so on).
 */
export function assertCanAddDependency(
  edges: DependencyEdge[],
  prerequisiteTaskId: string,
  dependentTaskId: string,
): void {
  if (prerequisiteTaskId === dependentTaskId) {
    throw new SelfDependencyError();
  }

  const exists = edges.some(
    (edge) =>
      edge.prerequisiteTaskId === prerequisiteTaskId &&
      edge.dependentTaskId === dependentTaskId,
  );
  if (exists) throw new DuplicateDependencyError();

  if (canReach(edges, dependentTaskId, prerequisiteTaskId)) {
    throw new CircularDependencyError();
  }
}
