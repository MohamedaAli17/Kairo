import { performance } from "@/lib/mock-data";

export default function ProgressPage() {
  const metrics = [
    { label: "Overall Score", value: `${performance.overall}%`, color: "bg-accent" },
    { label: "Tasks Completed", value: String(performance.tasksCompleted), color: "bg-emerald-500" },
    { label: "Code Quality", value: `${performance.codeQuality}%`, color: "bg-blue-500" },
    { label: "On-time Delivery", value: `${performance.onTimeDelivery}%`, color: "bg-violet-500" },
    { label: "Communication", value: `${performance.communication}%`, color: "bg-pink-500" },
  ];

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Progress</h1>
        <p className="mt-1 text-sm text-muted">Track your simulation performance over time</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="q-card">
            <p className="text-sm text-muted">{m.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{m.value}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div className={`h-full w-3/4 rounded-full ${m.color}`} />
            </div>
          </div>
        ))}
      </div>

      <section className="q-card mt-4 p-6">
        <h2 className="font-semibold text-ink">Recent milestones</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex justify-between border-b border-black/5 pb-3">
            <span className="text-ink">Completed first sprint ticket</span>
            <span className="text-muted">2 days ago</span>
          </li>
          <li className="flex justify-between border-b border-black/5 pb-3">
            <span className="text-ink">Merged PR with AI review feedback</span>
            <span className="text-muted">4 days ago</span>
          </li>
          <li className="flex justify-between">
            <span className="text-ink">Reached Level 2</span>
            <span className="text-muted">1 week ago</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
