import { filesMapForTicket, getTicketWorkspace } from "@/lib/ticket-workspaces";
import { getTicket, normalizeTicketId } from "@/lib/tickets";

export type WorkspaceSnapshot = {
  files: Record<string, string>;
  savedFiles: Record<string, string>;
  activePath: string;
  branch: string;
  lastTestPassed: boolean;
};

function storageKey(ticketId?: string) {
  const id = ticketId ? normalizeTicketId(ticketId) : undefined;
  return id ? `kairo-workspace-${id}` : "kairo-workspace-v1";
}

export function resolveActivePath(
  preferred: string | undefined,
  files: Record<string, string>,
  fallback: string,
): string {
  if (preferred && files[preferred] !== undefined) return preferred;
  if (files[fallback] !== undefined) return fallback;
  const first = Object.keys(files)[0];
  return first ?? fallback;
}

function isValidSnapshot(parsed: WorkspaceSnapshot, ticketId?: string): boolean {
  const expected = filesMapForTicket(ticketId);
  const expectedPaths = Object.keys(expected).sort();
  const actualPaths = Object.keys(parsed.files ?? {}).sort();
  if (expectedPaths.length === 0 || actualPaths.length !== expectedPaths.length) {
    return false;
  }
  return expectedPaths.every((path, i) => path === actualPaths[i]);
}

export function defaultSnapshot(ticketId?: string, branchOverride?: string): WorkspaceSnapshot {
  const id = ticketId ? normalizeTicketId(ticketId) : undefined;
  const ticket = id ? getTicket(id) : undefined;
  const workspace = getTicketWorkspace(id);
  const files = filesMapForTicket(id);

  return {
    files,
    savedFiles: { ...files },
    activePath: workspace.defaultPath,
    branch: branchOverride ?? ticket?.branch ?? workspace.branch,
    lastTestPassed: false,
  };
}

export function loadWorkspaceSnapshot(ticketId?: string): WorkspaceSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(ticketId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkspaceSnapshot;
    if (!parsed.files || typeof parsed.files !== "object") return null;
    if (!isValidSnapshot(parsed, ticketId)) {
      localStorage.removeItem(storageKey(ticketId));
      return null;
    }
    const workspace = getTicketWorkspace(ticketId);
    parsed.activePath = resolveActivePath(parsed.activePath, parsed.files, workspace.defaultPath);
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot, ticketId?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(ticketId), JSON.stringify(snapshot));
  } catch {
    // quota exceeded — ignore
  }
}

export function resetWorkspaceSnapshot(ticketId?: string, branchOverride?: string): WorkspaceSnapshot {
  const fresh = defaultSnapshot(ticketId, branchOverride);
  saveWorkspaceSnapshot(fresh, ticketId);
  return fresh;
}
