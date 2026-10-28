import { formatCapacityValue } from "./capacity-presentation";

export type CapacityCardEntry = {
  energyTypeId: string;
  name: string;
  level: number;
};

export default function CapacityCard({
  entries,
}: {
  entries: CapacityCardEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <ul className="space-y-3" aria-label="Current capacity by energy type">
      {entries.map((entry) => (
        <li
          className="flex items-center justify-between gap-4 rounded-md border border-[var(--line)] bg-white px-4 py-3"
          key={entry.energyTypeId}
        >
          <span className="text-sm font-medium text-[var(--ink)]">{entry.name}</span>
          <span className="flex items-center gap-3">
            <span aria-hidden className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  className={`h-2.5 w-2.5 rounded-full ${value <= entry.level ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`}
                  key={value}
                />
              ))}
            </span>
            <span className="text-sm text-[var(--muted)]">
              <span className="sr-only">{entry.name}: </span>
              {formatCapacityValue(entry.level)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
