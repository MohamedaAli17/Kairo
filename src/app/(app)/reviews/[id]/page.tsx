import Link from "next/link";
import { prReview } from "@/lib/mock-data";

const statusIcon: Record<string, string> = {
  Good: "text-emerald-600",
  "Needs Improvement": "text-amber-600",
  "Approved with suggestions": "text-emerald-600",
};

export default function ReviewPage({ params }: { params: { id: string } }) {
  const review = prReview;

  return (
    <div className="p-6 md:p-8">
      <Link href="/workspace" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to PRs
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-500">PR #{params.id}</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              {review.status}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{review.title}</h1>
        </div>
      </header>

      <div className="mt-6 flex gap-1 border-b border-slate-200">
        {["AI Review", "Changes", "Conversation"].map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2.5 text-sm font-medium ${
              i === 0 ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">{review.reviewer}</p>
          <ol className="mt-4 space-y-4">
            {review.suggestions.map((item, i) => (
              <li key={item.title} className="text-sm">
                <span className="font-semibold text-slate-900">
                  {i + 1}. {item.title}
                </span>
                <p className="mt-1 text-slate-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(review.summary).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs capitalize text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className={`mt-1 text-sm font-semibold ${statusIcon[value] ?? "text-slate-900"}`}>{value}</p>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg border-2 border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Request Changes
          </button>
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Approve & Merge
          </button>
        </div>
      </div>
    </div>
  );
}
