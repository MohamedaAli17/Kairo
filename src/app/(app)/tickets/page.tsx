import Link from "next/link";
import { myTasks, ticketDetails } from "@/lib/tickets";

const priorityStyles = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-accent-soft text-accent-dark",
  Low: "bg-black/[0.05] text-muted",
};

const statusStyles = {
  "In Progress": "bg-blue-50 text-blue-600",
  "To Do": "bg-black/[0.05] text-muted",
  Open: "bg-accent-soft text-accent-dark",
  Done: "bg-emerald-50 text-emerald-600",
};

export default function TicketsPage() {
  const tickets = Object.values(ticketDetails);

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Tickets</h1>
        <p className="mt-1 text-sm text-muted">Your active simulation tasks</p>
      </header>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-black/5 last:border-0 transition hover:bg-black/[0.02]">
                <td className="px-6 py-4">
                  <Link href={`/tickets/${ticket.id}`} className="font-mono text-accent hover:underline">
                    {ticket.id}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/tickets/${ticket.id}`} className="font-medium text-ink hover:text-accent">
                    {ticket.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`q-chip ${priorityStyles[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`q-chip ${statusStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">{ticket.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted">
        Dashboard also shows {myTasks.length} quick tasks — click any row for full details.
      </p>
    </div>
  );
}
