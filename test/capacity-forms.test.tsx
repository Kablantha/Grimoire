// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CapacityCard from "../components/capacity/capacity-card";
import CapacityForm from "../components/capacity/capacity-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("../app/(planner)/today/actions", () => ({
  saveDailyCapacityAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

const ENERGY_TYPES = [
  { id: "00000000-0000-4000-8000-0000000000a1", name: "Mental", level: null },
  { id: "00000000-0000-4000-8000-0000000000b2", name: "Social", level: null },
  { id: "00000000-0000-4000-8000-0000000000c3", name: "Physical", level: 4 },
];

describe("capacity form accessibility", () => {
  it("exposes a labeled 1-5 radio group for each energy type", () => {
    render(<CapacityForm date="2026-10-28" energyTypes={ENERGY_TYPES} notes={null} />);

    for (const type of ENERGY_TYPES) {
      const group = screen.getByRole("group", { name: type.name });
      for (const value of [1, 2, 3, 4, 5]) {
        expect(within(group).getByRole("radio", { name: String(value) })).toBeTruthy();
      }
    }
  });

  it("labels the optional notes field and submit action", () => {
    render(<CapacityForm date="2026-10-28" energyTypes={ENERGY_TYPES} notes={null} />);

    expect(screen.getByLabelText(/Anything worth noting about today/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save today's capacity" })).toBeTruthy();
  });

  it("reflects existing levels as preselected", () => {
    render(<CapacityForm date="2026-10-28" energyTypes={ENERGY_TYPES} notes="Bad sleep." />);

    const physical = screen.getByRole("group", { name: "Physical" });
    expect((within(physical).getByRole("radio", { name: "4" }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByDisplayValue("Bad sleep.")).toBeTruthy();
  });
});

describe("capacity card display", () => {
  it("shows each type with a textual capacity value, not color alone", () => {
    render(
      <CapacityCard
        entries={[
          { energyTypeId: "a", name: "Mental", level: 2 },
          { energyTypeId: "b", name: "Physical", level: 4 },
        ]}
      />,
    );

    const list = screen.getByRole("list", { name: "Current capacity by energy type" });
    expect(within(list).getByText("Mental")).toBeTruthy();
    expect(within(list).getByText("2 of 5")).toBeTruthy();
    expect(within(list).getByText("Physical")).toBeTruthy();
    expect(within(list).getByText("4 of 5")).toBeTruthy();
  });

  it("renders nothing when there are no entries", () => {
    const { container } = render(<CapacityCard entries={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
