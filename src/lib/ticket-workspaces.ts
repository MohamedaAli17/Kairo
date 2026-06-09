export type WorkspaceLanguage = "javascript" | "typescript";

export type WorkspaceFile = {
  path: string;
  language: WorkspaceLanguage;
  content: string;
};

export type TicketWorkspace = {
  ticketId: string;
  branch: string;
  defaultPath: string;
  files: WorkspaceFile[];
};

const BUG_221: TicketWorkspace = {
  ticketId: "BUG-221",
  branch: "bug/fix-221-payment-error",
  defaultPath: "src/controllers/paymentController.js",
  files: [
    {
      path: "src/controllers/paymentController.js",
      language: "javascript",
      content: `const paymentService = require("../services/paymentService");

async function processPayment(req, res) {
  try {
    const { amount, cardToken } = req.body;
    const result = await paymentService.charge(cardToken, amount);
    return res.json({ success: true, transactionId: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Payment failed" });
  }
}

module.exports = { processPayment };
`,
    },
    {
      path: "src/services/paymentService.js",
      language: "javascript",
      content: `const gateway = require("../lib/paymentGateway");

async function charge(cardToken, amount) {
  if (!cardToken || amount == null) {
    throw new Error("Missing payment fields");
  }
  const response = await gateway.charge({ cardToken, amount });
  return response;
}

module.exports = { charge };
`,
    },
    {
      path: "src/routes/payments.js",
      language: "javascript",
      content: `const express = require("express");
const { processPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", processPayment);

module.exports = router;
`,
    },
    {
      path: "src/utils/errors.js",
      language: "javascript",
      content: `function paymentError(code, message) {
  const err = new Error(message);
  err.code = code;
  err.status = 400;
  return err;
}

module.exports = { paymentError };
`,
    },
  ],
};

const BUG_123: TicketWorkspace = {
  ticketId: "BUG-123",
  branch: "bug/fix-pagination-reset",
  defaultPath: "src/hooks/usePagination.ts",
  files: [
    {
      path: "src/hooks/usePagination.ts",
      language: "typescript",
      content: `import { useEffect, useState } from "react";

export function usePagination(
  totalItems: number,
  pageSize: number,
  filter: string,
  sort: string,
) {
  const [page, setPage] = useState(1);

  // BUG: resets page when sort changes — should only reset when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const offset = (page - 1) * pageSize;

  return { page, setPage, totalPages, offset };
}
`,
    },
    {
      path: "src/components/ProductList.tsx",
      language: "typescript",
      content: `import { usePagination } from "../hooks/usePagination";

type Product = { id: string; name: string };

type Props = {
  items: Product[];
  filter: string;
  sort: string;
};

export function ProductList({ items, filter, sort }: Props) {
  const { page, setPage, totalPages, offset } = usePagination(
    items.length,
    10,
    filter,
    sort,
  );

  const visible = items.slice(offset, offset + 10);

  return (
    <div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div className="pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
`,
    },
    {
      path: "src/types/catalog.ts",
      language: "typescript",
      content: `export type SortOption = "name" | "price" | "newest";

export type CatalogFilter = {
  query: string;
  category: string | null;
};
`,
    },
  ],
};

const FEAT_45: TicketWorkspace = {
  ticketId: "FEAT-45",
  branch: "feat/user-profile-api",
  defaultPath: "src/routes/profile.ts",
  files: [
    {
      path: "src/routes/profile.ts",
      language: "typescript",
      content: `import { Router } from "express";
import { profileUpdateSchema } from "../schemas/profile";
import { getProfileForUser, updateProfileForUser } from "../services/profileService";

const router = Router();

router.get("/", async (req, res) => {
  const profile = await getProfileForUser(req.user.id);
  return res.json(profile);
});

router.patch("/", async (req, res) => {
  // TODO: validate body with profileUpdateSchema before saving
  const updated = await updateProfileForUser(req.user.id, req.body);
  return res.json(updated);
});

export default router;
`,
    },
    {
      path: "src/schemas/profile.ts",
      language: "typescript",
      content: `// TODO: add Zod schema — bio max 280 chars, validate avatar URL
export type ProfileUpdate = {
  bio?: string;
  avatar_url?: string;
};

export function profileUpdateSchema(data: unknown): ProfileUpdate {
  return data as ProfileUpdate;
}
`,
    },
    {
      path: "src/services/profileService.ts",
      language: "typescript",
      content: `import type { ProfileUpdate } from "../schemas/profile";

export async function getProfileForUser(userId: string) {
  return {
    id: userId,
    bio: "",
    avatar_url: null,
  };
}

export async function updateProfileForUser(userId: string, data: ProfileUpdate) {
  return { id: userId, ...data };
}
`,
    },
  ],
};

const BUG_304: TicketWorkspace = {
  ticketId: "BUG-304",
  branch: "bug/fix-304-refresh-race",
  defaultPath: "src/auth/refreshToken.ts",
  files: [
    {
      path: "src/auth/refreshToken.ts",
      language: "typescript",
      content: `let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  // BUG: always starts a new refresh — no shared in-flight promise
  const response = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
  const data = await response.json();
  return data.accessToken;
}

export function clearRefreshLock() {
  refreshPromise = null;
}
`,
    },
    {
      path: "src/middleware/auth.ts",
      language: "typescript",
      content: `import { refreshAccessToken } from "../auth/refreshToken";

export async function withAuth(request: Request): Promise<Request> {
  const token = request.headers.get("Authorization");
  if (token) return request;
  const newToken = await refreshAccessToken();
  const headers = new Headers(request.headers);
  headers.set("Authorization", \`Bearer \${newToken}\`);
  return new Request(request, { headers });
}
`,
    },
  ],
};

const BUG_188: TicketWorkspace = {
  ticketId: "BUG-188",
  branch: "bug/fix-188-cart-total",
  defaultPath: "src/utils/cartTotal.ts",
  files: [
    {
      path: "src/utils/cartTotal.ts",
      language: "typescript",
      content: `export type CartLine = { price: number; qty: number };

export function calculateCartTotal(
  lines: CartLine[],
  discountPercent: number,
  taxRate: number,
) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  // BUG: tax applied before discount
  const tax = subtotal * taxRate;
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal + tax - discount;
  return { subtotal, discount, tax, total };
}
`,
    },
    {
      path: "src/components/CartSummary.tsx",
      language: "typescript",
      content: `import { calculateCartTotal, type CartLine } from "../utils/cartTotal";

type Props = { lines: CartLine[]; promoPercent: number };

export function CartSummary({ lines, promoPercent }: Props) {
  const { subtotal, discount, tax, total } = calculateCartTotal(lines, promoPercent, 0.08);
  return (
    <div>
      <p>Subtotal: \${subtotal.toFixed(2)}</p>
      <p>Discount: -\${discount.toFixed(2)}</p>
      <p>Tax: \${tax.toFixed(2)}</p>
      <p>Total: \${total.toFixed(2)}</p>
    </div>
  );
}
`,
    },
  ],
};

const FEAT_52: TicketWorkspace = {
  ticketId: "FEAT-52",
  branch: "feat/52-rate-limit-middleware",
  defaultPath: "src/middleware/rateLimit.ts",
  files: [
    {
      path: "src/middleware/rateLimit.ts",
      language: "typescript",
      content: `import type { Request, Response, NextFunction } from "express";

const hits = new Map<string, number>();

// TODO: sliding window, 429 + Retry-After, exempt /health
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? "unknown";
  const count = (hits.get(ip) ?? 0) + 1;
  hits.set(ip, count);
  next();
}
`,
    },
    {
      path: "src/app.ts",
      language: "typescript",
      content: `import express from "express";
import { rateLimit } from "./middleware/rateLimit";

const app = express();

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(rateLimit);

export default app;
`,
    },
  ],
};

const BUG_402: TicketWorkspace = {
  ticketId: "BUG-402",
  branch: "bug/fix-402-cors-staging",
  defaultPath: "src/config/cors.ts",
  files: [
    {
      path: "src/config/cors.ts",
      language: "typescript",
      content: `export const corsOptions = {
  origin: ["http://localhost:3000", "https://app.kairo.app"],
  credentials: false,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};
`,
    },
    {
      path: "src/server.ts",
      language: "typescript",
      content: `import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";

const app = express();
app.use(cors(corsOptions));

export default app;
`,
    },
  ],
};

const FEAT_61: TicketWorkspace = {
  ticketId: "FEAT-61",
  branch: "feat/61-webhook-retries",
  defaultPath: "src/workers/webhookRetry.ts",
  files: [
    {
      path: "src/workers/webhookRetry.ts",
      language: "typescript",
      content: `const MAX_ATTEMPTS = 5;

export async function deliverWebhook(url: string, body: object): Promise<void> {
  // TODO: retry on 5xx with exponential backoff 1s, 2s, 4s, 8s, 16s
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(\`Webhook failed: \${res.status}\`);
}
`,
    },
    {
      path: "src/types/webhook.ts",
      language: "typescript",
      content: `export type WebhookPayload = {
  event: string;
  data: Record<string, unknown>;
};

export type DeliveryResult = {
  success: boolean;
  attempts: number;
};
`,
    },
  ],
};

export const TICKET_WORKSPACES: Record<string, TicketWorkspace> = {
  "BUG-221": BUG_221,
  "BUG-123": BUG_123,
  "FEAT-45": FEAT_45,
  "BUG-304": BUG_304,
  "BUG-188": BUG_188,
  "FEAT-52": FEAT_52,
  "BUG-402": BUG_402,
  "FEAT-61": FEAT_61,
};

export function getTicketWorkspace(ticketId?: string): TicketWorkspace {
  const id = ticketId?.trim();
  if (id && TICKET_WORKSPACES[id]) {
    return TICKET_WORKSPACES[id];
  }
  return BUG_221;
}

export function filesMapForTicket(ticketId?: string): Record<string, string> {
  const ws = getTicketWorkspace(ticketId);
  return Object.fromEntries(ws.files.map((f) => [f.path, f.content]));
}

export function languageForPath(path: string, ticketId?: string): WorkspaceLanguage {
  const ws = getTicketWorkspace(ticketId);
  return ws.files.find((f) => f.path === path)?.language ?? "javascript";
}

// Legacy export — payment bug workspace only
export const WORKSPACE_FILES = BUG_221.files;
export const DEFAULT_WORKSPACE_PATH = BUG_221.defaultPath;
