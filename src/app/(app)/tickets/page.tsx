import Link from "next/link";
import { myTasks, ticketDetails } from "@/lib/mock-data";

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

export default function TicketsPage() {
  const tickets = Object.values(ticketDetails);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
        <p className="mt-1 text-sm text-slate-500">Your active simulation tasks</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">ID</th>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Priority</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-5 py-4">
                  <Link href={`/tickets/${ticket.id}`} className="font-mono text-indigo-600 hover:underline">
                    {ticket.id}
                  </Link>
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">{ticket.title}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">{ticket.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Dashboard also shows {myTasks.length} quick tasks — click any row for full details.
      </p>
    </div>
  );
}
