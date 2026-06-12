"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Bot,
  Activity,
  Send,
  ChevronRight,
  Clock,
  Stethoscope,
} from "lucide-react";
import {
  REQUIRED_DOCS,
  SERVICES,
  PAYERS,
  REQUESTS,
  type Urgency,
} from "@/lib/mock-data";
import { StatusBadge, RiskBadge, UrgencyBadge } from "@/components/StatusBadge";

type ValidationResult = {
  completeness: number;
  denialRisk: number;
  riskTone: "low" | "moderate" | "high";
  missingDocs: string[];
  notes: string[];
  recommendation: string;
};

const URGENCY_OPTIONS: { value: Urgency; tone: string; Icon: typeof Clock }[] =
  [
    { value: "Routine", tone: "from-slate-500/10 to-slate-500/0", Icon: Clock },
    { value: "Urgent", tone: "from-amber-500/10 to-amber-500/0", Icon: AlertTriangle },
    { value: "Emergent", tone: "from-rose-500/15 to-rose-500/0", Icon: Activity },
  ];

export default function NewRequestPage() {
  const [patient, setPatient] = useState("");
  const [service, setService] = useState<string>(SERVICES[0] ?? "");
  const [payer, setPayer] = useState<string>(PAYERS[0] ?? "");
  const [urgency, setUrgency] = useState<Urgency>("Routine");
  const [note, setNote] = useState("");
  const [pickedDocs, setPickedDocs] = useState<Set<string>>(
    new Set(REQUIRED_DOCS.slice(0, 2))
  );
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [busy, setBusy] = useState(false);

  const completeness = useMemo(() => {
    const total = REQUIRED_DOCS.length;
    return Math.round((pickedDocs.size / Math.max(1, total)) * 100);
  }, [pickedDocs]);

  const recent = useMemo(() => REQUESTS.slice(0, 3), []);

  const toggleDoc = (d: string) => {
    setPickedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const runValidation = async () => {
    setBusy(true);
    setResult(null);
    // Simulated local validation; matches what the DeepSeek-backed route
    // would return when keys are present. Kept client-side for demo.
    await new Promise((r) => setTimeout(r, 600));
    const missing = REQUIRED_DOCS.filter((d) => !pickedDocs.has(d));
    const risk = Math.max(
      5,
      Math.min(
        95,
        100 -
          Math.round((pickedDocs.size / Math.max(1, REQUIRED_DOCS.length)) * 60) -
          (urgency === "Emergent" ? 10 : urgency === "Urgent" ? 5 : 0) +
          (note.trim().length > 20 ? -8 : 5)
      )
    );
    const completeness = Math.round(
      (pickedDocs.size / Math.max(1, REQUIRED_DOCS.length)) * 100
    );
    const riskTone: ValidationResult["riskTone"] =
      risk >= 70 ? "high" : risk >= 40 ? "moderate" : "low";
    const notes: string[] = [];
    if (missing.length === 0) {
      notes.push("All required documentation present.");
    } else {
      notes.push(
        `Add ${missing.length} missing document${missing.length > 1 ? "s" : ""} to reduce denial risk.`
      );
    }
    if (urgency !== "Routine") {
      notes.push(
        `${urgency} cases require same-day clinical justification note.`
      );
    }
    if (note.trim().length < 20) {
      notes.push("Add a clinical justification of at least one sentence.");
    } else {
      notes.push("Clinical justification is documented.");
    }

    const recommendation =
      riskTone === "high"
        ? "Escalate to a senior reviewer before submission."
        : riskTone === "moderate"
          ? "Safe to submit — close missing documentation gaps first."
          : "Ready to submit. Approval likely based on history.";

    setResult({ completeness, denialRisk: risk, riskTone, missingDocs: missing, notes, recommendation });
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <Sparkles className="h-3.5 w-3.5" /> New prior authorization
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Create request
          </h1>
          <p className="text-sm text-slate-500">
            Capture case details and let the copilot check for missing pieces
            before submission.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <section className="card lg:col-span-2 space-y-6">
          {/* Patient + service */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Case details
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Patient name</label>
                <input
                  className="input"
                  placeholder="e.g. Jane Doe"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Service</label>
                <select
                  className="input"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Payer</label>
                <select
                  className="input"
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                >
                  {PAYERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Clinical note</label>
                <textarea
                  className="input min-h-[44px] py-2.5"
                  rows={2}
                  placeholder="One-sentence clinical justification…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Urgency segmented */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Urgency
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {URGENCY_OPTIONS.map((u) => {
                const active = urgency === u.value;
                return (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUrgency(u.value)}
                    className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-brand-300 bg-white shadow-card"
                        : "border-slate-200 bg-white/70 hover:border-brand-200"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${u.tone} pointer-events-none`}
                    />
                    <div className="relative flex items-center justify-between">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${
                          active
                            ? "bg-white text-brand-700 ring-brand-200"
                            : "bg-white/80 text-slate-600 ring-slate-200"
                        }`}
                      >
                        <u.Icon className="h-4 w-4" />
                      </span>
                      {active && (
                        <CheckCircle2 className="h-4 w-4 text-brand-600" />
                      )}
                    </div>
                    <div className="relative mt-3 font-semibold text-slate-800">
                      {u.value}
                    </div>
                    <div className="relative text-xs text-slate-500">
                      {u.value === "Routine"
                        ? "Standard 3–5 business day review"
                        : u.value === "Urgent"
                          ? "24–48 hour review window"
                          : "Immediate clinical review"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider" />

          {/* Documents */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Required documents
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                {pickedDocs.size}/{REQUIRED_DOCS.length} attached
              </span>
            </div>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REQUIRED_DOCS.map((d) => {
                const on = pickedDocs.has(d);
                return (
                  <li key={d}>
                    <button
                      type="button"
                      onClick={() => toggleDoc(d)}
                      className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm flex items-center justify-between gap-3 transition ${
                        on
                          ? "border-brand-200 bg-brand-50/60 text-brand-800"
                          : "border-slate-200 bg-white/70 text-slate-700 hover:border-brand-200"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="truncate">{d}</span>
                      </span>
                      {on ? (
                        <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 shrink-0">
                          Add
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-500">
              Run validation to estimate denial risk before submitting.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setPatient("");
                  setNote("");
                  setPickedDocs(new Set());
                  setResult(null);
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={runValidation}
                disabled={busy}
                className="btn-primary"
              >
                {busy ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin" />
                    Validating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run AI validation
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* SIDE RAIL */}
        <aside className="space-y-4">
          <div className="card relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-300/20 blur-2xl" />
            <div className="relative">
              <h3 className="font-semibold text-slate-800">Completeness</h3>
              <p className="text-xs text-slate-500">
                Documentation ready to submit
              </p>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold text-slate-900">
                  {completeness}
                </span>
                <span className="text-slate-500 mb-1">%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-brand-gradient rounded-full transition-all"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {completeness >= 80
                  ? "Looks complete. Submission-ready."
                  : completeness >= 50
                    ? "Halfway there. A few more docs needed."
                    : "Add more documents to lower denial risk."}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-800">Recent requests</h3>
            <p className="text-xs text-slate-500 mb-3">
              Quickly continue an existing case
            </p>
            <ul className="space-y-2">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 p-2.5 hover:border-brand-200 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {r.id}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {r.service}
                    </div>
                  </div>
                  <UrgencyBadge urgency={r.urgency} />
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-soft-gradient">
            <div className="flex items-center gap-2 text-brand-700 font-semibold">
              <Stethoscope className="h-4 w-4" />
              Clinician in the loop
            </div>
            <p className="mt-1 text-xs text-slate-600">
              The copilot suggests — final clinical decisions remain with
              licensed clinicians and payer reviewers.
            </p>
          </div>
        </aside>
      </div>

      {/* RESULTS */}
      {result && (
        <section className="card relative overflow-hidden animate-fade-in">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-300/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-800">
                  Copilot validation
                </h2>
                <p className="text-xs text-slate-500">
                  AI risk assessment · demo mode
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Completeness
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {result.completeness}%
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient rounded-full"
                    style={{ width: `${result.completeness}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Denial risk
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {result.denialRisk}
                  </span>
                  <RiskBadge risk={result.denialRisk} />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Lower is better. Updates live as you edit.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Recommendation
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {result.recommendation}
                </p>
                <button className="btn-primary mt-3 w-full">
                  <Send className="h-4 w-4" /> Save as draft
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Missing documents
                </h3>
                {result.missingDocs.length === 0 ? (
                  <p className="mt-2 text-sm text-emerald-700 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> All required documents
                    attached.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {result.missingDocs.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 text-sm text-amber-700"
                      >
                        <AlertTriangle className="h-4 w-4" /> {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Notes
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {result.notes.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <ChevronRight className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
