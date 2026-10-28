import { ensureDevelopmentUser } from "../../../src/lib/tasks/development-user";
import { getDailyCapacity, listDailyCapacities } from "../../../src/lib/capacity/capacity-repository";
import { prisma } from "../../../src/lib/prisma";
import { formatDayLabel, todayDayString } from "../../../src/domain/capacity/day-key";
import CapacityCard from "../../../components/capacity/capacity-card";
import CapacityForm from "../../../components/capacity/capacity-form";
import PlaceholderPage from "../../../components/placeholder-page";

export default async function TodayPage() {
  const user = await ensureDevelopmentUser(prisma);
  const timezone = user.timezone || "UTC";
  const today = todayDayString(timezone);

  const [energyTypes, todayRecord, recent] = await Promise.all([
    prisma.energyType.findMany({
      where: { userId: user.id, enabled: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, sortOrder: true },
    }),
    getDailyCapacity(prisma, user.id, today),
    listDailyCapacities(prisma, user.id, 7),
  ]);

  const todayLevels = new Map(
    (todayRecord?.energyTypes ?? []).map((entry) => [entry.energyType.id, entry.level]),
  );
  const formTypes = energyTypes.map((type) => ({
    id: type.id,
    name: type.name,
    level: todayLevels.get(type.id) ?? null,
  }));
  const todayEntries = energyTypes
    .filter((type) => todayLevels.has(type.id))
    .map((type) => ({ energyTypeId: type.id, name: type.name, level: todayLevels.get(type.id)! }));

  const earlierDays = recent.filter((record) => record.date !== today);

  return (
    <>
      <PlaceholderPage
        description="A calm check-in on the capacity you have today. This is only a snapshot, not a score."
        primary
        title="Today"
      />

      <section aria-labelledby="today-capacity-heading" className="mt-10 border-t border-[var(--line)] pt-8">
        <h2 className="text-xl font-semibold text-[var(--ink)]" id="today-capacity-heading">
          How is your capacity today?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Mark a level for each kind of energy. Your 3 doesn't need to look like anyone else's 3.
        </p>

        {todayEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[var(--muted)]">Right now</h3>
            <div className="mt-3">
              <CapacityCard entries={todayEntries} />
            </div>
            {todayRecord?.notes && (
              <p className="mt-4 max-w-2xl whitespace-pre-wrap rounded-md border border-[var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {todayRecord.notes}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 max-w-2xl">
          <CapacityForm
            date={today}
            energyTypes={formTypes}
            notes={todayRecord?.notes ?? null}
          />
        </div>
      </section>

      {earlierDays.length > 0 && (
        <section aria-labelledby="capacity-history-heading" className="mt-12 border-t border-[var(--line)] pt-8">
          <h2 className="text-xl font-semibold text-[var(--ink)]" id="capacity-history-heading">
            Recent days
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            A quiet record of what you've noticed. There's nothing to fix here.
          </p>
          <ul className="mt-6 space-y-6">
            {earlierDays.map((record) => {
              const entries = energyTypes
                .filter((type) => record.energyTypes.some((entry) => entry.energyType.id === type.id))
                .map((type) => {
                  const entry = record.energyTypes.find((item) => item.energyType.id === type.id)!;
                  return { energyTypeId: type.id, name: type.name, level: entry.level };
                });
              return (
                <li className="rounded-md border border-[var(--line)] bg-[var(--canvas)] px-4 py-4" key={record.id}>
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    {formatDayLabel(record.date, timezone)}
                  </h3>
                  <div className="mt-3">
                    <CapacityCard entries={entries} />
                  </div>
                  {record.notes && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                      {record.notes}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}