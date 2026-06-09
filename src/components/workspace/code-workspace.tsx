"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import { languageForPath } from "@/lib/ticket-workspaces";
import { formatLintOutput, lintWorkspace } from "@/lib/workspace/lint";
import { formatTestOutput, runWorkspaceTests } from "@/lib/workspace/run-tests";
import {
  defaultSnapshot,
  loadWorkspaceSnapshot,
  resetWorkspaceSnapshot,
  resolveActivePath,
  saveWorkspaceSnapshot,
  type WorkspaceSnapshot,
} from "@/lib/workspace/storage";
import { runTerminalCommand, type TerminalLine } from "@/lib/workspace/terminal";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type PanelTab = "terminal" | "tests" | "output";
type FileMap = Record<string, string>;

const TICKET_HINTS: Record<string, string> = {
  "BUG-221":
    "Fix the payment controller: use paymentError from utils/errors.js and return a 4xx JSON body with a code field instead of a generic 500.",
  "BUG-123":
    "Fix usePagination.ts: only reset page to 1 when the filter changes — remove sort from that useEffect dependency array.",
  "FEAT-45":
    "Add Zod validation in profile.ts (bio max 280) and call profileUpdateSchema.parse in the PATCH route before saving.",
  "BUG-304":
    "In refreshToken.ts, reuse a single refreshPromise so concurrent callers await the same in-flight refresh.",
  "BUG-188":
    "In cartTotal.ts, apply the discount before calculating tax (tax on discounted subtotal).",
  "FEAT-52":
    "Implement rateLimit.ts: return 429 with Retry-After when over limit; skip /health.",
  "BUG-402":
    "Add https://staging.kairo.app to cors origins and set credentials: true.",
  "FEAT-61":
    "Implement deliverWebhook with retries, exponential backoff, and MAX_ATTEMPTS.",
};

function fileName(path: string) {
  return path.split("/").pop() ?? path;
}

export function CodeWorkspace({
  ticketId,
  branch: branchParam,
  initialFile,
}: {
  ticketId?: string;
  branch?: string;
  initialFile?: string;
}) {
  const baseSnapshot = defaultSnapshot(ticketId, branchParam);
  const [hydrated, setHydrated] = useState(false);
  const [files, setFiles] = useState<FileMap>(() => baseSnapshot.files);
  const [savedFiles, setSavedFiles] = useState<FileMap>(() => baseSnapshot.savedFiles);
  const [activePath, setActivePath] = useState(
    initialFile && baseSnapshot.files[initialFile] ? initialFile : baseSnapshot.activePath,
  );
  const [branch, setBranch] = useState(baseSnapshot.branch);
  const [panelTab, setPanelTab] = useState<PanelTab>("tests");
  const [testOutput, setTestOutput] = useState("Run tests to see results.");
  const [lintOutput, setLintOutput] = useState("Run lint to see results.");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: "output", text: "Kairo workspace shell — type help for commands." },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [testsPassed, setTestsPassed] = useState(false);
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const dirtyPaths = useMemo(
    () => new Set(Object.keys(files).filter((path) => files[path] !== savedFiles[path])),
    [files, savedFiles],
  );
  const isDirty = dirtyPaths.size > 0;
  const canOpenPr = testsPassed && !isDirty;

  const snapshot = useMemo<WorkspaceSnapshot>(
    () => ({ files, savedFiles, activePath, branch, lastTestPassed: testsPassed }),
    [files, savedFiles, activePath, branch, testsPassed],
  );

  const filePaths = useMemo(() => Object.keys(files).sort(), [files]);

  useEffect(() => {
    const stored = loadWorkspaceSnapshot(ticketId);
    const base = defaultSnapshot(ticketId, branchParam);

    if (stored) {
      setFiles(stored.files);
      setSavedFiles(stored.savedFiles);
      setActivePath(
        resolveActivePath(
          initialFile ?? stored.activePath,
          stored.files,
          base.activePath,
        ),
      );
      setBranch(branchParam ?? stored.branch);
      setTestsPassed(stored.lastTestPassed);
      setTestOutput(formatTestOutput(runWorkspaceTests(stored.files, ticketId)));
    } else {
      setFiles(base.files);
      setSavedFiles(base.savedFiles);
      setActivePath(resolveActivePath(initialFile, base.files, base.activePath));
      setBranch(base.branch);
      setTestOutput(formatTestOutput(runWorkspaceTests(base.files, ticketId)));
    }
    setHydrated(true);
  }, [ticketId, branchParam, initialFile]);

  useEffect(() => {
    if (!hydrated) return;
    saveWorkspaceSnapshot(snapshot, ticketId);
  }, [snapshot, hydrated, ticketId]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) return;
      setFiles((prev) => ({ ...prev, [activePath]: value }));
      setSaveHint(null);
      setTestsPassed(false);
    },
    [activePath],
  );

  const handleSaveAll = useCallback(() => {
    setSavedFiles({ ...files });
    setSaveHint("All files saved");
    window.setTimeout(() => setSaveHint(null), 2000);
  }, [files]);

  const handleRunTests = useCallback(() => {
    const summary = runWorkspaceTests(files, ticketId);
    setTestOutput(formatTestOutput(summary));
    setTestsPassed(summary.allPassed);
    setPanelTab("tests");
  }, [files]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveAll();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunTests();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSaveAll, handleRunTests]);

  const handleLint = useCallback(() => {
    const issues = lintWorkspace(files, ticketId);
    setLintOutput(formatLintOutput(issues));
    setPanelTab("output");
  }, [files]);

  const handleFormat = useCallback(async () => {
    const action = editorRef.current?.getAction("editor.action.formatDocument");
    if (action) {
      await action.run();
      const model = editorRef.current?.getModel();
      if (model) {
        setFiles((prev) => ({ ...prev, [activePath]: model.getValue() }));
      }
    }
  }, [activePath]);

  const handleCommit = useCallback(() => {
    if (isDirty) {
      setPanelTab("terminal");
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: "Commit blocked: save all modified files first." },
      ]);
      return;
    }
    setPanelTab("terminal");
    setTerminalLines((prev) => [
      ...prev,
      { type: "output", text: `Committed on branch "${branch}"` },
    ]);
  }, [branch, isDirty]);

  const handlePush = useCallback(() => {
    if (!testsPassed) {
      setPanelTab("terminal");
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: "Push blocked: run tests and fix failures first." },
      ]);
      return;
    }
    if (isDirty) {
      setPanelTab("terminal");
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: "Push blocked: save all files first." },
      ]);
      return;
    }
    setPanelTab("terminal");
    setTerminalLines((prev) => [
      ...prev,
      { type: "output", text: "Pushed to origin. Ready for PR review." },
    ]);
  }, [isDirty, testsPassed]);

  const handleReset = useCallback(() => {
    const fresh = resetWorkspaceSnapshot(ticketId, branchParam);
    setFiles(fresh.files);
    setSavedFiles(fresh.savedFiles);
    setActivePath(fresh.activePath);
    setBranch(fresh.branch);
    setTestsPassed(false);
    const summary = runWorkspaceTests(fresh.files, ticketId);
    setTestOutput(formatTestOutput(summary));
    setLintOutput("Run lint to see results.");
  }, [ticketId, branchParam]);

  const submitTerminal = useCallback(() => {
    const value = terminalInput.trim();
    if (!value) return;

    const result = runTerminalCommand(value, {
      snapshot,
      ticketId,
      onSaveAll: handleSaveAll,
      onFormat: () => void handleFormat(),
      onTestsRun: (output, allPassed) => {
        setTestOutput(output);
        setTestsPassed(allPassed);
        setPanelTab("tests");
      },
      onLintRun: (output) => {
        setLintOutput(output);
        setPanelTab("output");
      },
      onReset: handleReset,
    });

    setTerminalInput("");
    if (result.clear) {
      setTerminalLines([]);
      return;
    }
    setTerminalLines((prev) => [...prev, ...result.lines]);
    setPanelTab("terminal");
  }, [terminalInput, snapshot, ticketId, handleSaveAll, handleFormat, handleReset]);

  const switchFile = useCallback(
    (path: string) => {
      if (path === activePath) return;
      setActivePath(path);
    },
    [activePath],
  );

  const ticketHint = ticketId ? TICKET_HINTS[ticketId] : null;

  if (!hydrated) {
    return (
      <div className="flex h-[calc(100vh-0px)] items-center justify-center bg-[#1e1e1e] text-sm text-slate-400">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col p-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-t-3xl bg-white px-5 py-3.5 shadow-soft">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {ticketId ? (
            <Link
              href={`/tickets/${ticketId}`}
              className="text-xs font-semibold text-accent hover:underline"
            >
              ← {ticketId}
            </Link>
          ) : null}
          <label className="flex items-center gap-2">
            <span className="text-muted">Repository</span>
            <select
              className="rounded-full border border-black/10 px-3 py-1.5 font-medium text-ink"
              value="fintech-app"
              onChange={() => {}}
            >
              <option value="fintech-app">fintech-app</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted">Branch</span>
            <select
              className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-xs text-ink"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value={branch}>{branch}</option>
              {branch !== "main" ? <option value="main">main</option> : null}
            </select>
          </label>
          {ticketId ? (
            <span className="q-chip bg-accent-soft font-mono text-accent-dark">
              {ticketId}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[10px] text-muted sm:inline">⌘S save · ⌘↵ test</span>
          {saveHint ? (
            <span className="text-xs font-semibold text-emerald-600">{saveHint}</span>
          ) : isDirty ? (
            <span className="text-xs font-medium text-accent">
              {dirtyPaths.size} unsaved file{dirtyPaths.size === 1 ? "" : "s"}
            </span>
          ) : (
            <span className="text-xs text-muted">Saved</span>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            className="q-btn px-5 py-2"
          >
            Save all
          </button>
        </div>
      </header>

      {ticketHint ? (
        <div className="bg-accent-soft px-5 py-2.5 text-xs text-accent-dark">
          <span className="font-semibold">Task: </span>
          {ticketHint}
        </div>
      ) : null}

      <div className="flex flex-1 overflow-hidden rounded-b-3xl shadow-soft">
        <aside className="w-56 shrink-0 overflow-y-auto bg-white p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
            Explorer
          </p>
          <ul className="space-y-0.5 text-xs">
            {filePaths.map((path) => {
              const active = path === activePath;
              const dirty = dirtyPaths.has(path);
              return (
                <li key={path}>
                  <button
                    type="button"
                    onClick={() => switchFile(path)}
                    className={`flex w-full items-center gap-1 truncate rounded-xl px-2.5 py-2 text-left font-mono transition ${
                      active
                        ? "bg-accent-soft text-accent-dark"
                        : "text-ink/70 hover:bg-black/[0.03]"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{fileName(path)}</span>
                    {dirty ? <span className="text-accent">●</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-700 bg-[#252526] px-3 py-1.5">
            <span className="font-mono text-xs text-slate-300">{activePath}</span>
            {dirtyPaths.has(activePath) ? <span className="text-[10px] text-slate-500">●</span> : null}
          </div>

          <div className="min-h-0 flex-1">
            <MonacoEditor
              path={activePath}
              language={languageForPath(activePath, ticketId)}
              theme="vs-dark"
              value={files[activePath] ?? ""}
              onChange={handleEditorChange}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 20,
                padding: { top: 12 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                formatOnPaste: true,
              }}
            />
          </div>

          <div className="flex h-40 shrink-0 flex-col border-t border-slate-200 bg-[#1e1e1e]">
            <div className="flex gap-4 border-b border-slate-700 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {(["terminal", "tests", "output"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPanelTab(tab)}
                  className={panelTab === tab ? "text-white" : "hover:text-slate-300"}
                >
                  {tab}
                  {tab === "tests" && testsPassed ? " ✓" : null}
                </button>
              ))}
            </div>

            {panelTab === "terminal" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-auto px-4 py-2">
                  {terminalLines.map((line, i) => (
                    <p
                      key={`${i}-${line.text.slice(0, 12)}`}
                      className={`whitespace-pre-wrap font-mono text-xs leading-relaxed ${
                        line.type === "input"
                          ? "text-slate-300"
                          : line.type === "error"
                            ? "text-red-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
                <form
                  className="flex shrink-0 border-t border-slate-700"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitTerminal();
                  }}
                >
                  <span className="px-3 py-2 font-mono text-xs text-slate-500">$</span>
                  <input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="help, test, lint, save, git status…"
                    className="min-w-0 flex-1 bg-transparent py-2 font-mono text-xs text-slate-200 outline-none placeholder:text-slate-600"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </form>
              </div>
            ) : (
              <pre
                className={`min-h-0 flex-1 overflow-auto whitespace-pre-wrap px-4 py-2 font-mono text-xs leading-relaxed ${
                  panelTab === "tests" && !testsPassed && testOutput.includes("failed")
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {panelTab === "tests" ? testOutput : lintOutput}
              </pre>
            )}
          </div>
        </div>

        <aside className="w-44 shrink-0 bg-white p-3">
          <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
            Actions
          </p>
          <div className="space-y-2">
            <ActionButton label="Run Tests" onClick={handleRunTests} />
            <ActionButton label="Lint Code" onClick={handleLint} />
            <ActionButton label="Format Code" onClick={() => void handleFormat()} />
            <ActionButton label="Commit" onClick={handleCommit} />
            <ActionButton label="Push" onClick={handlePush} disabled={!testsPassed} />
          </div>
          {canOpenPr ? (
            <Link
              href="/reviews/42"
              className="q-btn mt-4 w-full px-2 py-2 text-xs"
            >
              Open PR Review
            </Link>
          ) : (
            <p className="mt-4 rounded-2xl bg-black/[0.03] px-2 py-2 text-center text-[10px] leading-snug text-muted">
              Pass all tests and save files to open PR review
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full border border-black/10 px-2 py-2 text-xs font-semibold text-ink transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
