import { notFound } from "next/navigation";
import { TicketDetailView } from "@/components/tickets/ticket-detail";
import { getTicket, normalizeTicketId } from "@/lib/tickets";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = getTicket(normalizeTicketId(params.id));
  if (!ticket) notFound();

  return <TicketDetailView key={ticket.id} ticket={ticket} />;
}
