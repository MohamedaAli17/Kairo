import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/sidebar";
import { getAppShellData } from "@/lib/data/dashboard";
import { getUser } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const shell = await getAppShellData(user.id);

  return (
    <div className="flex min-h-screen bg-canvas">
      <AppSidebar
        displayName={shell.displayName}
        unreadBadge={shell.unreadBadge > 0 ? shell.unreadBadge : undefined}
      />
      <div className="flex min-h-screen flex-1 flex-col overflow-auto">{children}</div>
    </div>
  );
}
