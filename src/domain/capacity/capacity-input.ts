import { z } from "zod";
import { CAPACITY_SCALE_MAX, CAPACITY_SCALE_MIN, isValidDayString } from "./day-key";

const capacityValue = z
  .number()
  .int("Capacity is a whole number.")
  .min(CAPACITY_SCALE_MIN, `Capacity is between ${CAPACITY_SCALE_MIN} and ${CAPACITY_SCALE_MAX}.`)
  .max(CAPACITY_SCALE_MAX, `Capacity is between ${CAPACITY_SCALE_MIN} and ${CAPACITY_SCALE_MAX}.`);

export const CapacityEntriesSchema = z
  .record(z.string().uuid("Select a valid energy type."), capacityValue)
  .refine((entries) => Object.keys(entries).length > 0, {
    message: "Share a capacity level for at least one energy type.",
  });

export const DailyCapacityInputSchema = z.object({
  date: z.string().refine(isValidDayString, "Enter a valid day."),
  notes: z
    .string()
    .trim()
    .max(2000, "Keep the note under 2000 characters.")
    .transform((value) => value || null)
    .nullable()
    .optional(),
  capacities: CapacityEntriesSchema,
});

export type DailyCapacityInput = z.infer<typeof DailyCapacityInputSchema>;
export type CapacityEntries = z.infer<typeof CapacityEntriesSchema>;
