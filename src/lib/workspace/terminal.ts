import { formatLintOutput, lintWorkspace } from "@/lib/workspace/lint";
import { formatTestOutput, runWorkspaceTests } from "@/lib/workspace/run-tests";
import type { WorkspaceSnapshot } from "@/lib/workspace/storage";

export type TerminalLine = {
  type: "input" | "output" | "error";
  text: string;
};

type CommandContext = {
  snapshot: WorkspaceSnapshot;
  ticketId?: string;
  onSaveAll: () => void;
  onFormat: () => void;
  onTestsRun: (output: string, allPassed: boolean) => void;
  onLintRun: (output: string) => void;
  onReset: () => void;
};

export function runTerminalCommand(
  raw: string,
  ctx: CommandContext,
): { lines: TerminalLine[]; clear?: boolean } {
  const cmd = raw.trim();
  if (!cmd) return { lines: [] };

  const inputLine: TerminalLine = { type: "input", text: `$ ${cmd}` };

  if (cmd === "clear") {
    return { lines: [], clear: true };
  }

  if (cmd === "help") {
    return {
      lines: [
        inputLine,
        {
          type: "output",
          text: [
            "Available commands:",
            "  help              Show this message",
            "  clear             Clear terminal",
            "  test              Run project tests",
            "  npm test          Alias for test",
            "  lint              Lint all workspace files",
            "  format            Format active file",
            "  save              Save all files",
            "  git status        Show changed files",
            "  git commit -m \"\"  Commit (requires saved files)",
            "  reset             Reset workspace to starter files",
          ].join("\n"),
        },
      ],
    };
  }

  if (cmd === "test" || cmd === "npm test") {
    const summary = runWorkspaceTests(ctx.snapshot.files, ctx.ticketId);
    const output = formatTestOutput(summary);
    ctx.onTestsRun(output, summary.allPassed);
    return {
      lines: [inputLine, { type: summary.allPassed ? "output" : "error", text: output }],
    };
  }

  if (cmd === "lint") {
    const issues = lintWorkspace(ctx.snapshot.files, ctx.ticketId);
    const output = formatLintOutput(issues);
    ctx.onLintRun(output);
    return { lines: [inputLine, { type: "output", text: output }] };
  }

  if (cmd === "format") {
    ctx.onFormat();
    return { lines: [inputLine, { type: "output", text: "Formatted active file." }] };
  }

  if (cmd === "save") {
    ctx.onSaveAll();
    return { lines: [inputLine, { type: "output", text: "All files saved." }] };
  }

  if (cmd === "git status") {
    const dirty = Object.keys(ctx.snapshot.files).filter(
      (p) => ctx.snapshot.files[p] !== ctx.snapshot.savedFiles[p],
    );
    const branch = ctx.snapshot.branch;
    const text =
      dirty.length === 0
        ? `On branch ${branch}\nnothing to commit, working tree clean`
        : `On branch ${branch}\nChanges not staged:\n${dirty.map((f) => `  modified: ${f}`).join("\n")}`;
    return { lines: [inputLine, { type: "output", text }] };
  }

  if (cmd.startsWith("git commit")) {
    const dirty = Object.keys(ctx.snapshot.files).filter(
      (p) => ctx.snapshot.files[p] !== ctx.snapshot.savedFiles[p],
    );
    if (dirty.length > 0) {
      return {
        lines: [
          inputLine,
          { type: "error", text: "Commit blocked: save all modified files first." },
        ],
      };
    }
    const msg = cmd.match(/-m\s+["'](.+?)["']/)?.[1] ?? "WIP";
    const branch = ctx.snapshot.branch;
    return {
      lines: [
        inputLine,
        { type: "output", text: `[${branch} ${msg.slice(0, 7)}] commit created` },
      ],
    };
  }

  if (cmd === "reset") {
    ctx.onReset();
    return {
      lines: [inputLine, { type: "output", text: "Workspace reset to default files." }],
    };
  }

  return {
    lines: [inputLine, { type: "error", text: `Unknown command: ${cmd}. Type "help" for options.` }],
  };
}
