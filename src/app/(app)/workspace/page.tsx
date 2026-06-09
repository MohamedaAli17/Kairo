import { CodeWorkspace } from "@/components/workspace/code-workspace";

export default function WorkspacePage({
  searchParams,
}: {
  searchParams?: { ticket?: string; branch?: string; file?: string };
}) {
  const ticketId = searchParams?.ticket;

  return (
    <CodeWorkspace
      key={ticketId ?? "default"}
      ticketId={ticketId}
      branch={searchParams?.branch}
      initialFile={searchParams?.file}
    />
  );
}
