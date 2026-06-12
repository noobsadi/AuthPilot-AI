"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Inbox,
  Calendar,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Activity,
  Stethoscope,
} from "lucide-react";
import {
  REQUESTS,
  REQUIRED_DOCS,
  type AuthRequest,
  type Status,
  type Urgency,
} from "@/lib/mock-data";
import { StatusBadge, UrgencyBadge, RiskBadge } from "@/components/StatusBadge";

const COLUMNS: {
  key: Status;
  title: string;
  tone: string;
  dot: string;
}[] = [
  {
    key: "Draft",
    title: "Draft",
    tone: "from-slate-500/10 to-slate-500/0",
    dot: "bg-slate-400",
  },
  {
    key: "Needs Documentation",
    title: "Needs docs",
    tone: "from-amber-500/10 to-amber-500/0",
    dot: "bg-amber-500",
  },
  {
    key: "Ready to Submit",
    title: "Ready",
    tone: "from-sky-500/10 to-sky-500/0",
    dot: "bg-sky-500",
  },
  {
    key: "Submitted",
    title: "Submitted",
    tone: "from-indigo-500/10 to-indigo-500/0",
    dot: "bg-indigo-500",
  },
  {
    key: "Approved",
    title: "Approved",
    tone: "from-emerald-500/10 to-emerald-500/0",
    dot: "bg-emerald-500",
  },
  {
    key: "Denied",
    title: "Denied",
    tone: "from-rose-500/10 to-rose-500/0",
    dot: "bg-rose-500",
  },
  {
    key: "Escalated",
    title: "Escalated",
    tone: "from-orange-500/10 to-orange-500/0",
    dot: "bg-orange-500",
  },
];

type View = "kanban" | "list";

export default function RequestsPage() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<View>("kanban");
  const [urgency, setUrgency] = useState<"all" | Urgency>("all");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return REQUESTS.filter((r) => {
      if (urgency !== "all" && r.urgency !== urgency) return false;
      if (!term) return true;
      return (
        r.id.toLowerCase().includes(term) ||
        r.patientInitials.toLowerCase().includes(term) ||
        r.service.toLowerCase().includes(term) ||
        r.payer.toLowerCase().includes(term)
      );
    });
  }, [q, urgency]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <Inbox className="h-3.5 w-3.5" /> Request center
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Prior auth requests
          </h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {REQUESTS.length} cases · status tracked
            end-to-end
          </p>
        </div>
        <Link href="/new-request" className="btn-primary self-start sm:self-auto">
          + New request
        </Link>
      </div>

      {/* Filters */}
      <div className="card flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by case, patient initials, service, or payer…"
            className="input pl-9"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200">
            {(["all", "Routine", "Urgent", "Emergent"] as const).map((u) => {
              const active = urgency === u;
              return (
                <button
                  key={u}
                  onClick={() => setUrgency(u)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    active
                      ? "bg-white text-brand-700 shadow-card"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {u === "all" ? "All" : u}
                </button>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200">
            <button
              onClick={() => setView("kanban")}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                view === "kanban"
                  ? "bg-white text-brand-700 shadow-card"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                view === "list"
                  ? "bg-white text-brand-700 shadow-card"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <ListIcon className="h-3.5 w-3.5" /> List
            </button>
          </div>

          <button className="btn-secondary">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const items = filtered.filter((r) => r.status === col.key);
            return (
              <div
                key={col.key}
                className="card !p-4 relative overflow-hidden"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-12 bg-gradient-to-b ${col.tone} pointer-events-none`}
                />
                <div className="relative flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                    <h3 className="font-semibold text-slate-800">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums bg-white/80 ring-1 ring-slate-200 rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-6 text-center border border-dashed border-slate-200 rounded-xl">
                      No cases in this stage
                    </div>
                  ) : (
                    items.map((r) => <RequestCard key={r.id} req={r} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="card !p-0 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 bg-slate-50/60">
            <div className="col-span-3">Case</div>
            <div className="col-span-3">Service</div>
            <div className="col-span-2">Payer</div>
            <div className="col-span-1 text-center">Urgency</div>
            <div className="col-span-1 text-center">Risk</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1" />
          </div>
          <ul className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-slate-500">
                No matching requests.
              </li>
            )}
            {filtered.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-slate-50/70 transition"
              >
                <div className="col-span-3 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {r.id}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {r.patientInitials} · {r.ageRange}
                  </div>
                </div>
                <div className="col-span-3 text-sm text-slate-700 truncate">
                  {r.service}
                </div>
                <div className="col-span-2 text-sm text-slate-700 truncate">
                  {r.payer}
                </div>
                <div className="col-span-1 flex justify-center">
                  <UrgencyBadge urgency={r.urgency} />
                </div>
                <div className="col-span-1 flex justify-center">
                  <RiskBadge risk={r.denialRisk} />
                </div>
                <div className="col-span-1 flex justify-center">
                  <StatusBadge status={r.status} withIcon={false} />
                </div>
                <div className="col-span-1 text-right">
                  <Link
                    href={`/requests/${r.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RequestCard({ req }: { req: AuthRequest }) {
  const required = req.requiredDocs ?? [];
  const have = required.length;
  const totalPossible = REQUIRED_DOCS.length;
  // Treat unlisted docs as "missing" relative to the full template.
  const missing = Math.max(0, totalPossible - have);
  const completeness = totalPossible === 0 ? 100 : Math.round((have / totalPossible) * 100);

  return (
    <Link
      href={`/requests/${req.id}`}
      className="block rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-3.5 hover:shadow-card hover:border-brand-200 transition group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-white text-xs font-bold shrink-0">
            {req.patientInitials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">
              {req.id}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {req.patientInitials} · {req.ageRange}
            </div>
          </div>
        </div>
        <UrgencyBadge urgency={req.urgency} />
      </div>

      <div className="mt-3 text-sm text-slate-700 line-clamp-2">
        {req.service}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {req.createdAt}
        </span>
        <span>{req.payer}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Docs</span>
            <span className="tabular-nums">
              {have}/{totalPossible}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-brand-gradient rounded-full"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
        <RiskBadge risk={req.denialRisk} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 text-slate-500">
          <Activity className="h-3 w-3" />{" "}
          {missing === 0 ? "Complete" : `${missing} missing`}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand-700 group-hover:translate-x-0.5 transition">
          Open <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
