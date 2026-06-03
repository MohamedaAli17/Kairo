"use client";

import { motion } from "framer-motion";

const columns = [
  { title: "Product", items: ["Simulations", "Workflows", "Incidents", "Reviews"] },
  { title: "Features", items: ["Tickets", "Standups", "Calendar", "Scoring"] },
  { title: "Pricing", items: ["Free", "Pro", "Teams"] },
  { title: "Resources", items: ["Docs", "Blog", "Community"] },
];

export function FooterSection() {
  return (
    <motion.section
      id="resources"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen snap-start items-center px-3 pb-10 pt-24 md:px-4"
    >
      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white/62 px-10 pt-16 shadow-soft">
        <div className="grid flex-1 grid-cols-1 gap-10 md:grid-cols-[1.3fr_2.4fr_1fr]">
          <div>
            <p className="max-w-[290px] text-[30px] font-semibold leading-tight tracking-tight text-ink">
              Kairo is the AI workplace simulator for software engineers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[17px] font-semibold text-ink">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <li key={item} className="text-[15px] text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[18px] font-semibold text-ink">Follow us</p>
            <div className="mt-4 flex gap-3">
              {["ig", "x", "t"].map((s) => (
                <div
                  key={s}
                  className="grid h-12 w-12 place-items-center rounded-xl bg-zinc-100 text-sm font-semibold text-ink"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="pointer-events-none select-none text-[180px] font-semibold leading-none tracking-tight text-accent/90 md:text-[220px]">
          Kairo
        </p>
      </div>
    </motion.section>
  );
}
