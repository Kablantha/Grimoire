import { CAPACITY_SCALE_MAX, CAPACITY_SCALE_MIN } from "../../src/domain/capacity/day-key";

/**
 * Presentation-only labels for capacity values. These are deliberately
 * separate from the underlying 1-5 model so future terminology layers
 * (Spoons, Spell Slots, Battery) can map onto the same values without
 * changing behavior.
 */
export function formatCapacityValue(level: number): string {
  return `${level} of ${CAPACITY_SCALE_MAX}`;
}

export function capacityValueDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: "Very low",
    2: "Low",
    3: "Moderate",
    4: "Good",
    5: "High",
  };
  return descriptions[level] ?? "";
}

export function capacityScaleHint(): string {
  return `${CAPACITY_SCALE_MIN} is very little capacity, ${CAPACITY_SCALE_MAX} is quite a bit.`;
}

export type CapacityEntryView = {
  energyTypeId: string;
  name: string;
  level: number;
};
