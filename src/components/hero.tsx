"use client";

import { motion } from "framer-motion";
import { CircleCheck, Lightbulb, Send, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const VB = { w: 1000, h: 380 };

type NodeKind = "icon" | "photo" | "center";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  kind: NodeKind;
  size: number;
  delay: number;
  float: number;
  tile?: string;
  icon?: ReactNode;
  img?: string;
}

const nodes: GraphNode[] = [
  {
    id: "center",
    x: 500,
    y: 150,
    kind: "center",
    size: 96,
    delay: 0,
    float: 10,
    icon: <CircleCheck className="h-9 w-9" strokeWidth={2} />,
  },
  {
    id: "personLeft",
    x: 150,
    y: 120,
    kind: "photo",
    size: 64,
    delay: 0.45,
    float: 8,
    img: "https://i.pravatar.cc/120?img=12",
  },
  {
    id: "lightbulb",
    x: 330,
    y: 70,
    kind: "icon",
    size: 56,
    delay: 0.3,
    float: 7,
    tile: "bg-amber-300 text-amber-900",
    icon: <Lightbulb className="h-6 w-6" />,
  },
  {
    id: "blue",
    x: 320,
    y: 210,
    kind: "icon",
    size: 56,
    delay: 0.6,
    float: 9,
    tile: "bg-sky-400 text-white",
    icon: <Send className="h-6 w-6" />,
  },
  {
    id: "lightning",
    x: 700,
    y: 95,
    kind: "icon",
    size: 56,
    delay: 0.55,
    float: 8,
    tile: "bg-accent text-white",
    icon: <Zap className="h-6 w-6 fill-current" />,
  },
  {
    id: "eyes",
    x: 860,
    y: 120,
    kind: "icon",
    size: 64,
    delay: 0.75,
    float: 7,
    tile: "bg-white text-2xl",
    icon: <span className="text-2xl leading-none">oo</span>,
  },
  {
    id: "personRight",
    x: 650,
    y: 250,
    kind: "photo",
    size: 52,
    delay: 0.9,
    float: 10,
    img: "https://i.pravatar.cc/120?img=45",
  },
];

const edges = [
  "M150,120 C250,90 280,80 330,70",
  "M330,70 C420,80 450,120 500,150",
  "M320,210 C400,200 450,175 500,150",
  "M500,150 C600,120 650,105 700,95",
  "M700,95 C780,100 820,110 860,120",
  "M500,150 C560,190 600,220 650,250",
];

export function Hero() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen snap-start items-center px-3 pb-10 pt-28 md:px-4 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-[1420px] items-center gap-8 lg:grid-cols-2">
        <div className="relative h-[290px] w-full md:h-[360px]">
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="absolute inset-0 h-full w-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {edges.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="#d4d4d8"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + i * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
            {nodes.map((n) => (
              <motion.circle
                key={`dot-${n.id}`}
                cx={n.x}
                cy={n.y}
                r={3}
                fill="#a1a1aa"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: n.delay + 0.2, duration: 0.3 }}
              />
            ))}
          </svg>

          {nodes.map((n) => (
            <Tile key={n.id} node={n} />
          ))}
        </div>

        <motion.div
          initial={{ x: 28, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[500px] text-center lg:mx-0 lg:justify-self-end lg:text-left"
        >
          <h1 className="text-balance text-5xl font-bold leading-[1.04] tracking-tight text-ink md:text-7xl">
            Learn software
            <br />
            engineering by doing
          </h1>
          <p className="mt-5 max-w-md text-balance text-base text-muted lg:mx-0">
            Kairo simulates a real software engineering workplace: tickets,
            standups, PR reviews, and incident calls with an AI team.
          </p>
          <div className="mt-7 flex justify-center lg:justify-start">
            <Button
              variant="accent"
              className="px-6 py-3 text-[15px]"
              onClick={() => window.location.assign("/signup")}
            >
              Start your first sprint
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Tile({ node }: { node: GraphNode }) {
  const leftPct = (node.x / VB.w) * 100;
  const topPct = (node.y / VB.h) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: node.delay,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div
          animate={{ y: [0, -node.float, 0] }}
          transition={{
            duration: 3.5 + node.float * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: node.delay,
          }}
        >
          {node.kind === "center" ? (
            <div
              className="grid place-items-center rounded-[1.4rem] bg-gradient-to-br from-brand to-[#9a7bff] text-white shadow-card"
              style={{ width: node.size, height: node.size }}
            >
              {node.icon}
            </div>
          ) : node.kind === "photo" ? (
            <div
              className="overflow-hidden rounded-2xl border border-white bg-white shadow-soft"
              style={{ width: node.size, height: node.size }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={node.img} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div
              className={`grid place-items-center rounded-2xl shadow-soft ${node.tile ?? ""}`}
              style={{ width: node.size, height: node.size }}
            >
              {node.icon}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
