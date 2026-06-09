"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { conversations, teamLeadMessages } from "@/lib/mock-data";

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("lead");

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col p-3">
      <div className="flex flex-1 overflow-hidden rounded-3xl bg-white shadow-soft">
        <aside className="w-full max-w-xs shrink-0 overflow-y-auto border-r border-black/5 p-2">
          <h1 className="px-3 py-3 text-lg font-bold tracking-tight text-ink">Messages</h1>
          {conversations.map((convo) => (
            <button
              key={convo.id}
              type="button"
              onClick={() => setActiveId(convo.id)}
              className={`mb-1 w-full rounded-2xl px-3 py-3 text-left transition hover:bg-black/[0.03] ${
                activeId === convo.id ? "bg-accent-soft" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">{convo.name}</p>
                {convo.unread ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted">{convo.preview}</p>
            </button>
          ))}
        </aside>

        <div className="flex flex-1 flex-col bg-canvas">
          {activeId === "lead" ? (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {teamLeadMessages.map((msg, i) => (
                  <div key={i} className="max-w-xl">
                    <div className="rounded-3xl rounded-tl-lg bg-white px-4 py-3 shadow-soft">
                      <p className="text-xs font-semibold text-accent">{msg.from}</p>
                      <p className="mt-1 text-sm text-ink">{msg.text}</p>
                      {"taskOffer" in msg && msg.taskOffer ? (
                        <div className="mt-4 rounded-2xl bg-black/[0.03] p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-xs text-muted">{msg.taskOffer.id}</span>
                              <p className="font-semibold text-ink">{msg.taskOffer.title}</p>
                            </div>
                            <span className="q-chip bg-red-50 text-red-600">
                              {msg.taskOffer.priority}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-4 text-xs text-muted">
                            <span>{msg.taskOffer.effort} pts</span>
                            <span>Due {msg.taskOffer.dueDate}</span>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link
                              href="/tickets/BUG-221"
                              className="q-btn flex-1"
                            >
                              Accept
                            </Link>
                            <button
                              type="button"
                              className="q-btn-ghost flex-1"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[10px] text-muted">{msg.time}</p>
                  </div>
                ))}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                  />
                  <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white transition hover:bg-accent-dark">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-muted">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
