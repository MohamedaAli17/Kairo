"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { TicketDetail } from "@/lib/tickets";

type Tab = "description" | "acceptance" | "files" | "activity";

const TABS: { id: Tab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "acceptance", label: "Acceptance Criteria" },
  { id: "files", label: "Files" },
  { id: "activity", label: "Activity" },
];

const priorityStyles = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-accent-soft text-accent-dark",
  Low: "bg-black/[0.05] text-muted",
};

const statusStyles = {
  "In Progress": "bg-blue-50 text-blue-600",
  "To Do": "bg-black/[0.05] text-muted",
  Open: "bg-accent-soft text-accent-dark",
  Done: "bg-emerald-50 text-emerald-600",
};

const fileStatusStyles = {
  modified: "bg-accent-soft text-accent-dark",
  added: "bg-emerald-50 text-emerald-600",
  context: "bg-black/[0.05] text-muted",
};

function statusStorageKey(ticketId: string) {
  return `kairo-ticket-status-${ticketId}`;
}

function criteriaStorageKey(ticketId: string) {
  return `kairo-ticket-criteria-${ticketId}`;
}

export function TicketDetailView({ ticket: initial }: { ticket: TicketDetail }) {
  const [tab, setTab] = useState<Tab>("description");
  const [status, setStatus] = useState(initial.status);
  const [assignee, setAssignee] = useState(initial.assignee);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    setTab("description");
    setActionMessage(null);
    setStatus(initial.status);
    setAssignee(initial.assignee);
    setCheckedCriteria({});

    try {
      const storedStatus = localStorage.getItem(statusStorageKey(initial.id));
      if (
        storedStatus === "In Progress" ||
        storedStatus === "Open" ||
        storedStatus === "To Do" ||
        storedStatus === "Done"
      ) {
        setStatus(storedStatus);
        if (storedStatus === "In Progress") setAssignee("Alex");
      }
      const storedCriteria = localStorage.getItem(criteriaStorageKey(initial.id));
      if (storedCriteria) {
        setCheckedCriteria(JSON.parse(storedCriteria) as Record<number, boolean>);
      }
    } catch {
      // ignore
    }
  }, [initial.id, initial.status, initial.assignee]);

  const persistStatus = useCallback(
    (next: TicketDetail["status"], nextAssignee: string) => {
      setStatus(next);
      setAssignee(nextAssignee);
      localStorage.setItem(statusStorageKey(initial.id), next);
    },
    [initial.id],
  );

  const toggleCriterion = useCallback(
    (index: number) => {
      setCheckedCriteria((prev) => {
        const next = { ...prev, [index]: !prev[index] };
        localStorage.setItem(criteriaStorageKey(initial.id), JSON.stringify(next));
        return next;
      });
    },
    [initial.id],
  );

  const handleAccept = useCallback(() => {
    persistStatus("In Progress", "Alex");
    setActionMessage("Ticket accepted — you're assigned. Open the workspace to start coding.");
    setTab("files");
  }, [persistStatus]);

  const handleReject = useCallback(() => {
    setActionMessage("Ticket declined. The AI PM will follow up with an alternative task.");
  }, []);

  const canStartWorking = status === "In Progress" || status === "Open" || status === "To Do";
  const needsAccept = status === "Open" || status === "To Do";
  const criteriaDone = initial.acceptanceCriteria.filter((_, i) => checkedCriteria[i]).length;
  const workspaceHref = `/workspace?ticket=${encodeURIComponent(initial.id)}&branch=${encodeURIComponent(initial.branch)}`;

  return (
    <div className="p-4 md:p-6">
      <Link href="/tickets" className="text-sm font-semibold text-accent hover:underline">
        ← Back to Tickets
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted">{initial.id}</span>
            <span className={`q-chip ${priorityStyles[initial.priority]}`}>
              {initial.priority}
            </span>
            <span
              className={`q-chip ${statusStyles[status] ?? "bg-black/[0.05] text-muted"}`}
            >
              {status}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{initial.title}</h1>
          <p className="mt-1 font-mono text-xs text-muted">{initial.branch}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {needsAccept ? (
            <>
              <button
                type="button"
                onClick={handleReject}
                className="q-btn-ghost"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="q-btn-dark"
              >
                Accept ticket
              </button>
            </>
          ) : null}
          {canStartWorking ? (
            <Link href={workspaceHref} className="q-btn">
              Start Working
            </Link>
          ) : null}
        </div>
      </header>

      {actionMessage ? (
        <p className="mt-4 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent-dark">
          {actionMessage}
        </p>
      ) : null}

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-black/5">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition ${
              tab === id
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-ink"
            }`}
          >
            {label}
            {id === "acceptance" && initial.acceptanceCriteria.length > 0 ? (
              <span className="ml-1.5 text-xs text-muted">
                ({criteriaDone}/{initial.acceptanceCriteria.length})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="q-card p-6">
          {tab === "description" ? (
            <DescriptionTab ticket={initial} />
          ) : null}
          {tab === "acceptance" ? (
            <AcceptanceTab
              criteria={initial.acceptanceCriteria}
              checked={checkedCriteria}
              onToggle={toggleCriterion}
            />
          ) : null}
          {tab === "files" ? (
            <FilesTab ticketId={initial.id} branch={initial.branch} files={initial.files} />
          ) : null}
          {tab === "activity" ? <ActivityTab activity={initial.activity} /> : null}
        </div>

        <aside className="q-card h-fit">
          <h3 className="text-sm font-semibold text-ink">Details</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Assignee" value={assignee} />
            <DetailRow label="Reporter" value={initial.reporter} />
            <DetailRow label="Priority" value={initial.priority} />
            <DetailRow label="Est. Effort" value={`${initial.effort} pts`} />
            <DetailRow label="Due Date" value={initial.dueDate} />
            <DetailRow label="Branch" value={initial.branch} />
          </dl>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {initial.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-medium text-muted">
                {tag}
              </span>
            ))}
          </div>
          {canStartWorking ? (
            <Link href={workspaceHref} className="q-btn mt-5 w-full">
              Open in workspace
            </Link>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function DescriptionTab({ ticket }: { ticket: TicketDetail }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-ink">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{ticket.description}</p>
      </section>

      {ticket.stepsToReproduce.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-ink">Steps to Reproduce</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
            {ticket.stepsToReproduce.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-ink">Expected Behavior</h2>
        <p className="mt-2 text-sm text-muted">{ticket.expectedBehavior}</p>
      </section>
    </div>
  );
}

function AcceptanceTab({
  criteria,
  checked,
  onToggle,
}: {
  criteria: string[];
  checked: Record<number, boolean>;
  onToggle: (index: number) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">Acceptance Criteria</h2>
      <p className="mt-1 text-xs text-muted">Check off items as you complete them in the workspace.</p>
      <ul className="mt-4 space-y-2">
        {criteria.map((item, index) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-black/[0.02] p-3 transition hover:bg-black/[0.04]">
              <input
                type="checkbox"
                checked={Boolean(checked[index])}
                onChange={() => onToggle(index)}
                className="mt-0.5 h-4 w-4 rounded border-black/20 text-accent focus:ring-accent"
              />
              <span className={`text-sm ${checked[index] ? "text-muted line-through" : "text-ink"}`}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilesTab({
  ticketId,
  branch,
  files,
}: {
  ticketId: string;
  branch: string;
  files: TicketDetail["files"];
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Related files</h2>
        <Link
          href={`/workspace?ticket=${encodeURIComponent(ticketId)}&branch=${encodeURIComponent(branch)}`}
          className="text-xs font-semibold text-accent hover:underline"
        >
          Open full workspace →
        </Link>
      </div>
      <ul className="mt-4 divide-y divide-black/5">
        {files.map((file) => (
          <li key={file.path} className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-ink">{file.path}</span>
                <span className={`q-chip capitalize ${fileStatusStyles[file.status]}`}>
                  {file.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{file.summary}</p>
            </div>
            <Link
              href={`/workspace?ticket=${encodeURIComponent(ticketId)}&branch=${encodeURIComponent(branch)}&file=${encodeURIComponent(file.path)}`}
              className="shrink-0 rounded-full border border-black/10 px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-black/[0.03]"
            >
              Open file
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityTab({ activity }: { activity: TicketDetail["activity"] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">Activity</h2>
      <ol className="mt-4 space-y-4">
        {activity.map((event, index) => (
          <li key={event.id} className="relative flex gap-3 pl-1">
            {index < activity.length - 1 ? (
              <span className="absolute left-[7px] top-6 h-[calc(100%+4px)] w-px bg-black/10" aria-hidden />
            ) : null}
            <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-sm text-ink">
                <span className="font-semibold">{event.actor}</span> {event.message}
              </p>
              <p className="mt-0.5 text-xs text-muted">{event.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="max-w-[140px] truncate text-right font-medium text-ink" title={value}>
        {value}
      </dd>
    </div>
  );
}
