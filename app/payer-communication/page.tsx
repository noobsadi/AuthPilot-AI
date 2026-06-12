"use client";

import { useMemo, useState } from "react";
import {
  MessageSquare,
  Copy,
  Check,
  RefreshCcw,
  Phone,
  Mail,
  FileSignature,
  Gavel,
  Sparkles,
  Send,
  Activity,
} from "lucide-react";
import { REQUESTS } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/StatusBadge";

const TYPES = [
  {
    key: "cover-letter",
    label: "Cover letter",
    desc: "Initial submission to the payer",
    Icon: Mail,
    tone: "from-brand-500/10 to-sky-500/10",
    accent: "text-brand-600",
  },
  {
    key: "portal-message",
    label: "Portal message",
    desc: "Concise thread-friendly note",
    Icon: MessageSquare,
    tone: "from-teal-500/10 to-emerald-500/10",
    accent: "text-teal-600",
  },
  {
    key: "call-script",
    label: "Call script",
    desc: "Verbal escalation flow",
    Icon: Phone,
    tone: "from-indigo-500/10 to-purple-500/10",
    accent: "text-indigo-600",
  },
  {
    key: "appeal-letter",
    label: "Appeal letter",
    desc: "Formal denial rebuttal",
    Icon: Gavel,
    tone: "from-rose-500/10 to-pink-500/10",
    accent: "text-rose-600",
  },
] as const;

type TypeKey = (typeof TYPES)[number]["key"];

const SAMPLE: Record<TypeKey, string> = {
  "cover-letter": `Dear Payer Reviewer,

We are requesting prior authorization for the requested service for the patient listed above. Enclosed are the supporting clinical notes, prior treatments attempted, and the medical-necessity criteria met for this case.

Please contact us if any additional documentation is required.

Sincerely,
Care Team`,
  "portal-message": `Hi — submitting PA for the case above. Clinical justification and prior-step documentation are attached. Please confirm receipt and the expected decision timeline. Thank you.`,
  "call-script": `1. Greet reviewer and reference case ID.
2. State member ID, service, and date of service.
3. Summarize medical necessity in two sentences.
4. Offer to send additional clinical notes.
5. Confirm decision timeline and next steps.`,
  "appeal-letter": `Dear Appeals Reviewer,

We formally appeal the denial of the requested service. The clinical record demonstrates medical necessity supported by the attached documentation, prior conservative therapy, and current clinical guidelines. We respectfully request reconsideration.

Sincerely,
Care Team`,
};

export default function PayerCommPage() {
  const [caseId, setCaseId] = useState<string>(REQUESTS[0]?.id ?? "");
  const [tone, setTone] = useState<"professional" | "concise" | "assertive">(
    "professional"
  );
  const [output, setOutput] = useState<string>(SAMPLE["cover-letter"]);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => REQUESTS.find((r) => r.id === caseId) ?? REQUESTS[0],
    [caseId]
  );

  const generate = async (type: TypeKey) => {
    setBusy(true);
    setCopied(false);
    // Local templating — the real DeepSeek path is in /api/copilot.
    await new Promise((r) => setTimeout(r, 350));
    let body = SAMPLE[type];
    if (tone === "concise") body = body.split("\n").slice(0, 3).join("\n");
    if (tone === "assertive")
      body = body + "\n\nPlease respond within 5 business days.";
    setOutput(body);
    setBusy(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <MessageSquare className="h-3.5 w-3.5" /> Payer communication
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Generate payer comms
          </h1>
          <p className="text-sm text-slate-500">
            Draft cover letters, portal messages, call scripts, and appeals in
            seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — controls */}
        <section className="card lg:col-span-1 space-y-5">
          <div>
            <label className="label">Case</label>
            <select
              className="input"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            >
              {REQUESTS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} · {r.service}
                </option>
              ))}
            </select>
            {selected && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <StatusBadge status={selected.status} />
                <RiskBadge risk={selected.denialRisk} />
                <span className="text-xs text-slate-500">
                  {selected.payer} · {selected.urgency}
                </span>
              </div>
            )}
          </div>

          <div className="divider" />

          <div>
            <label className="label">Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { v: "professional", l: "Professional" },
                  { v: "concise", l: "Concise" },
                  { v: "assertive", l: "Assertive" },
                ] as const
              ).map((t) => {
                const active = tone === t.v;
                return (
                  <button
                    key={t.v}
                    type="button"
                    onClick={() => setTone(t.v)}
                    className={`text-xs font-semibold rounded-xl border px-2 py-2 transition ${
                      active
                        ? "border-brand-300 bg-brand-50 text-brand-700 shadow-card"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:border-brand-200"
                    }`}
                  >
                    {t.l}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">Choose a draft</label>
            <div className="space-y-2">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => generate(t.key)}
                  disabled={busy}
                  className="w-full text-left rounded-2xl border border-slate-200 bg-white/70 p-3 hover:border-brand-200 hover:shadow-card transition flex items-center gap-3 disabled:opacity-60"
                >
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${t.tone} ${t.accent}`}
                  >
                    <t.Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 text-sm">
                      {t.label}
                    </div>
                    <div className="text-[11px] text-slate-500">{t.desc}</div>
                  </div>
                  {busy ? (
                    <Activity className="h-4 w-4 animate-spin text-slate-400" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-brand-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT — output */}
        <section className="card lg:col-span-2 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-300/20 blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white">
                <FileSignature className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-800">Draft</h2>
                <p className="text-xs text-slate-500">
                  Edit freely — copy to your EHR or payer portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => generate("cover-letter")}
                className="btn-ghost"
              >
                <RefreshCcw className="h-4 w-4" /> Regenerate
              </button>
              <button type="button" onClick={copy} className="btn-secondary">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </button>
              <button type="button" className="btn-primary">
                <Send className="h-4 w-4" /> Send
              </button>
            </div>
          </div>

          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="input mt-4 min-h-[360px] font-mono text-sm leading-relaxed"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Sparkles className="h-3.5 w-3.5" /> Demo template
            </span>
            <span>
              {output.length} characters · {output.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
