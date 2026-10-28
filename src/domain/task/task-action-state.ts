export type TaskActionState = {
  status: "idle" | "invalid" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  taskId?: string;
};

export const INITIAL_TASK_ACTION_STATE: TaskActionState = {
  status: "idle",
};