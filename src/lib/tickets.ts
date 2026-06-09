export type TicketActivity = {
  id: string;
  actor: string;
  message: string;
  time: string;
};

export type TicketFile = {
  path: string;
  status: "modified" | "added" | "context";
  summary: string;
};

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
  acceptanceCriteria: string[];
  files: TicketFile[];
  activity: TicketActivity[];
  branch: string;
};

export const ticketDetails: Record<string, TicketDetail> = {
  "BUG-221": {
    id: "BUG-221",
    title: "Payment gateway error",
    priority: "High",
    status: "Open",
    assignee: "Unassigned",
    reporter: "AI QA Bot",
    effort: 4,
    dueDate: "May 24, 2024",
    tags: ["bug", "payment", "backend"],
    branch: "bug/fix-221-payment-error",
    description:
      "Users are seeing a 500 error when completing checkout with certain card types. The failure appears intermittent but reproducible in staging.",
    stepsToReproduce: [
      "Add items to cart and proceed to checkout",
      "Enter test card 4242 4242 4242 4242",
      "Submit payment — observe 500 response from /api/payments",
    ],
    expectedBehavior: "Payment should succeed and order confirmation should display.",
    acceptanceCriteria: [
      "POST /api/payments returns 200 with transactionId on success",
      "Failed payments return 4xx with a structured error code (not generic 500)",
      "paymentController uses paymentError from utils/errors.js",
      "Existing paymentService validation remains intact",
      "All workspace tests pass",
    ],
    files: [
      {
        path: "src/controllers/paymentController.js",
        status: "modified",
        summary: "Returns generic 500 on charge failure — primary fix target",
      },
      {
        path: "src/services/paymentService.js",
        status: "context",
        summary: "Gateway charge wrapper with field validation",
      },
      {
        path: "src/routes/payments.js",
        status: "context",
        summary: "POST route wired to processPayment",
      },
      {
        path: "src/utils/errors.js",
        status: "context",
        summary: "Shared paymentError helper for structured responses",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI QA Bot",
        message: "Reported bug after staging checkout test failed with 500.",
        time: "May 22, 09:41",
      },
      {
        id: "2",
        actor: "AI Product Manager",
        message: "Marked as high priority — blocks checkout in staging demo.",
        time: "May 22, 10:05",
      },
      {
        id: "3",
        actor: "AI Team Lead",
        message: "Offered ticket to team. Branch bug/fix-221-payment-error created.",
        time: "May 22, 11:20",
      },
    ],
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
    branch: "bug/fix-pagination-reset",
    description: "Pagination resets to page 1 when filters change.",
    stepsToReproduce: [
      "Apply a filter on the product list",
      "Navigate to page 2",
      "Change the filter — page resets incorrectly",
    ],
    expectedBehavior: "Page should reset to 1 only when filter changes, preserving state otherwise.",
    acceptanceCriteria: [
      "Changing filters resets to page 1",
      "Changing sort order preserves current page when valid",
      "usePagination hook exposes stable API for list components",
      "No duplicate fetch on filter + page change",
    ],
    files: [
      {
        path: "src/hooks/usePagination.ts",
        status: "modified",
        summary: "Hook resets page incorrectly on filter updates",
      },
      {
        path: "src/components/ProductList.tsx",
        status: "context",
        summary: "Consumes usePagination for catalog grid",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI Team Lead",
        message: "Assigned ticket to Alex.",
        time: "May 20, 14:00",
      },
      {
        id: "2",
        actor: "Alex",
        message: "Accepted ticket and started investigation.",
        time: "May 20, 14:22",
      },
      {
        id: "3",
        actor: "AI QA Bot",
        message: "Added repro steps from manual test session.",
        time: "May 21, 09:15",
      },
    ],
  },
  "FEAT-45": {
    id: "FEAT-45",
    title: "Add user profile API",
    priority: "Medium",
    status: "To Do",
    assignee: "Unassigned",
    reporter: "AI Product Manager",
    effort: 5,
    dueDate: "May 28, 2024",
    tags: ["feature", "api"],
    branch: "feat/user-profile-api",
    description: "Implement GET/PATCH endpoints for user profile with validation.",
    stepsToReproduce: [],
    expectedBehavior: "Profile endpoints return and update user data per spec.",
    acceptanceCriteria: [
      "GET /api/profile returns authenticated user's profile",
      "PATCH /api/profile validates bio length (max 280 chars)",
      "PATCH rejects invalid avatar URLs",
      "OpenAPI spec updated for both endpoints",
    ],
    files: [
      {
        path: "src/routes/profile.ts",
        status: "added",
        summary: "New route handlers for GET and PATCH",
      },
      {
        path: "src/schemas/profile.ts",
        status: "added",
        summary: "Zod validation schema for profile updates",
      },
      {
        path: "src/services/profileService.ts",
        status: "added",
        summary: "Database read/write for profiles table",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI Product Manager",
        message: "Created feature ticket for profile settings page dependency.",
        time: "May 19, 16:30",
      },
      {
        id: "2",
        actor: "AI Team Lead",
        message: "Added to sprint backlog — pick up after payment bug.",
        time: "May 20, 09:00",
      },
    ],
  },
  "BUG-304": {
    id: "BUG-304",
    title: "Auth token refresh race condition",
    priority: "High",
    status: "Open",
    assignee: "Unassigned",
    reporter: "AI Team Lead",
    effort: 3,
    dueDate: "May 25, 2024",
    tags: ["bug", "auth", "backend"],
    branch: "bug/fix-304-refresh-race",
    description:
      "Multiple simultaneous API calls trigger parallel refresh requests. Users get logged out intermittently when tabs are open.",
    stepsToReproduce: [
      "Log in and open two tabs on the dashboard",
      "Wait for access token to near expiry",
      "Trigger several API calls at once — observe duplicate refresh POSTs",
    ],
    expectedBehavior: "Only one refresh runs at a time; other callers await the same promise.",
    acceptanceCriteria: [
      "refreshAccessToken uses a shared in-flight promise",
      "Concurrent callers receive the same new token",
      "Failed refresh clears the lock and propagates error once",
      "All workspace tests pass",
    ],
    files: [
      {
        path: "src/auth/refreshToken.ts",
        status: "modified",
        summary: "Missing mutex — fires parallel refresh requests",
      },
      {
        path: "src/middleware/auth.ts",
        status: "context",
        summary: "Attaches bearer token and calls refresh on 401",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI Team Lead",
        message: "Escalated from on-call — multiple logout reports after deploy.",
        time: "May 23, 08:10",
      },
      {
        id: "2",
        actor: "DevOps",
        message: "Correlated with auth service spike in refresh endpoint metrics.",
        time: "May 23, 09:45",
      },
    ],
  },
  "BUG-188": {
    id: "BUG-188",
    title: "Cart total miscalculates with promo codes",
    priority: "High",
    status: "Open",
    assignee: "Unassigned",
    reporter: "AI QA Bot",
    effort: 3,
    dueDate: "May 26, 2024",
    tags: ["bug", "checkout", "frontend"],
    branch: "bug/fix-188-cart-total",
    description:
      "Applying a percentage promo shows correct subtotal but tax and final total ignore the discount.",
    stepsToReproduce: [
      "Add $100 of items to cart",
      "Apply promo code SAVE10 (10% off)",
      "Proceed to checkout — tax calculated on pre-discount amount",
    ],
    expectedBehavior: "Tax and total should use discounted subtotal.",
    acceptanceCriteria: [
      "calculateCartTotal applies discount before tax",
      "CartSummary displays subtotal, discount, tax, and total correctly",
      "Zero or negative totals are rejected",
      "All workspace tests pass",
    ],
    files: [
      {
        path: "src/utils/cartTotal.ts",
        status: "modified",
        summary: "Tax computed on raw subtotal instead of discounted amount",
      },
      {
        path: "src/components/CartSummary.tsx",
        status: "context",
        summary: "Renders line items and calls calculateCartTotal",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI QA Bot",
        message: "Filed after finance flagged revenue discrepancy in staging.",
        time: "May 21, 15:20",
      },
      {
        id: "2",
        actor: "AI Product Manager",
        message: "Blocks promo campaign launch — prioritize this sprint.",
        time: "May 22, 09:00",
      },
    ],
  },
  "FEAT-52": {
    id: "FEAT-52",
    title: "Add API rate limiting middleware",
    priority: "Medium",
    status: "To Do",
    assignee: "Unassigned",
    reporter: "AI Team Lead",
    effort: 4,
    dueDate: "May 30, 2024",
    tags: ["feature", "api", "security"],
    branch: "feat/52-rate-limit-middleware",
    description:
      "Public endpoints need per-IP rate limits to prevent abuse ahead of launch.",
    stepsToReproduce: [],
    expectedBehavior: "Requests over limit receive 429 with Retry-After header.",
    acceptanceCriteria: [
      "rateLimit middleware tracks requests per IP in a sliding window",
      "Returns 429 when limit exceeded",
      "Sets Retry-After header on blocked responses",
      "Exempts /health from limiting",
      "All workspace tests pass",
    ],
    files: [
      {
        path: "src/middleware/rateLimit.ts",
        status: "added",
        summary: "New middleware — stub needs full implementation",
      },
      {
        path: "src/app.ts",
        status: "context",
        summary: "Express app mounts middleware chain",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI Team Lead",
        message: "Security review action item from last sprint retro.",
        time: "May 18, 11:00",
      },
    ],
  },
  "BUG-402": {
    id: "BUG-402",
    title: "CORS blocks staging frontend",
    priority: "High",
    status: "Open",
    assignee: "Unassigned",
    reporter: "DevOps",
    effort: 2,
    dueDate: "May 24, 2024",
    tags: ["bug", "infra", "api"],
    branch: "bug/fix-402-cors-staging",
    description:
      "Staging UI at staging.kairo.app cannot call the API — browser reports CORS policy errors.",
    stepsToReproduce: [
      "Open staging.kairo.app",
      "Log in — network tab shows blocked preflight to api-staging.kairo.app",
    ],
    expectedBehavior: "Staging origin allowed with credentials support.",
    acceptanceCriteria: [
      "cors config includes https://staging.kairo.app",
      "credentials: true enabled for cookie auth",
      "OPTIONS preflight returns correct Access-Control headers",
      "All workspace tests pass",
    ],
    files: [
      {
        path: "src/config/cors.ts",
        status: "modified",
        summary: "allowedOrigins missing staging URL",
      },
      {
        path: "src/server.ts",
        status: "context",
        summary: "Applies cors middleware at startup",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "DevOps",
        message: "Blocked QA sign-off on staging environment.",
        time: "May 23, 07:30",
      },
      {
        id: "2",
        actor: "AI Team Lead",
        message: "Assigned to next available engineer — demo is Thursday.",
        time: "May 23, 08:00",
      },
    ],
  },
  "FEAT-61": {
    id: "FEAT-61",
    title: "Webhook delivery retry handler",
    priority: "Medium",
    status: "To Do",
    assignee: "Unassigned",
    reporter: "AI Product Manager",
    effort: 5,
    dueDate: "Jun 2, 2024",
    tags: ["feature", "integrations", "backend"],
    branch: "feat/61-webhook-retries",
    description:
      "Partner webhooks need exponential backoff retries when endpoints return 5xx or time out.",
    stepsToReproduce: [],
    expectedBehavior: "Failed deliveries retry up to 5 times with increasing delay; permanent failure logged.",
    acceptanceCriteria: [
      "deliverWebhook retries on 5xx and network errors",
      "Uses exponential backoff (1s, 2s, 4s, 8s, 16s)",
      "Stops after maxAttempts and records failure",
      "Successful delivery returns without further retries",
      "All workspace tests pass",
    ],
    files: [
      {
        path: "src/workers/webhookRetry.ts",
        status: "added",
        summary: "Retry loop stub — needs backoff and max attempts",
      },
      {
        path: "src/types/webhook.ts",
        status: "context",
        summary: "Webhook payload and result types",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "AI Product Manager",
        message: "Required for Stripe integration go-live checklist.",
        time: "May 20, 13:00",
      },
      {
        id: "2",
        actor: "AI Team Lead",
        message: "Estimated 5 pts — pair with DevOps for queue config.",
        time: "May 21, 10:15",
      },
    ],
  },
  "BUG-517": {
    id: "BUG-517",
    title: "Notification badge count stuck",
    priority: "Low",
    status: "Done",
    assignee: "Alex",
    reporter: "AI QA Bot",
    effort: 1,
    dueDate: "May 15, 2024",
    tags: ["bug", "frontend"],
    branch: "bug/fix-517-badge-count",
    description: "Unread count in sidebar did not decrement after marking messages read.",
    stepsToReproduce: [
      "Receive 3 unread messages",
      "Open and read all — badge still shows 3",
    ],
    expectedBehavior: "Badge updates to 0 when all messages are read.",
    acceptanceCriteria: [
      "Badge reflects unread count from store",
      "Mark-as-read updates count immediately",
    ],
    files: [
      {
        path: "src/hooks/useUnreadCount.ts",
        status: "modified",
        summary: "Fixed — merged last week",
      },
    ],
    activity: [
      {
        id: "1",
        actor: "Alex",
        message: "Merged fix — invalidated cache on read.",
        time: "May 14, 16:40",
      },
    ],
  },
};

export function normalizeTicketId(id: string): string {
  try {
    return decodeURIComponent(id).trim();
  } catch {
    return id.trim();
  }
}

export function getTicket(id: string): TicketDetail | undefined {
  return ticketDetails[normalizeTicketId(id)];
}

export const myTasks = [
  { id: "BUG-221", title: "Payment gateway error", status: "Open" as const },
  { id: "BUG-304", title: "Auth token refresh race condition", status: "Open" as const },
  { id: "BUG-188", title: "Cart total miscalculates with promo codes", status: "Open" as const },
  { id: "BUG-123", title: "Fix pagination hook", status: "In Progress" as const },
  { id: "BUG-402", title: "CORS blocks staging frontend", status: "Open" as const },
  { id: "FEAT-45", title: "Add user profile API", status: "To Do" as const },
  { id: "FEAT-52", title: "Add API rate limiting middleware", status: "To Do" as const },
  { id: "FEAT-61", title: "Webhook delivery retry handler", status: "To Do" as const },
];
