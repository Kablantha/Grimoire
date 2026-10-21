// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  AcademicTaskType,
  TaskDependencyType,
  TaskPriority,
  TaskStatus,
  TaskVariantType,
} from "../src/generated/prisma/enums";
import { DEFAULT_ENERGY_TYPES } from "../src/domain/energy/default-energy-types";

describe("Prisma domain enums", () => {
  it("keeps task status values simple and excludes overdue", () => {
    expect(Object.values(TaskStatus)).toEqual(["active", "completed", "archived"]);
  });

  it("provides the documented priorities", () => {
    expect(Object.values(TaskPriority)).toEqual([
      "must_do",
      "should_do",
      "could_do",
      "whenever",
    ]);
  });

  it("provides hard and soft dependency types", () => {
    expect(Object.values(TaskDependencyType)).toEqual(["hard", "soft"]);
  });

  it("provides the documented academic task types", () => {
    expect(Object.values(AcademicTaskType)).toEqual([
      "reading",
      "assignment",
      "discussion",
      "quiz",
      "exam",
      "project",
      "study",
      "other",
    ]);
  });

  it("supports minimum task variants", () => {
    expect(Object.values(TaskVariantType)).toEqual(["minimum"]);
  });

  it("provides seed-ready default energy type names without restricting custom types", () => {
    expect(DEFAULT_ENERGY_TYPES.map(({ name }) => name)).toEqual([
      "Mental",
      "Social",
      "Physical",
      "Creative",
      "Routine",
    ]);
  });
});