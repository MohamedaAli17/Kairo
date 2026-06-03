import Link from "next/link";
import { notFound } from "next/navigation";
import { ticketDetails } from "@/lib/mock-data";

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

const statusStyles = {
  "In Progress": "bg-blue-100 text-blue-700",
  "To Do": "bg-zinc-100 text-zinc-600",
  Open: "bg-amber-100 text-amber-700",
  Done: "bg-emerald-100 text-emerald-700",
};

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = ticketDetails[params.id];
  if (!ticket) notFound();

  return (
    <div className="p-6 md:p-8">
      <Link href="/tickets" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to Tickets
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-slate-500">{ticket.id}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[ticket.status]}`}>
              {ticket.status}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{ticket.title}</h1>
        </div>
        <Link
          href="/workspace"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Start Working
        </Link>
      </header>

      <div className="mt-6 flex gap-1 border-b border-slate-200">
        {["Description", "Acceptance Criteria", "Files", "Activity"].map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2.5 text-sm font-medium ${
              i === 0 ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{ticket.description}</p>
          </section>

          {ticket.stepsToReproduce.length > 0 ? (
            <section>
              <h2 className="text-sm font-semibold text-slate-900">Steps to Reproduce</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
                {ticket.stepsToReproduce.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          ) : null}

          <section>
            <h2 className="text-sm font-semibold text-slate-900">Expected Behavior</h2>
            <p className="mt-2 text-sm text-slate-600">{ticket.expectedBehavior}</p>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Details</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Assignee" value={ticket.assignee} />
            <DetailRow label="Reporter" value={ticket.reporter} />
            <DetailRow label="Priority" value={ticket.priority} />
            <DetailRow label="Est. Effort" value={`${ticket.effort} pts`} />
            <DetailRow label="Due Date" value={ticket.dueDate} />
          </dl>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ticket.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
