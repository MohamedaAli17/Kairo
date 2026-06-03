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

export const myTasks = [
  { id: "BUG-123", title: "Fix pagination hook", status: "In Progress" as const },
  { id: "FEAT-45", title: "Add user profile API", status: "To Do" as const },
  { id: "BUG-221", title: "Payment gateway error", status: "Open" as const },
];

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

export type TicketDetail = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "To Do" | "Done";
  assignee: string;
  reporter: string;
  effort: number;
  dueDate: string;
  tags: string[];
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
};

export const ticketDetails: Record<string, TicketDetail> = {
  "BUG-221": {
    id: "BUG-221",
    title: "Payment gateway error",
    priority: "High",
    status: "Open",
    assignee: "Alex",
    reporter: "AI QA Bot",
    effort: 4,
    dueDate: "May 24, 2024",
    tags: ["bug", "payment", "backend"],
    description:
      "Users are seeing a 500 error when completing checkout with certain card types. The failure appears intermittent but reproducible in staging.",
    stepsToReproduce: [
      "Add items to cart and proceed to checkout",
      "Enter test card 4242 4242 4242 4242",
      "Submit payment — observe 500 response from /api/payments",
    ],
    expectedBehavior: "Payment should succeed and order confirmation should display.",
  },
  "BUG-123": {
    id: "BUG-123",
    title: "Fix pagination hook",
    priority: "Medium",
    status: "In Progress",
    assignee: "Alex",
    reporter: "AI Team Lead",
    effort: 2,
    dueDate: "May 22, 2024",
    tags: ["bug", "frontend"],
    description: "Pagination resets to page 1 when filters change.",
    stepsToReproduce: ["Apply a filter", "Navigate to page 2", "Change filter — page resets incorrectly"],
    expectedBehavior: "Page should reset to 1 only when filter changes, preserving state otherwise.",
  },
  "FEAT-45": {
    id: "FEAT-45",
    title: "Add user profile API",
    priority: "Medium",
    status: "To Do",
    assignee: "Alex",
    reporter: "AI Product Manager",
    effort: 5,
    dueDate: "May 28, 2024",
    tags: ["feature", "api"],
    description: "Implement GET/PATCH endpoints for user profile with validation.",
    stepsToReproduce: [],
    expectedBehavior: "Profile endpoints return and update user data per spec.",
  },
};

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
