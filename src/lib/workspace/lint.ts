export type LintIssue = {
  file: string;
  line?: number;
  severity: "error" | "warning";
  message: string;
};

export function lintWorkspace(files: Record<string, string>, ticketId?: string): LintIssue[] {
  switch (ticketId) {
    case "BUG-123":
      return lintPagination(files);
    case "FEAT-45":
      return lintProfile(files);
    case "BUG-304":
      return lintAuthRefresh(files);
    case "BUG-188":
      return lintCartTotal(files);
    case "FEAT-52":
      return lintRateLimit(files);
    case "BUG-402":
      return lintCors(files);
    case "FEAT-61":
      return lintWebhook(files);
    default:
      return lintPayment(files);
  }
}

function lintPayment(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const controller = files["src/controllers/paymentController.js"];

  if (controller) {
    if (controller.includes("console.error(err)") && !controller.includes("transactionId")) {
      issues.push({
        file: "src/controllers/paymentController.js",
        line: lineNumber(controller, "console.error"),
        severity: "warning",
        message: "Prefer structured logging with transaction context.",
      });
    }
    if (
      controller.includes("catch (err)") &&
      !controller.includes("paymentError") &&
      !controller.includes("err.code")
    ) {
      issues.push({
        file: "src/controllers/paymentController.js",
        severity: "warning",
        message: "Catch block should map errors via paymentError or err.code.",
      });
    }
  }

  const service = files["src/services/paymentService.js"];
  if (service && !service.includes("amount == null") && !service.includes("amount ===")) {
    issues.push({
      file: "src/services/paymentService.js",
      severity: "warning",
      message: "Validate amount explicitly (null/undefined).",
    });
  }

  return issues;
}

function lintPagination(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const hook = files["src/hooks/usePagination.ts"];

  if (hook?.includes("[filter, sort]") || hook?.includes("[filter,sort]")) {
    issues.push({
      file: "src/hooks/usePagination.ts",
      severity: "warning",
      message: "Page reset effect should not depend on sort — only filter.",
    });
  }

  const list = files["src/components/ProductList.tsx"];
  if (list && !list.includes("disabled={page")) {
    issues.push({
      file: "src/components/ProductList.tsx",
      severity: "warning",
      message: "Disable prev/next buttons at pagination boundaries.",
    });
  }

  return issues;
}

function lintAuthRefresh(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const refresh = files["src/auth/refreshToken.ts"];
  if (refresh && !refresh.includes("refreshPromise")) {
    issues.push({
      file: "src/auth/refreshToken.ts",
      severity: "warning",
      message: "Add shared refreshPromise to prevent parallel refresh calls.",
    });
  }
  return issues;
}

function lintCartTotal(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const calc = files["src/utils/cartTotal.ts"];
  if (calc?.includes("subtotal + tax - discount")) {
    issues.push({
      file: "src/utils/cartTotal.ts",
      severity: "warning",
      message: "Tax should be calculated on discounted subtotal, not raw subtotal.",
    });
  }
  return issues;
}

function lintRateLimit(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const mw = files["src/middleware/rateLimit.ts"];
  if (mw?.includes("TODO")) {
    issues.push({
      file: "src/middleware/rateLimit.ts",
      severity: "warning",
      message: "Complete rate limit implementation before merge.",
    });
  }
  return issues;
}

function lintCors(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const cors = files["src/config/cors.ts"];
  if (cors?.includes("credentials: false")) {
    issues.push({
      file: "src/config/cors.ts",
      severity: "warning",
      message: "Enable credentials: true for cookie-based auth on staging.",
    });
  }
  return issues;
}

function lintWebhook(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const worker = files["src/workers/webhookRetry.ts"];
  if (worker?.includes("TODO")) {
    issues.push({
      file: "src/workers/webhookRetry.ts",
      severity: "warning",
      message: "Implement retry loop with exponential backoff.",
    });
  }
  return issues;
}

function lintProfile(files: Record<string, string>): LintIssue[] {
  const issues: LintIssue[] = [];
  const routes = files["src/routes/profile.ts"];
  const schema = files["src/schemas/profile.ts"];

  if (routes?.includes("TODO: validate") || (routes?.includes("patch") && !routes.includes("profileUpdateSchema"))) {
    issues.push({
      file: "src/routes/profile.ts",
      severity: "warning",
      message: "PATCH handler should validate body with profileUpdateSchema.",
    });
  }

  if (schema?.includes("TODO")) {
    issues.push({
      file: "src/schemas/profile.ts",
      severity: "warning",
      message: "Replace stub schema with Zod validation (bio max 280).",
    });
  }

  return issues;
}

export function formatLintOutput(issues: LintIssue[]): string {
  if (issues.length === 0) return "No lint issues found.";
  return issues
    .map((i) => {
      const loc = i.line ? `${i.file}:${i.line}` : i.file;
      return `${i.severity}  ${loc}  ${i.message}`;
    })
    .join("\n");
}

function lineNumber(source: string, needle: string): number | undefined {
  const idx = source.indexOf(needle);
  if (idx < 0) return undefined;
  return source.slice(0, idx).split("\n").length;
}
