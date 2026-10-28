export type CourseActionState = {
  status: "idle" | "invalid" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  recordId?: string;
};

export const INITIAL_COURSE_ACTION_STATE: CourseActionState = {
  status: "idle",
};