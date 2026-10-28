import type { AcademicTaskType, TaskPriority } from "../../src/generated/prisma/enums";

const priorityPresentation: Record<TaskPriority, { label: string; className: string }> = {
  must_do: { label: "Must Do", className: "bg-pink-100 text-pink-900" },
  should_do: { label: "Should Do", className: "bg-orange-100 text-orange-900" },
  could_do: { label: "Could Do", className: "bg-yellow-100 text-yellow-900" },
  whenever: { label: "Whenever", className: "bg-violet-100 text-violet-900" },
};

export function formatPriority(priority: TaskPriority) {
  return priorityPresentation[priority].label;
}

export function formatAcademicTaskType(taskType: AcademicTaskType) {
  return taskType[0].toUpperCase() + taskType.slice(1);
}

export function formatCourseIdentity(code: string | null, name: string) {
  return code ? `${code}: ${name}` : name;
}

export function formatCourseCode(code: string | null, name: string) {
  return code ?? name;
}

export function PriorityPill({ priority }: { priority: TaskPriority }) {
  const presentation = priorityPresentation[priority];

  return (
    <span
      aria-label={`Priority: ${presentation.label}`}
      className={`inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-xs font-medium ${presentation.className}`}
    >
      {presentation.label}
    </span>
  );
}

export function MetadataPill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--muted)] ${className}`}>
      {children}
    </span>
  );
}