"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import Image from "next/image";

const tools = [
  {
    id: "slack-left",
    name: "Slack",
    src: "/logos/slack.png",
    rotate: -24,
    description: "Instant team communication",
  },
  {
    id: "teams-left",
    name: "Teams",
    src: "/logos/teams.png",
    rotate: -12,
    description: "Collaborative video meetings",
  },
  {
    id: "meet-center",
    name: "Google Meet",
    src: "/logos/google-meet.png",
    rotate: 0,
    description: "Seamless video meetings",
  },
  {
    id: "outlook-right",
    name: "Outlook",
    src: "/logos/outlook.png",
    rotate: 12,
    description: "Scheduling and email workflows",
  },
  {
    id: "teams-right",
    name: "Teams",
    src: "/logos/teams.png",
    rotate: 24,
    description: "Cross-team collaboration",
  },
];

export function IntegrationsSection() {
  const [activeIndex, setActiveIndex] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const orderedTools = useMemo(() => {
    return tools.map((tool, index) => {
      const relative = index - activeIndex;
      const wrappedRelative =
        relative > 2
          ? relative - tools.length
          : relative < -2
            ? relative + tools.length
            : relative;

      return { ...tool, relative: wrappedRelative };
    });
  }, [activeIndex]);

  const activeTool = tools[activeIndex];

  return (
    <motion.section
      id="integrations"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen snap-start items-center px-3 pb-10 pt-24 md:px-4"
    >
      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-[1500px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-black/5 bg-white/60 px-6 shadow-soft">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-white text-accent shadow-soft">
          <Settings className="h-5 w-5" />
        </div>
        <h3 className="text-center text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
          Integrate with your
          <br />
          existing tools in seconds
        </h3>

        <div className="relative mt-14 h-[230px] w-full max-w-[1100px]">
          {orderedTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{
                x: tool.relative * 205,
                y: Math.abs(tool.relative) === 0 ? -28 : -14,
                rotate: tool.rotate,
                scale: tool.relative === 0 ? 1.08 : 0.95,
                opacity: Math.abs(tool.relative) <= 2 ? 1 : 0,
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.015 }}
              className="absolute left-1/2 top-1/2 z-10 flex h-[165px] w-[190px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-black/5 bg-zinc-100/80 shadow-soft"
              style={{ zIndex: 30 - Math.abs(tool.relative) }}
            >
              <div className="relative h-20 w-20">
                <Image src={tool.src} alt={tool.name} fill className="object-contain" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-2 text-center"
        >
          <motion.p
            key={activeTool.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-semibold tracking-tight text-ink"
          >
            {activeTool.name}
          </motion.p>
          <motion.p
            key={activeTool.description}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-2 text-[18px] text-muted"
          >
            {activeTool.description}
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
