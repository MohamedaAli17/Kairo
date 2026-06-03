import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/lib/data/dashboard";
import { getUser } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  "In Progress": "bg-blue-100 text-blue-700",
  "In Review": "bg-violet-100 text-violet-700",
  "To Do": "bg-zinc-100 text-zinc-600",
  Open: "bg-amber-100 text-amber-700",
  Assigned: "bg-sky-100 text-sky-700",
  Failed: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-slate-900">Setting up your simulation…</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account exists but profile or simulation data is still being created. Refresh in a
          moment, or check that Supabase triggers ran on signup.
        </p>
      </div>
    );
  }

  const xpPercent = Math.min(100, Math.round((data.xp / data.xpToNext) * 100));

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Good morning, {data.displayName}!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening in your simulation today.
          </p>
        </div>

        <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-auto">
          <p className="text-sm font-semibold text-slate-900">
            {data.roleLabel}, Sprint {data.levelNumber}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {data.xp} / {data.xpToNext} XP
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Today&apos;s Schedule</h2>
            <Link href="/calendar" className="text-xs font-medium text-indigo-600 hover:underline">
              View Calendar
            </Link>
          </div>
          {data.schedule.length === 0 ? (
            <p className="text-sm text-slate-500">No events scheduled for today.</p>
          ) : (
            <ul className="space-y-3">
              {data.schedule.map((event) => (
                <li key={`${event.time}-${event.title}`} className="flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0 font-mono text-xs text-slate-500">{event.time}</span>
                  <span className="font-medium text-slate-800">{event.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">My Tasks</h2>
            <Link href="/tickets" className="text-xs font-medium text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          {data.tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No active tickets — check Messages for new offers.</p>
          ) : (
            <ul className="space-y-3">
              {data.tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tickets/${task.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-1 py-1 text-sm transition hover:bg-slate-50"
                  >
                    <div>
                      <span className="font-mono text-xs text-slate-500">{task.id}</span>
                      <p className="font-medium text-slate-800">{task.title}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[task.status] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {task.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Messages</h2>
            <Link href="/messages" className="text-xs font-medium text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          {data.messages.length === 0 ? (
            <p className="text-sm text-slate-500">No conversations yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.messages.map((msg) => (
                <li key={msg.from} className="text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{msg.from}</p>
                    {msg.unread ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-slate-500">{msg.preview}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 xl:col-span-1">
          <h2 className="mb-4 font-semibold text-slate-900">Performance</h2>
          <div className="flex items-center gap-6">
            <div className="relative grid h-24 w-24 place-items-center rounded-full border-[6px] border-indigo-500/20">
              <div
                className="absolute inset-0 rounded-full border-[6px] border-indigo-500"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${data.performance.overall > 50 ? "100% 0%, 100% 100%, 0% 100%, 0% 0%" : "100% 0%"})`,
                }}
              />
              <span className="text-xl font-bold text-slate-900">{data.performance.overall}%</span>
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
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
