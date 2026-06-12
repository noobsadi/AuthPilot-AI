import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageSquare,
  BarChart3,
  Sparkles,
  Bot,
  CheckCircle2,
  Zap,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";

const TRUST = [
  "HIPAA-aware patterns",
  "Demo data only",
  "Clinician-in-the-loop",
];

const STATS = [
  { value: "8", label: "Tracked requests", Icon: FileText, tone: "from-brand-500 to-sky-500" },
  { value: "78%", label: "Approval rate", Icon: TrendingUp, tone: "from-teal-500 to-emerald-500" },
  { value: "3.6d", label: "Avg turnaround", Icon: Clock, tone: "from-indigo-500 to-brand-500" },
  { value: "<30s", label: "AI validation", Icon: Zap, tone: "from-purple-500 to-pink-500" },
];

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Risk-aware",
    desc: "Denial risk scoring on every case with explainable factors.",
    tone: "bg-brand-50 text-brand-700 ring-brand-100",
  },
  {
    icon: FileText,
    title: "Payer-ready",
    desc: "Cover letters, packets, and appeal drafts in one click.",
    tone: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  {
    icon: Bot,
    title: "Copilot",
    desc: "Context-aware assistant for admin and clinical staff.",
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Smart validation",
    desc: "Catch missing docs and documentation gaps before submission.",
    tone: "from-brand-500/10 to-sky-500/10",
    accent: "text-brand-600",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Approval rates, denial reasons, payer performance at a glance.",
    tone: "from-teal-500/10 to-emerald-500/10",
    accent: "text-teal-600",
  },
  {
    icon: MessageSquare,
    title: "Payer comms",
    desc: "Cover letters, portal messages, call scripts, and appeals.",
    tone: "from-indigo-500/10 to-purple-500/10",
    accent: "text-indigo-600",
  },
  {
    icon: Activity,
    title: "Workflow",
    desc: "Draft → Ready → Submitted → Approved/Denied — tracked end to end.",
    tone: "from-purple-500/10 to-pink-500/10",
    accent: "text-purple-600",
  },
];

export default function LandingPage() {
  return (
    <div className="relative space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-health-gradient shadow-soft">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative px-6 sm:px-10 lg:px-14 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Healthcare Prior Authorization Copilot
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance">
            AuthPilot{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-slate-700 text-balance">
            AI copilot for faster, cleaner prior authorization workflows.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 text-balance">
            Validate requests, predict denial risk, generate payer packets, and
            assist admin and clinical staff — all in one place. Final clinical
            decisions remain with licensed clinicians and payer reviewers.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="btn-primary px-5 py-3 text-base">
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/requests"
              className="btn-secondary px-5 py-3 text-base"
            >
              View requests
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-600 ml-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              No setup · Mock data ready
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="card card-hover flex items-center gap-4"
          >
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl text-white bg-gradient-to-br ${s.tone} shadow-soft`}
            >
              <s.Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none">
                {s.value}
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* HIGHLIGHTS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HIGHLIGHTS.map((f) => (
          <div key={f.title} className="card card-hover">
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${f.tone}`}
            >
              <f.icon className="h-5 w-5" />
            </span>
            <div className="mt-4 font-semibold text-slate-800">{f.title}</div>
            <div className="text-sm text-slate-600 mt-1">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* FEATURE GRID */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Everything your team needs
            </h2>
            <p className="text-sm text-slate-500">
              Built for admin and clinical staff. Demo data only.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card card-hover relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.tone} opacity-60 pointer-events-none`}
              />
              <div className="relative">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-white shadow-card ${f.accent}`}
                >
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="mt-4 font-semibold text-slate-800">
                  {f.title}
                </div>
                <div className="text-sm text-slate-600 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        Demo only. Not medical advice. No real patient data used.
      </p>
    </div>
  );
}
