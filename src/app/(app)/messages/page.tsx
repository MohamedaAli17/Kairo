"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { conversations, teamLeadMessages } from "@/lib/mock-data";

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("lead");

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">Messages</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full max-w-xs shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              type="button"
              onClick={() => setActiveId(convo.id)}
              className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                activeId === convo.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{convo.name}</p>
                {convo.unread ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{convo.preview}</p>
            </button>
          ))}
        </aside>

        <div className="flex flex-1 flex-col bg-[#f8fafc]">
          {activeId === "lead" ? (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {teamLeadMessages.map((msg, i) => (
                  <div key={i} className="max-w-xl">
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold text-slate-700">{msg.from}</p>
                      <p className="mt-1 text-sm text-slate-800">{msg.text}</p>
                      {"taskOffer" in msg && msg.taskOffer ? (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-xs text-slate-500">{msg.taskOffer.id}</span>
                              <p className="font-semibold text-slate-900">{msg.taskOffer.title}</p>
                            </div>
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                              {msg.taskOffer.priority}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-4 text-xs text-slate-500">
                            <span>{msg.taskOffer.effort} pts</span>
                            <span>Due {msg.taskOffer.dueDate}</span>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link
                              href="/tickets/BUG-221"
                              className="flex-1 rounded-lg bg-emerald-600 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Accept
                            </Link>
                            <button
                              type="button"
                              className="flex-1 rounded-lg border border-red-200 bg-white py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">{msg.time}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button type="button" className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-slate-400">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
