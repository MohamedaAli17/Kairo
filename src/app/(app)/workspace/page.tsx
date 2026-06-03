import Link from "next/link";
import { sampleCode, workspaceFiles } from "@/lib/mock-data";

export default function WorkspacePage() {
  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-slate-500">Repository</span>
            <select className="rounded-lg border border-slate-200 px-2 py-1.5 font-medium text-slate-800">
              <option>fintech-app</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-slate-500">Branch</span>
            <select className="rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs text-slate-800">
              <option>bug/fix-221-payment-error</option>
            </select>
          </label>
        </div>
        <button type="button" className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700">
          Save
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Explorer</p>
          <ul className="space-y-0.5 text-xs">
            {workspaceFiles.map((file) => (
              <li
                key={file.path}
                className={`truncate rounded px-2 py-1.5 font-mono ${
                  file.active ? "bg-indigo-100 text-indigo-800" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {file.path.split("/").pop()}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4">
            <pre className="font-mono text-sm leading-relaxed text-slate-300">
              {sampleCode.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 w-6 select-none text-right text-slate-600">{i + 1}</span>
                  <code>{line || " "}</code>
                </div>
              ))}
            </pre>
          </div>

          <div className="h-36 shrink-0 border-t border-slate-200 bg-[#1e1e1e]">
            <div className="flex gap-4 border-b border-slate-700 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <span className="text-white">Terminal</span>
              <span>Tests</span>
              <span>Output</span>
            </div>
            <p className="px-4 py-2 font-mono text-sm text-emerald-400">All tests passed ✓</p>
          </div>
        </div>

        <aside className="w-44 shrink-0 border-l border-slate-200 bg-white p-3">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Actions</p>
          <div className="space-y-2">
            {["Run Tests", "Lint Code", "Format Code", "Commit", "Push"].map((action) => (
              <button
                key={action}
                type="button"
                className="w-full rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {action}
              </button>
            ))}
          </div>
          <Link
            href="/reviews/42"
            className="mt-4 block w-full rounded-lg bg-indigo-600 px-2 py-2 text-center text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Open PR Review
          </Link>
        </aside>
      </div>
    </div>
  );
}
