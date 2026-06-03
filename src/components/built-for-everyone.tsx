"use client";

import { motion } from "framer-motion";
import { BarChart3, Clock3, Gauge, Users } from "lucide-react";

export function BuiltForEveryone() {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen snap-start items-center px-3 pb-10 pt-24 md:px-4"
    >
      <div className="mx-auto w-full max-w-[1500px] rounded-[2rem] border border-black/5 bg-white/65 px-6 pb-8 pt-10 shadow-soft md:px-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <h3 className="text-balance text-5xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
            Built for future engineers
          </h3>
          <p className="mx-auto mt-3 max-w-md text-balance text-[15px] leading-relaxed text-muted">
            Kairo helps students and early-career developers practice the real
            pressure and rhythm of software teams.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <motion.article
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.02 }}
            className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-soft"
          >
            <div className="mb-4 rounded-2xl border border-black/5 bg-zinc-50 p-4">
              <div className="mx-auto h-20 w-[85%] rounded-xl border border-black/5 bg-white p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-1.5 w-24 rounded-full bg-zinc-200" />
                  <span className="text-[9px] font-semibold text-zinc-500">Weekly</span>
                </div>
                <div className="flex items-end gap-2">
                  <div className="h-7 w-3 rounded bg-orange-400" />
                  <div className="h-10 w-3 rounded bg-indigo-500" />
                  <div className="h-6 w-3 rounded bg-amber-400" />
                  <div className="h-8 w-3 rounded bg-violet-500" />
                  <div className="h-5 w-3 rounded bg-sky-400" />
                </div>
              </div>
            </div>
            <h4 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
              For learners
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Track ticket completion, review rounds, and communication growth
              so you can see real progress week by week.
            </p>
          </motion.article>

          <motion.article
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-soft"
          >
            <div className="mb-4 grid h-28 place-items-center rounded-2xl border border-black/5 bg-[radial-gradient(circle_at_center,rgba(124,92,252,0.08),transparent_60%)]">
              <div className="inline-flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2 shadow-sm">
                <Gauge className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-ink">
                  Simulation insights
                </span>
              </div>
            </div>
            <h4 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
              For mentors &amp; coaches
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Review learner progress, identify blockers early, and guide better
              engineering habits with clear performance signals.
            </p>
          </motion.article>

          <motion.article
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-soft"
          >
            <div className="mb-4 grid h-28 place-items-center rounded-2xl border border-black/5 bg-[linear-gradient(to_bottom,rgba(24,24,27,0.04),rgba(255,255,255,0.2))]">
              <div className="inline-flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2 shadow-sm">
                <BarChart3 className="h-4 w-4 text-brand" />
                <span className="text-sm font-medium text-ink">Review Quality</span>
              </div>
            </div>
            <h4 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
              For interview prep
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Practice real PR feedback loops, communication, and code quality
              standards before high-pressure interviews.
            </p>
          </motion.article>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-soft md:col-span-2"
          >
            <div className="mb-4 overflow-hidden rounded-2xl border border-black/5 bg-zinc-50">
              <div className="border-b border-black/5 bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-300 to-orange-400" />
                  <p className="text-[11px] font-semibold text-ink">Amara Boateng</p>
                  <p className="text-[10px] text-muted">Engineering Manager</p>
                </div>
                <p className="mt-1 line-clamp-1 text-[10px] text-ink/90">
                  The pagination is broken — with page size 5 and 11 items, it only
                  shows 2 pages instead of 3.
                </p>
              </div>

              <div className="grid gap-2 px-3 py-2 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                    Acceptance Criteria
                  </p>
                  <div className="space-y-1 text-[10px] text-ink/90">
                    <p>• usePagination(11, 5) returns totalPages 3</p>
                    <p>• usePagination(10, 5) returns totalPages 2</p>
                    <p>• usePagination(0, 5) returns totalPages 0</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                    Constraints
                  </p>
                  <div className="space-y-1 text-[10px] text-ink/90">
                    <p>• Do not change function signature</p>
                    <p>• Standard library only</p>
                    <p>• Handle edge cases</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/5 bg-[#111827] px-3 py-2">
                <p className="font-mono text-[9px] text-zinc-300">
                  const totalPages = Math.ceil(totalItems / pageSize)
                </p>
              </div>
            </div>
            <h4 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
              All ticket context at once
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              See requirements, acceptance criteria, logs, and constraints in one
              place so you can focus on solving, not guessing.
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-soft"
          >
            <div className="mb-4 grid h-28 place-items-center rounded-2xl border border-black/5 bg-zinc-50">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-medium text-ink">
                  <Users className="h-3.5 w-3.5 text-brand" />
                  Team standup room
                </div>
                <div className="flex gap-2">
                  {["A", "M", "Z", "R", "N"].map((u) => (
                    <div
                      key={u}
                      className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-200 text-[9px] font-semibold text-indigo-700"
                    >
                      {u}
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-zinc-500">3 blockers raised • 1 resolved</p>
              </div>
            </div>
            <h4 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
              For teams &amp; learners
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Run simulations together, compare outcomes, and build confidence
              through shared standups and sprint-style workflows.
            </p>
          </motion.article>
        </div>
      </div>
    </motion.section>
  );
}
