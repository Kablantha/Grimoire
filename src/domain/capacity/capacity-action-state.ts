export type CapacityActionState = {
  status: "idle" | "invalid" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const INITIAL_CAPACITY_ACTION_STATE: CapacityActionState = {
  status: "idle",
};
