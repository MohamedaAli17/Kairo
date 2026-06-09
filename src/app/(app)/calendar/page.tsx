"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calendarEvents, eventColors } from "@/lib/mock-data";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function CalendarPage() {
  const [view, setView] = useState<"Day" | "Week" | "Month">("Week");

  return (
    <div className="flex min-h-full flex-col p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Calendar</h1>
        <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-soft">
          {(["Day", "Week", "Month"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                view === v
                  ? "bg-accent text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <button type="button" className="q-btn-ghost px-4 py-1.5">
          Today
        </button>
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-white">
          <ChevronRight className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-ink">May 20 – May 26, 2024</span>
      </div>

      <div className="flex-1 overflow-auto rounded-3xl bg-white shadow-soft">
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-black/5">
          <div />
          {days.map((day) => (
            <div key={day} className="border-l border-black/5 px-2 py-3 text-center text-sm font-semibold text-ink">
              {day}
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-[60px_repeat(5,1fr)]">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="border-b border-black/5 px-2 py-4 text-xs text-muted">
                {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
              {days.map((_, dayIdx) => (
                <div key={`${hour}-${dayIdx}`} className="relative min-h-[48px] border-b border-l border-black/5" />
              ))}
            </div>
          ))}

          {calendarEvents.map((event) => {
            const top = (event.start - 9) * 48 + 4;
            const height = (event.end - event.start) * 48 - 8;
            return (
              <div
                key={event.title + event.day}
                className={`absolute z-10 mx-1 overflow-hidden rounded-md px-2 py-1 text-[10px] font-medium text-white ${eventColors[event.type]}`}
                style={{
                  top,
                  height,
                  left: `calc(60px + (100% - 60px) * ${(event.day - 1) / 5} + 4px)`,
                  width: `calc((100% - 60px) / 5 - 8px)`,
                }}
              >
                {event.title}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        {Object.entries(eventColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 capitalize">
            <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
            {type}
          </span>
        ))}
      </footer>
    </div>
  );
}
