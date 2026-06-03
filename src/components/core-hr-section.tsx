"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarClock, GitPullRequestArrow, MessageSquareText, UserRound } from "lucide-react";
import type { ReactNode } from "react";

interface AccentCard {
  id: string;
  top: string;
  side: "left" | "right";
  x: number;
  delay: number;
  title: string;
  subtitle: string;
  icon: ReactNode;
}

const accentCards: AccentCard[] = [
  {
    id: "l0-card",
    top: "18%",
    side: "left",
    x: 72,
    delay: 0.05,
    title: "Sprint standup",
    subtitle: "09:00 daily sync",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  {
    id: "l1-card",
    top: "56%",
    side: "left",
    x: 108,
    delay: 0.15,
    title: "Code review",
    subtitle: "2 comments pending",
    icon: <GitPullRequestArrow className="h-5 w-5" />,
  },
  {
    id: "r0-card",
    top: "20%",
    side: "right",
    x: 72,
    delay: 0.07,
    title: "PM update",
    subtitle: "Scope changed",
    icon: <MessageSquareText className="h-5 w-5" />,
  },
  {
    id: "r1-card",
    top: "58%",
    side: "right",
    x: 108,
    delay: 0.18,
    title: "Incident",
    subtitle: "API latency spike",
    icon: <CalendarClock className="h-5 w-5" />,
  },
];

export function CoreHrSection() {
  return (
    <motion.section
      id="workflows"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen snap-start items-center px-3 pb-10 pt-24 md:px-4 md:pt-28"
    >
      <div className="relative mx-auto min-h-[88vh] w-full max-w-[1500px] overflow-hidden rounded-[2rem] border border-black/5 bg-white/55 px-6 pb-10 pt-16 shadow-soft md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,252,0.06),rgba(255,255,255,0)_45%)]" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,92,252,0.16),rgba(124,92,252,0))]" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-[360px] w-[360px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.14),rgba(79,70,229,0))]" />

        {accentCards.map((card) => (
          <FloatingAccentCard key={card.id} card={card} />
        ))}

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto mt-10 max-w-xl text-center"
        >
          <div className="mx-auto mb-6 grid h-11 w-11 place-items-center rounded-xl bg-white text-brand shadow-soft">
            <UserRound className="h-5 w-5" />
          </div>

          <h2 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
            Real team
            <br />
            workflows
          </h2>

          <p className="mx-auto mt-4 max-w-[360px] text-balance text-[15px] leading-relaxed text-muted">
            Work through realistic PM tickets, tech lead guidance, QA checks,
            and GitHub-style AI code reviews.
          </p>

          <div className="mt-7">
            <Button variant="brand" className="px-8 py-3 text-[15px]">
              Explore the workflow
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function FloatingAccentCard({ card }: { card: AccentCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: card.side === "left" ? -18 : 18, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: card.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute hidden lg:block"
      style={{
        top: card.top,
        [card.side]: `${card.x}px`,
      }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 4.2 + card.delay * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[180px] rounded-2xl border border-black/5 bg-white/90 p-4 shadow-card backdrop-blur"
      >
        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
          {card.icon}
        </div>
        <p className="text-sm font-semibold text-ink">{card.title}</p>
        <p className="mt-1 text-xs text-muted">{card.subtitle}</p>
      </motion.div>
    </motion.div>
  );
}
