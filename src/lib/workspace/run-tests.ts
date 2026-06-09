export type TestResult = {
  name: string;
  passed: boolean;
  message?: string;
};

export type TestRunSummary = {
  results: TestResult[];
  passed: number;
  failed: number;
  allPassed: boolean;
};

type FileMap = Record<string, string>;

export function runWorkspaceTests(files: FileMap, ticketId?: string): TestRunSummary {
  switch (ticketId) {
    case "BUG-123":
      return runPaginationTests(files);
    case "FEAT-45":
      return runProfileTests(files);
    case "BUG-304":
      return runAuthRefreshTests(files);
    case "BUG-188":
      return runCartTotalTests(files);
    case "FEAT-52":
      return runRateLimitTests(files);
    case "BUG-402":
      return runCorsTests(files);
    case "FEAT-61":
      return runWebhookTests(files);
    default:
      return runPaymentTests(files);
  }
}

function runPaymentTests(files: FileMap): TestRunSummary {
  const controller = files["src/controllers/paymentController.js"] ?? "";
  const service = files["src/services/paymentService.js"] ?? "";
  const errors = files["src/utils/errors.js"] ?? "";
  const routes = files["src/routes/payments.js"] ?? "";

  const results: TestResult[] = [
    {
      name: "paymentService validates required fields",
      passed:
        service.includes("cardToken") &&
        service.includes("amount") &&
        (service.includes("throw") || service.includes("Error")),
      message: "charge() should reject missing cardToken or amount",
    },
    {
      name: "errors.js exports paymentError helper",
      passed: errors.includes("paymentError") && errors.includes("module.exports"),
      message: "Add paymentError(code, message) in src/utils/errors.js",
    },
    {
      name: "payments route wires POST handler",
      passed:
        routes.includes("processPayment") &&
        routes.includes("router.post") &&
        routes.includes("module.exports"),
      message: "Route should POST to processPayment",
    },
    {
      name: "paymentController avoids generic 500 Payment failed",
      passed: !hasGenericPaymentFailure(controller),
      message: 'Replace res.status(500).json({ error: "Payment failed" }) with structured errors',
    },
    {
      name: "paymentController returns structured error payload",
      passed: hasStructuredPaymentErrors(controller, errors),
      message:
        "Import paymentError or return JSON with a code field and a 4xx status in the catch block",
    },
  ];

  return summarize(results);
}

function runPaginationTests(files: FileMap): TestRunSummary {
  const hook = files["src/hooks/usePagination.ts"] ?? "";
  const list = files["src/components/ProductList.tsx"] ?? "";

  const results: TestResult[] = [
    {
      name: "usePagination resets page only when filter changes",
      passed: paginationResetOnlyOnFilter(hook),
      message: "Remove sort from the useEffect dependency array that calls setPage(1)",
    },
    {
      name: "usePagination exposes page, setPage, and offset",
      passed:
        hook.includes("setPage") && hook.includes("offset") && hook.includes("totalPages"),
      message: "Hook should return page controls and offset for slicing",
    },
    {
      name: "ProductList uses usePagination hook",
      passed: list.includes("usePagination") && list.includes("ProductList"),
      message: "ProductList should import and call usePagination",
    },
    {
      name: "ProductList renders pagination controls",
      passed: list.includes("Prev") && list.includes("Next") && list.includes("setPage"),
      message: "Add prev/next buttons wired to setPage",
    },
  ];

  return summarize(results);
}

function runProfileTests(files: FileMap): TestRunSummary {
  const routes = files["src/routes/profile.ts"] ?? "";
  const schema = files["src/schemas/profile.ts"] ?? "";
  const service = files["src/services/profileService.ts"] ?? "";

  const results: TestResult[] = [
    {
      name: "Profile routes expose GET and PATCH",
      passed: routes.includes(".get(") && routes.includes(".patch("),
      message: "Add GET / and PATCH / handlers on the profile router",
    },
    {
      name: "Schema validates bio max 280 characters",
      passed:
        (schema.includes("280") || schema.includes("max(")) &&
        (schema.includes("bio") || schema.includes("Bio")),
      message: "profileUpdateSchema should enforce bio length ≤ 280",
    },
    {
      name: "PATCH route validates with profileUpdateSchema",
      passed:
        routes.includes("profileUpdateSchema") &&
        (routes.includes(".parse(") || routes.includes("safeParse")),
      message: "Call profileUpdateSchema.parse/safeParse on req.body before update",
    },
    {
      name: "profileService exports get and update helpers",
      passed:
        service.includes("getProfileForUser") && service.includes("updateProfileForUser"),
      message: "Service should export getProfileForUser and updateProfileForUser",
    },
  ];

  return summarize(results);
}

function summarize(results: TestResult[]): TestRunSummary {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { results, passed, failed, allPassed: failed === 0 };
}

function hasGenericPaymentFailure(code: string): boolean {
  return (
    code.includes('"Payment failed"') &&
    (code.includes("status(500)") || code.includes("status: 500"))
  );
}

function hasStructuredPaymentErrors(controller: string, errorsFile: string): boolean {
  const usesHelper =
    controller.includes("paymentError") ||
    (controller.includes("../utils/errors") && controller.includes("require"));

  const structuredResponse =
    /res\.status\(\s*(4\d{2}|err\.status)/.test(controller) &&
    (controller.includes("code:") || controller.includes(".code"));

  return usesHelper || structuredResponse || errorsFile.includes("paymentError");
}

function runAuthRefreshTests(files: FileMap): TestRunSummary {
  const refresh = files["src/auth/refreshToken.ts"] ?? "";
  const results: TestResult[] = [
    {
      name: "refreshAccessToken uses shared in-flight promise",
      passed:
        refresh.includes("refreshPromise") &&
        (refresh.includes("if (refreshPromise)") || refresh.includes("refreshPromise ??=")),
      message: "Store and reuse refreshPromise so concurrent calls share one fetch",
    },
    {
      name: "Promise cleared after success or failure",
      passed: refresh.includes("clearRefreshLock") || refresh.includes("refreshPromise = null"),
      message: "Reset refreshPromise in finally block after refresh completes",
    },
    {
      name: "Returns access token from refresh response",
      passed: refresh.includes("accessToken"),
      message: "Parse and return accessToken from API response",
    },
  ];
  return summarize(results);
}

function runCartTotalTests(files: FileMap): TestRunSummary {
  const calc = files["src/utils/cartTotal.ts"] ?? "";
  const results: TestResult[] = [
    {
      name: "Discount applied before tax",
      passed:
        calc.includes("discount") &&
        (calc.indexOf("discount") < calc.indexOf("tax") ||
          calc.includes("discountedSubtotal") ||
          calc.includes("subtotal - discount") ||
          calc.includes("subtotal * (1 -")),
      message: "Compute tax on subtotal after subtracting discount",
    },
    {
      name: "Returns subtotal, discount, tax, and total",
      passed:
        calc.includes("subtotal") &&
        calc.includes("tax") &&
        calc.includes("total"),
      message: "Return all line items for CartSummary",
    },
    {
      name: "Rejects or guards negative totals",
      passed:
        calc.includes("Math.max") ||
        calc.includes("total < 0") ||
        calc.includes("throw"),
      message: "Ensure total cannot go negative",
    },
  ];
  return summarize(results);
}

function runRateLimitTests(files: FileMap): TestRunSummary {
  const mw = files["src/middleware/rateLimit.ts"] ?? "";
  const app = files["src/app.ts"] ?? "";
  const results: TestResult[] = [
    {
      name: "Returns 429 when limit exceeded",
      passed: mw.includes("429") && (mw.includes("status(429)") || mw.includes(".status(429)")),
      message: "Send res.status(429) when request count exceeds limit",
    },
    {
      name: "Sets Retry-After header",
      passed: mw.includes("Retry-After") || mw.includes("retry-after"),
      message: 'Set res.setHeader("Retry-After", seconds)',
    },
    {
      name: "/health exempt from rate limiting",
      passed:
        (mw.includes("/health") || mw.includes("health")) &&
        (app.includes('app.get("/health"') || app.includes("before") || mw.includes("req.path")),
      message: "Skip rate limit for health check route",
    },
  ];
  return summarize(results);
}

function runCorsTests(files: FileMap): TestRunSummary {
  const cors = files["src/config/cors.ts"] ?? "";
  const results: TestResult[] = [
    {
      name: "Staging origin allowed",
      passed: cors.includes("staging.kairo.app"),
      message: 'Add "https://staging.kairo.app" to allowed origins',
    },
    {
      name: "Credentials enabled for cookie auth",
      passed: cors.includes("credentials: true"),
      message: "Set credentials: true in cors options",
    },
    {
      name: "OPTIONS method supported",
      passed: cors.includes("OPTIONS"),
      message: "Include OPTIONS in allowed methods for preflight",
    },
  ];
  return summarize(results);
}

function runWebhookTests(files: FileMap): TestRunSummary {
  const worker = files["src/workers/webhookRetry.ts"] ?? "";
  const results: TestResult[] = [
    {
      name: "Retries up to MAX_ATTEMPTS",
      passed:
        worker.includes("MAX_ATTEMPTS") &&
        (worker.includes("for") || worker.includes("while")) &&
        worker.includes("attempt"),
      message: "Loop retries until success or max attempts",
    },
    {
      name: "Uses exponential backoff delays",
      passed:
        worker.includes("backoff") ||
        worker.includes("Math.pow(2") ||
        worker.includes("* 1000") ||
        worker.includes("delay"),
      message: "Wait 1s, 2s, 4s, 8s, 16s between retries",
    },
    {
      name: "Retries on failure status or network error",
      passed:
        worker.includes("!res.ok") ||
        worker.includes(">= 500") ||
        worker.includes("catch"),
      message: "Retry when response is 5xx or fetch throws",
    },
  ];
  return summarize(results);
}

function paginationResetOnlyOnFilter(hook: string): boolean {
  const effectMatch = hook.match(
    /useEffect\(\(\)\s*=>\s*\{[\s\S]*?setPage\(1\)[\s\S]*?\},\s*\[([^\]]*)\]\)/,
  );
  if (!effectMatch) return false;
  const deps = effectMatch[1];
  return deps.includes("filter") && !deps.includes("sort");
}

export function formatTestOutput(summary: TestRunSummary): string {
  const lines = summary.results.map((r) => {
    const icon = r.passed ? "✓" : "✗";
    const detail = r.passed ? "" : `\n    ${r.message ?? "Failed"}`;
    return `${icon} ${r.name}${detail}`;
  });

  lines.push("");
  if (summary.allPassed) {
    lines.push(`All tests passed (${summary.passed} passed)`);
  } else {
    lines.push(`${summary.failed} failed, ${summary.passed} passed`);
  }

  return lines.join("\n");
}
