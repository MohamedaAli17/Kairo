"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { signUp, type AuthResult } from "@/lib/auth/actions";

type Plan = "free" | "pro";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="dark" className="px-7" type="submit" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

export function SignUpForm() {
  const [plan, setPlan] = useState<Plan>("free");
  const [state, formAction] = useFormState(
    async (_prev: AuthResult, formData: FormData) => signUp(formData),
    {},
  );

  return (
    <form action={formAction}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-black/5 bg-zinc-50/60 p-5">
          {state?.error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          ) : null}
          {state?.success ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{state.success}</p>
          ) : null}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Full name</span>
            <input
              name="full_name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand/40"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Username</span>
            <input
              name="username"
              type="text"
              placeholder="alexdev (optional)"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand/40"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand/40"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand/40"
            />
          </label>
          <input type="hidden" name="plan_intent" value={plan} />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setPlan("free")}
            className={`w-full rounded-2xl border p-5 text-left transition ${
              plan === "free" ? "border-brand/40 ring-2 ring-brand/20" : "border-black/10"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Free</p>
            <p className="mt-1 text-3xl font-bold text-ink">$0/month</p>
            <p className="mt-2 text-sm text-muted">Get started with core simulations.</p>
          </button>
          <button
            type="button"
            onClick={() => setPlan("pro")}
            className={`w-full rounded-2xl border p-5 text-left transition ${
              plan === "pro" ? "border-brand/40 ring-2 ring-brand/20" : "border-black/10"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Pro</p>
            <p className="mt-1 text-3xl font-bold text-ink">$29/month</p>
            <p className="mt-2 text-sm text-muted">
              Unlimited tickets + voice meetings + advanced feedback.
            </p>
          </button>
          <p className="text-xs text-muted">
            Pro billing via Stripe is coming soon. New accounts start on Free (your Supabase trigger
            seeds a free subscription).
          </p>
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
