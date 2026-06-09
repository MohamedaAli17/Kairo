import Link from "next/link";
import { prReview } from "@/lib/mock-data";

const statusIcon: Record<string, string> = {
  Good: "text-emerald-600",
  "Needs Improvement": "text-accent-dark",
  "Approved with suggestions": "text-emerald-600",
};

export default function ReviewPage({ params }: { params: { id: string } }) {
  const review = prReview;

  return (
    <div className="p-4 md:p-6">
      <Link href="/workspace" className="text-sm font-semibold text-accent hover:underline">
        ← Back to PRs
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted">PR #{params.id}</span>
            <span className="q-chip bg-accent-soft text-accent-dark">
              {review.status}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{review.title}</h1>
        </div>
      </header>

      <div className="mt-6 flex gap-1 border-b border-black/5">
        {["AI Review", "Changes", "Conversation"].map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2.5 text-sm font-medium ${
              i === 0 ? "border-b-2 border-accent text-accent" : "text-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <section className="q-card p-6">
          <p className="text-sm font-semibold text-ink">{review.reviewer}</p>
          <ol className="mt-4 space-y-4">
            {review.suggestions.map((item, i) => (
              <li key={item.title} className="text-sm">
                <span className="font-semibold text-ink">
                  {i + 1}. {item.title}
                </span>
                <p className="mt-1 text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(review.summary).map(([key, value]) => (
            <div key={key} className="q-card p-4">
              <p className="text-xs capitalize text-muted">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className={`mt-1 text-sm font-semibold ${statusIcon[value] ?? "text-ink"}`}>{value}</p>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="q-btn-ghost border-red-200 text-red-600 hover:bg-red-50"
          >
            Request Changes
          </button>
          <button
            type="button"
            className="q-btn"
          >
            Approve &amp; Merge
          </button>
        </div>
      </div>
    </div>
  );
}
