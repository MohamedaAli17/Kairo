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
    <aside className="m-3 flex h-[calc(100vh-1.5rem)] w-[244px] shrink-0 flex-col rounded-3xl bg-white shadow-soft">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl bg-ink">
          <Image src="/brand/kairo-logo.png" alt="Kairo" fill className="object-cover" />
        </span>
        <span className="text-lg font-bold tracking-tight text-ink">Kairo</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
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
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-white shadow-pill"
                  : "text-muted hover:bg-black/[0.04] hover:text-ink",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge ? (
                <span
                  className={cn(
                    "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold",
                    active ? "bg-white/25 text-white" : "bg-accent text-white",
                  )}
                >
                  {badge > 9 ? "9+" : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-black/[0.04] hover:text-ink"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
