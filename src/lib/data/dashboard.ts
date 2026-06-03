import { createClient } from "@/lib/supabase/server";
import {
  formatEventTime,
  formatLevel,
  formatPersona,
  formatTicketStatus,
  xpToNextLevel,
} from "@/lib/format";
import type { CalendarEvent, Message, Profile, SimulationState, Ticket } from "@/types/database";

export type DashboardData = {
  displayName: string;
  roleLabel: string;
  levelNumber: number;
  xp: number;
  xpToNext: number;
  schedule: { time: string; title: string }[];
  tasks: { id: string; title: string; status: string }[];
  messages: { from: string; preview: string; unread: boolean }[];
  performance: {
    overall: number;
    tasksCompleted: number;
    codeQuality: number;
    onTimeDelivery: number;
    communication: number;
  };
  unreadMessages: number;
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function aggregatePerformance(
  reputation: number,
  completedCount: number,
  scoreEvents: { category: string; delta: number }[],
) {
  const byCategory: Record<string, number[]> = {};
  for (const e of scoreEvents) {
    if (!byCategory[e.category]) byCategory[e.category] = [];
    byCategory[e.category].push(e.delta);
  }

  const avg = (key: string, fallback: number) => {
    const vals = byCategory[key];
    if (!vals?.length) return fallback;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.min(100, Math.max(0, Math.round(50 + mean * 5)));
  };

  const codeQuality = avg("code_quality", 75);
  const onTime = avg("delivery", 70);
  const communication = avg("communication", 72);
  const overall = Math.round(
    (reputation + codeQuality + onTime + communication) / 4,
  );

  return {
    overall,
    tasksCompleted: completedCount,
    codeQuality,
    onTimeDelivery: onTime,
    communication,
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData | null> {
  const supabase = createClient();

  const [
    profileRes,
    simRes,
    ticketsRes,
    eventsRes,
    convosRes,
    notifRes,
    scoresRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("simulation_state").select("*").eq("user_id", userId).single(),
    supabase
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["open", "assigned", "in_progress", "in_review", "failed"])
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId)
      .gte("starts_at", startOfToday())
      .lte("starts_at", endOfToday())
      .order("starts_at", { ascending: true }),
    supabase
      .from("conversations")
      .select("id, persona, title, last_message_at")
      .eq("user_id", userId)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(5),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("read_at", null),
    supabase
      .from("score_events")
      .select("category, delta")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (profileRes.error && simRes.error) {
    return null;
  }

  const profile = profileRes.data as Profile | null;
  const sim = simRes.data as SimulationState | null;
  const tickets = (ticketsRes.data ?? []) as Ticket[];
  const events = (eventsRes.data ?? []) as CalendarEvent[];
  const convos: { id: string; persona: string | null; title: string; last_message_at: string | null }[] =
    convosRes.data ?? [];

  const completedRes = await supabase
    .from("tickets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  const conversationIds = convos.map((c) => c.id);
  let latestMessages: Message[] = [];

  if (conversationIds.length > 0) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false })
      .limit(20);
    latestMessages = (msgs ?? []) as Message[];
  }

  const xp = sim?.xp ?? 0;
  const displayName =
    profile?.full_name?.split(" ")[0] ??
    profile?.username ??
    "there";

  const messagePreviews = await Promise.all(
    convos.map(async (convo) => {
      const latest = latestMessages.find((m) => m.conversation_id === convo.id);
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", convo.id)
        .neq("sender_type", "user")
        .is("read_at", null);

      return {
        from: formatPersona(convo.persona),
        preview: latest?.body ?? "No messages yet",
        unread: (count ?? 0) > 0,
      };
    }),
  );

  const unreadMessages =
    (notifRes.count ?? 0) +
    messagePreviews.filter((m) => m.unread).length;

  return {
    displayName,
    roleLabel: sim ? formatLevel(sim.level) : "Junior Engineer",
    levelNumber: sim?.current_sprint ?? 1,
    xp,
    xpToNext: xpToNextLevel(xp),
    schedule: events.map((e) => ({
      time: formatEventTime(e.starts_at),
      title: e.title,
    })),
    tasks: tickets.map((t) => ({
      id: t.ticket_ref,
      title: t.title,
      status: formatTicketStatus(t.status),
    })),
    messages: messagePreviews,
    performance: aggregatePerformance(
      sim?.reputation_score ?? 72,
      completedRes.count ?? 0,
      (scoresRes.data ?? []) as { category: string; delta: number }[],
    ),
    unreadMessages,
  };
}

export async function getAppShellData(userId: string) {
  const supabase = createClient();
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", userId)
    .single();

  const profile = profileRow as Pick<Profile, "full_name" | "username"> | null;

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  const { data: convoRows } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", userId);

  const convoIds = (convoRows ?? []) as { id: string }[];

  let unreadMsgCount = 0;
  if (convoIds.length) {
    const { count: msgCount } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .in(
        "conversation_id",
        convoIds.map((c) => c.id),
      )
      .neq("sender_type", "user")
      .is("read_at", null);
    unreadMsgCount = msgCount ?? 0;
  }

  return {
    displayName:
      profile?.full_name?.split(" ")[0] ?? profile?.username ?? "User",
    unreadBadge: (count ?? 0) + unreadMsgCount,
  };
}
