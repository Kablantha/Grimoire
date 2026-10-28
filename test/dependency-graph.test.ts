import { describe, expect, it } from "vitest";
import {
  assertCanAddDependency,
  CircularDependencyError,
  DuplicateDependencyError,
  SelfDependencyError,
  type DependencyEdge,
} from "../src/domain/scheduler/dependency-graph";

function edge(prerequisiteTaskId: string, dependentTaskId: string): DependencyEdge {
  return { prerequisiteTaskId, dependentTaskId, type: "hard" };
}

describe("dependency graph validation", () => {
  it("allows a simple dependency", () => {
    expect(() => assertCanAddDependency([], "A", "B")).not.toThrow();
  });

  it("rejects a task depending on itself", () => {
    expect(() => assertCanAddDependency([], "A", "A")).toThrow(SelfDependencyError);
  });

  it("rejects a duplicate dependency", () => {
    expect(() => assertCanAddDependency([edge("A", "B")], "A", "B")).toThrow(DuplicateDependencyError);
  });

  it("rejects a direct two-task cycle (A -> B -> A)", () => {
    expect(() => assertCanAddDependency([edge("A", "B")], "B", "A")).toThrow(CircularDependencyError);
  });

  it("rejects an indirect cycle (A -> B -> C -> A)", () => {
    const edges = [edge("A", "B"), edge("B", "C")];
    expect(() => assertCanAddDependency(edges, "C", "A")).toThrow(CircularDependencyError);
  });

  it("rejects a longer indirect cycle (A -> B -> C -> D -> A)", () => {
    const edges = [edge("A", "B"), edge("B", "C"), edge("C", "D")];
    expect(() => assertCanAddDependency(edges, "D", "A")).toThrow(CircularDependencyError);
  });

  it("allows a dependency that shares a prerequisite without forming a cycle", () => {
    // A -> B and A -> C: adding C -> B is fine.
    const edges = [edge("A", "B"), edge("A", "C")];
    expect(() => assertCanAddDependency(edges, "C", "B")).not.toThrow();
  });

  it("allows a diamond-shaped graph", () => {
    // A -> B, A -> C, B -> D, C -> D is a valid DAG.
    const edges = [edge("A", "B"), edge("A", "C"), edge("B", "D")];
    expect(() => assertCanAddDependency(edges, "C", "D")).not.toThrow();
  });

  it("allows a long acyclic chain", () => {
    const edges = [edge("A", "B"), edge("B", "C"), edge("C", "D")];
    expect(() => assertCanAddDependency(edges, "D", "E")).not.toThrow();
  });

  it("uses the calm loop message for cycles", () => {
    try {
      assertCanAddDependency([edge("A", "B")], "B", "A");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(CircularDependencyError);
      expect((error as Error).message).toBe(
        "That would create a loop where each task is waiting for another one to finish first.",
      );
    }
  });
});
