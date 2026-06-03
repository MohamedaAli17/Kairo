import { performance } from "@/lib/mock-data";

export default function ProgressPage() {
  const metrics = [
    { label: "Overall Score", value: `${performance.overall}%`, color: "bg-indigo-500" },
    { label: "Tasks Completed", value: String(performance.tasksCompleted), color: "bg-emerald-500" },
    { label: "Code Quality", value: `${performance.codeQuality}%`, color: "bg-blue-500" },
    { label: "On-time Delivery", value: `${performance.onTimeDelivery}%`, color: "bg-violet-500" },
    { label: "Communication", value: `${performance.communication}%`, color: "bg-pink-500" },
  ];

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Progress</h1>
        <p className="mt-1 text-sm text-slate-500">Track your simulation performance over time</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{m.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{m.value}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full w-3/4 rounded-full ${m.color}`} />
            </div>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Recent milestones</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-700">Completed first sprint ticket</span>
            <span className="text-slate-400">2 days ago</span>
          </li>
          <li className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-700">Merged PR with AI review feedback</span>
            <span className="text-slate-400">4 days ago</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-700">Reached Level 2</span>
            <span className="text-slate-400">1 week ago</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
