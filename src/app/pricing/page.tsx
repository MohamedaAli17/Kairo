import { Check } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try Kairo and run your first realistic engineering simulations.",
    cta: "Start free",
    highlighted: false,
    features: [
      "3 tickets per day",
      "Text-based standups",
      "Basic PR review feedback",
      "1 simulation track",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious interview prep and internship readiness.",
    cta: "Get Pro",
    highlighted: true,
    features: [
      "Unlimited tickets",
      'Voice meetings (standups + incident calls)',
      "Advanced AI review with detailed comments",
      "All simulation tracks",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For bootcamps and small cohorts training together.",
    cta: "Contact sales",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Up to 10 users",
      "Shared progress dashboard",
      "Cohort analytics",
      "Admin controls",
    ],
  },
];

const benefits = [
  {
    title: "Real-world workflows",
    body: "Practice realistic engineering loops with scoped tickets, acceptance criteria, and review cycles instead of disconnected coding drills.",
  },
  {
    title: "Communication under pressure",
    body: "Run standups, planning check-ins, and incident updates that strengthen how you report progress and unblock teammates.",
  },
  {
    title: "Structured AI mentorship",
    body: "Receive role-based feedback from PM, Tech Lead, and QA personas so you improve both implementation and collaboration habits.",
  },
  {
    title: "Interview and internship readiness",
    body: "Build confidence by rehearsing the exact situations companies evaluate: debugging, prioritization, code quality, and team communication.",
  },
  {
    title: "Clear skill progression",
    body: "Track growth across execution speed, review quality, and communication so you always know what to improve next.",
  },
  {
    title: "Portfolio-grade practice",
    body: "Complete meaningful ticket histories you can discuss in interviews as evidence of practical software engineering judgment.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 pb-16 pt-28 md:px-6">
      <Navbar />

      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-ink md:text-7xl">
            Pricing that grows
            <br />
            with your journey
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted">
            Start free, upgrade when you want deeper simulations, voice meetings,
            and advanced feedback.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border bg-white p-7 shadow-soft ${
                plan.highlighted
                  ? "border-brand/40 ring-2 ring-brand/20"
                  : "border-black/5"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                {plan.name}
              </p>
              <p className="mt-3 text-5xl font-bold tracking-tight text-ink">
                {plan.price}
                <span className="text-lg font-medium text-muted">{plan.period}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {plan.description}
              </p>

              <Button
                variant={plan.highlighted ? "brand" : "dark"}
                className="mt-6 w-full justify-center"
              >
                {plan.cta}
              </Button>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft">
        <div className="border-b border-black/5 bg-[radial-gradient(circle_at_top_right,rgba(124,92,252,0.12),transparent_50%)] px-8 py-8 md:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Why learners choose Kairo
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
            Kairo is designed for students and early-career developers who want
            more than solved exercises. It builds the practical habits that
            hiring teams look for in real software engineers.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-ink">
              Tickets
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-ink">
              Standups
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-ink">
              PR Reviews
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-ink">
              Incident Simulations
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-8 md:grid-cols-2 md:p-10">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-black/5 bg-zinc-50/70 p-5"
            >
              <p className="text-lg font-semibold tracking-tight text-ink">
                {benefit.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {benefit.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
