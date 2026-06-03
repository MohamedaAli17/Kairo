import type { EngineerLevel, TicketPriority, TicketStatus } from "@/types/database";

const LEVEL_LABELS: Record<EngineerLevel, string> = {
  junior: "Junior Engineer",
  mid: "Mid-Level Engineer",
  senior: "Senior Engineer",
  staff: "Staff Engineer",
  principal: "Principal Engineer",
};

export function formatLevel(level: EngineerLevel): string {
  return LEVEL_LABELS[level] ?? level;
}

export function xpToNextLevel(xp: number): number {
  const tier = Math.floor(xp / 1000) + 1;
  return tier * 1000;
}

export function formatTicketStatus(status: TicketStatus): string {
  const map: Record<TicketStatus, string> = {
    open: "Open",
    assigned: "Assigned",
    in_progress: "In Progress",
    in_review: "In Review",
    completed: "Done",
    failed: "Failed",
    declined: "Declined",
  };
  return map[status] ?? status;
}

export function formatPriority(priority: TicketPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const PERSONA_LABELS: Record<string, string> = {
  ai_pm: "AI Product Manager",
  ai_tech_lead: "AI Team Lead",
  ai_qa: "QA Bot",
  ai_code_reviewer: "AI Code Reviewer",
  ai_teammate: "AI Teammate",
};

export function formatPersona(persona: string | null): string {
  if (!persona) return "Conversation";
  return PERSONA_LABELS[persona] ?? persona.replace(/_/g, " ");
}
