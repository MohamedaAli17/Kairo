export const currentUser = {
  name: "Alex",
  role: "Junior Engineer",
  level: 2,
  xp: 720,
  xpToNext: 1000,
};

export const todaySchedule = [
  { time: "09:30", title: "Daily Standup", type: "meeting" as const },
  { time: "10:00", title: "Sprint Planning", type: "planning" as const },
  { time: "14:00", title: "Architecture Review", type: "review" as const },
];

export { ticketDetails, getTicket, myTasks } from "@/lib/tickets";
export type { TicketDetail, TicketActivity, TicketFile } from "@/lib/tickets";

export const recentMessages = [
  { from: "AI Team Lead", preview: "Can you pick up BUG-221 today?", unread: true },
  { from: "AI Product Manager", preview: "Scope update on FEAT-45", unread: false },
  { from: "QA Bot", preview: "Edge cases found in your last PR", unread: true },
];

export const performance = {
  overall: 72,
  tasksCompleted: 14,
  codeQuality: 81,
  onTimeDelivery: 68,
  communication: 76,
};

export const calendarEvents = [
  { day: 1, start: 9.5, end: 10, title: "Daily Standup", type: "meeting" as const },
  { day: 1, start: 10, end: 11, title: "Sprint Planning", type: "planning" as const },
  { day: 2, start: 14, end: 15, title: "Architecture Review", type: "review" as const },
  { day: 3, start: 11, end: 12.5, title: "Incident Triage", type: "incident" as const },
  { day: 4, start: 10, end: 10.5, title: "Daily Standup", type: "meeting" as const },
  { day: 5, start: 15, end: 16, title: "Demo Prep", type: "planning" as const },
];

export const eventColors = {
  meeting: "bg-emerald-500",
  planning: "bg-blue-500",
  review: "bg-violet-500",
  incident: "bg-pink-500",
};

export const conversations = [
  { id: "lead", name: "AI Team Lead", preview: "Can you pick up BUG-221 today?", unread: true },
  { id: "pm", name: "AI Product Manager", preview: "Scope update on FEAT-45", unread: false },
  { id: "qa", name: "QA Bot", preview: "Edge cases found in your last PR", unread: true },
  { id: "devops", name: "DevOps", preview: "Staging deploy is ready", unread: false },
];

export const teamLeadMessages = [
  {
    from: "AI Team Lead",
    text: "Hey Alex — we have a high-priority bug in the payment flow. Can you take a look today?",
    time: "09:12",
  },
  {
    from: "AI Team Lead",
    text: "I've attached the ticket details below. Let me know if you can pick it up.",
    time: "09:13",
    taskOffer: {
      id: "BUG-221",
      title: "Payment gateway error",
      priority: "High" as const,
      effort: 4,
      dueDate: "May 24, 2024",
    },
  },
];

export const workspaceFiles = [
  { path: "src/controllers/paymentController.js", active: true },
  { path: "src/services/paymentService.js", active: false },
  { path: "src/routes/payments.js", active: false },
  { path: "src/utils/errors.js", active: false },
];

export const sampleCode = `async function processPayment(req, res) {
  try {
    const { amount, cardToken } = req.body;
    const result = await paymentService.charge(cardToken, amount);
    return res.json({ success: true, transactionId: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Payment failed" });
  }
}`;

export const prReview = {
  id: 42,
  title: "Fix payment gateway error",
  status: "Under Review" as const,
  reviewer: "AI Code Reviewer (Tech Lead)",
  suggestions: [
    { title: "Error Handling", text: "Return structured error codes instead of generic 500 responses." },
    { title: "Logging", text: "Log transaction IDs on failure for easier debugging in production." },
    { title: "Code Style", text: "Extract validation into a middleware for consistency with other controllers." },
  ],
  summary: {
    functionality: "Good" as const,
    codeQuality: "Needs Improvement" as const,
    tests: "Good" as const,
    overall: "Approved with suggestions" as const,
  },
};

export const teamMembers = [
  { name: "AI Team Lead", role: "Engineering Manager", status: "Online" },
  { name: "AI Product Manager", role: "Product", status: "Online" },
  { name: "QA Bot", role: "Quality Assurance", status: "Away" },
  { name: "DevOps", role: "Platform", status: "Online" },
  { name: "Alex", role: "Junior Engineer", status: "You" },
];
