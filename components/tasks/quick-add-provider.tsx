"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { INITIAL_TASK_ACTION_STATE } from "../../src/domain/task/task-action-state";
import type { TaskFormOptions } from "../../src/lib/tasks/task-repository";
import { createTaskAction } from "../../app/(planner)/tasks/actions";
import TaskFormFields from "./task-form-fields";

type QuickAddContextValue = {
  openQuickAdd: (trigger: HTMLElement) => void;
};

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

export function useQuickAdd() {
  const value = useContext(QuickAddContext);
  if (!value) throw new Error("useQuickAdd must be used inside QuickAddProvider.");
  return value;
}

export default function QuickAddProvider({
  children,
  options,
}: {
  children: ReactNode;
  options: TaskFormOptions;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openQuickAdd = useCallback((trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <QuickAddContext.Provider value={{ openQuickAdd }}>
      {children}
      <QuickAddDialog
        closeDialog={closeDialog}
        dialogRef={dialogRef}
        options={options}
      />
    </QuickAddContext.Provider>
  );
}

function QuickAddDialog({
  closeDialog,
  dialogRef,
  options,
}: {
  closeDialog: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  options: TaskFormOptions;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createTaskAction,
    INITIAL_TASK_ACTION_STATE,
  );

  useEffect(() => {
    if (state.status === "success") {
      closeDialog();
      router.push("/tasks");
      router.refresh();
    }
  }, [closeDialog, router, state.status]);

  return (
    <dialog
      aria-labelledby="quick-add-dialog-title"
      aria-describedby="quick-add-dialog-description"
      className="m-auto w-[min(44rem,calc(100%-2rem))] rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-0 text-[var(--ink)] shadow-2xl backdrop:bg-black/40"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeDialog();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={closeDialog}
      ref={dialogRef}
    >
      <div className="max-h-[min(90dvh,48rem)] overflow-y-auto p-5 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold" id="quick-add-dialog-title">
              What do you need to remember?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]" id="quick-add-dialog-description">
              A title is enough. You can add planning details now or later.
            </p>
          </div>
          <button
            aria-label="Close Quick Add"
            className="min-h-11 min-w-11 rounded-md border border-[var(--line)] bg-white px-3 text-sm"
            onClick={closeDialog}
            type="button"
          >
            Close
          </button>
        </div>

        <form action={formAction}>
          <TaskFormFields
            mode="quick-add"
            options={options}
            pending={pending}
            state={state}
            submitLabel="Add task"
          />
        </form>
      </div>
    </dialog>
  );
}