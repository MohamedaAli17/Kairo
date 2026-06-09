export type WorkspaceFile = {
  path: string;
  language: "javascript" | "typescript";
  content: string;
};

export {
  DEFAULT_WORKSPACE_PATH,
  WORKSPACE_FILES,
  getTicketWorkspace,
  filesMapForTicket,
  languageForPath,
} from "@/lib/ticket-workspaces";

export type { TicketWorkspace, WorkspaceLanguage } from "@/lib/ticket-workspaces";
