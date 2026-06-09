import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/lib/data/dashboard";
import { getUser } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  "In Progress": "bg-blue-50 text-blue-600",
  "In Review": "bg-violet-50 text-violet-600",
  "To Do": "bg-black/[0.05] text-muted",
  Open: "bg-accent-soft text-accent-dark",
  Assigned: "bg-sky-50 text-sky-600",
  Failed: "bg-red-50 text-red-600",
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-ink">Setting up your simulation…</h1>
        <p className="mt-2 text-sm text-muted">
          Your account exists but profile or simulation data is still being created. Refresh in a
          moment, or check that Supabase triggers ran on signup.
        </p>
      </div>
    );
  }

  const xpPercent = Math.min(100, Math.round((data.xp / data.xpToNext) * 100));

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Good morning, {data.displayName}!
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s what&apos;s happening in your simulation today.
          </p>
        </div>

        <div className="w-full max-w-xs rounded-3xl bg-ink p-5 text-white shadow-card sm:w-auto">
          <p className="text-sm font-semibold">
            {data.roleLabel}, Sprint {data.levelNumber}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">
            {data.xp} / {data.xpToNext} XP
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <section className="q-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Today&apos;s Schedule</h2>
            <Link href="/calendar" className="text-xs font-semibold text-accent hover:underline">
              View Calendar
            </Link>
          </div>
          {data.schedule.length === 0 ? (
            <p className="text-sm text-muted">No events scheduled for today.</p>
          ) : (
            <ul className="space-y-2">
              {data.schedule.map((event) => (
                <li
                  key={`${event.time}-${event.title}`}
                  className="flex items-center gap-3 rounded-2xl bg-black/[0.02] px-3 py-2.5 text-sm"
                >
                  <span className="w-12 shrink-0 font-mono text-xs text-accent">{event.time}</span>
                  <span className="font-medium text-ink">{event.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="q-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">My Tasks</h2>
            <Link href="/tickets" className="text-xs font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          {data.tasks.length === 0 ? (
            <p className="text-sm text-muted">No active tickets — check Messages for new offers.</p>
          ) : (
            <ul className="space-y-1.5">
              {data.tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tickets/${task.id}`}
                    className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-sm transition hover:bg-black/[0.03]"
                  >
                    <div>
                      <span className="font-mono text-xs text-muted">{task.id}</span>
                      <p className="font-medium text-ink">{task.title}</p>
                    </div>
                    <span
                      className={`q-chip shrink-0 ${statusStyles[task.status] ?? "bg-black/[0.05] text-muted"}`}
                    >
                      {task.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="q-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Messages</h2>
            <Link href="/messages" className="text-xs font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          {data.messages.length === 0 ? (
            <p className="text-sm text-muted">No conversations yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.messages.map((msg) => (
                <li key={msg.from} className="text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{msg.from}</p>
                    {msg.unread ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-muted">{msg.preview}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="q-card lg:col-span-2 xl:col-span-1">
          <h2 className="mb-4 font-semibold text-ink">Performance</h2>
          <div className="flex items-center gap-6">
            <div className="relative grid h-24 w-24 place-items-center rounded-full border-[7px] border-accent/15">
              <div
                className="absolute inset-0 rounded-full border-[7px] border-accent"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${data.performance.overall > 50 ? "100% 0%, 100% 100%, 0% 100%, 0% 0%" : "100% 0%"})`,
                }}
              />
              <span className="text-xl font-bold text-ink">{data.performance.overall}%</span>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3 text-sm">
              <Stat label="Tasks done" value={data.performance.tasksCompleted} />
              <Stat label="Code quality" value={`${data.performance.codeQuality}%`} />
              <Stat label="On-time" value={`${data.performance.onTimeDelivery}%`} />
              <Stat label="Communication" value={`${data.performance.communication}%`} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold text-ink">{value}</p>
    </div>
  );
}
