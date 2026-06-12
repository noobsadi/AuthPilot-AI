"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { REQUESTS } from "@/lib/mock-data";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  source?: "deepseek" | "mock";
}

const CHIPS = [
  "Summarize this case",
  "What documents are missing?",
  "Predict denial risk",
  "Draft payer message",
  "Escalation next step",
];

export default function AICopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text:
        "Hi, I'm your AuthPilot AI copilot. I help admin and clinical staff draft, validate, and route prior auth requests. How can I help?",
      source: "mock",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<string>(
    REQUESTS[0]?.id ?? ""
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          requestId: selectedRequest,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.reply ?? "Sorry, I couldn't respond.",
          source: data.source,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "I had trouble reaching the copilot. Please try again.",
          source: "mock",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI copilot"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-elevated hover:scale-105 active:scale-95 transition focus:outline-none focus:ring-4 focus:ring-brand-200/60"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-amber-900 ring-2 ring-white shadow-soft">
            <Sparkles className="h-3 w-3" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[min(380px,calc(100vw-2.5rem))] rounded-2xl border border-slate-200/80 bg-white shadow-elevated flex flex-col overflow-hidden animate-fade-in">
          <div className="relative bg-brand-gradient px-4 py-3.5 text-white overflow-hidden">
            <div className="absolute inset-0 bg-mesh-1 opacity-50" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    AuthPilot Copilot
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse-dot" />
                  </div>
                  <div className="text-[10px] opacity-90 uppercase tracking-wider">
                    Admin & clinical assistant
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-3 flex items-center gap-2 text-[11px]">
              <MessageSquare className="h-3 w-3 opacity-80" />
              <span className="opacity-90">Context:</span>
              <select
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
                className="flex-1 rounded-lg bg-white/20 ring-1 ring-white/30 px-2 py-1 text-white text-[11px] focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {REQUESTS.map((r) => (
                  <option key={r.id} value={r.id} className="text-slate-900">
                    {r.id} · {r.service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[360px] min-h-[260px] bg-slate-50/60"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex animate-fade-in ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap shadow-sm ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-md"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="rounded-2xl rounded-bl-md bg-white border border-slate-200/80 px-3.5 py-2.5 text-sm text-slate-500 inline-flex items-center gap-2 shadow-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="px-3 py-3 border-t border-slate-200/80 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition"
                >
                  {c}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the copilot…"
                className="input"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-3 py-2.5"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
