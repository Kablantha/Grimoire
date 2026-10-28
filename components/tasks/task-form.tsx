"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_TASK_ACTION_STATE } from "../../src/domain/task/task-action-state";
import type { TaskFormOptions } from "../../src/lib/tasks/task-repository";
import type { TaskFormValues } from "./task-form-fields";
import { updateTaskAction } from "../../app/(planner)/tasks/actions";
import TaskFormFields from "./task-form-fields";

export default function TaskForm({
  taskId,
  initialValues,
  options,
}: {
  taskId: string;
  initialValues: TaskFormValues;
  options: TaskFormOptions;
}) {
  const router = useRouter();
  const updateForTask = updateTaskAction.bind(null, taskId);
  const [state, formAction, pending] = useActionState(
    updateForTask,
    INITIAL_TASK_ACTION_STATE,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/tasks/${taskId}`);
      router.refresh();
    }
  }, [router, state.status, taskId]);

  return (
    <form action={formAction}>
      <TaskFormFields
        initialValues={initialValues}
        mode="edit"
        options={options}
        pending={pending}
        state={state}
        submitLabel="Save changes"
      />
    </form>
  );
}