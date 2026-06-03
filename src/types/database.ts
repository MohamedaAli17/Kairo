export type EngineerLevel = "junior" | "mid" | "senior" | "staff" | "principal";
export type SubscriptionPlan = "free" | "pro" | "team";
export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "in_review"
  | "completed"
  | "failed"
  | "declined";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type MessageSenderType =
  | "user"
  | "ai_pm"
  | "ai_tech_lead"
  | "ai_qa"
  | "ai_code_reviewer"
  | "ai_teammate";

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type SimulationState = {
  id: string;
  user_id: string;
  xp: number;
  level: EngineerLevel;
  current_sprint: number;
  current_day: number;
  reputation_score: number;
  streak: number;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  user_id: string;
  ticket_ref: string;
  title: string;
  description: string | null;
  type: string;
  status: TicketStatus;
  priority: TicketPriority;
  acceptance_criteria: string | null;
  deadline: string | null;
  xp_reward: number;
  assigned_by: string | null;
  accepted_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  persona: string | null;
  ticket_id: string | null;
  title: string;
  last_message_at: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_type: MessageSenderType;
  body: string;
  metadata: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

export type CalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  is_voice: boolean;
  transcript: string | null;
  user_response: string | null;
  ai_feedback: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type ScoreEvent = {
  id: string;
  user_id: string;
  category: string;
  delta: number;
  reason: string | null;
  ticket_id: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      simulation_state: { Row: SimulationState; Insert: Partial<SimulationState>; Update: Partial<SimulationState> };
      subscriptions: { Row: Subscription; Insert: Partial<Subscription>; Update: Partial<Subscription> };
      tickets: { Row: Ticket; Insert: Partial<Ticket>; Update: Partial<Ticket> };
      conversations: { Row: Conversation; Insert: Partial<Conversation>; Update: Partial<Conversation> };
      messages: { Row: Message; Insert: Partial<Message>; Update: Partial<Message> };
      calendar_events: { Row: CalendarEvent; Insert: Partial<CalendarEvent>; Update: Partial<CalendarEvent> };
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> };
      score_events: { Row: ScoreEvent; Insert: Partial<ScoreEvent>; Update: Partial<ScoreEvent> };
    };
  };
};
