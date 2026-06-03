"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Code2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" as const },
  { href: "/workspace", label: "Code Workspace", icon: Code2 },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

type AppSidebarProps = {
  displayName?: string;
  unreadBadge?: number;
};

export function AppSidebar({ unreadBadge }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col bg-[#0f172a] text-white">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="relative h-7 w-7 overflow-hidden rounded-md">
          <Image src="/brand/kairo-logo.png" alt="Kairo" fill className="object-cover" />
        </span>
        <span className="text-lg font-semibold tracking-tight">Kairo</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const badge =
            item.badgeKey === "messages" && unreadBadge ? unreadBadge : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold">
                  {badge > 9 ? "9+" : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
