"use client";

import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  FileText,
  AlertTriangle,
  Activity,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  REQUESTS,
  WEEKLY_CHART,
  DENIAL_REASONS,
  RECENT_ACTIVITY,
  PAYER_PERFORMANCE,
} from "@/lib/mock-data";
// StatusBadge / RiskBadge intentionally not used in this view; activity items
// render a lightweight type chip instead because RECENT_ACTIVITY does not
// carry `status` or `risk` fields.

const DENIAL_COLORS = ["#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6", "#64748b"];

const KPI = [
  {
    label: "Approved",
    value: REQUESTS.filter((r) => r.status === "Approved").length,
    sub: "of all requests",
    Icon: CheckCircle2,
    tone: "from-emerald-500 to-teal-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    label: "Denied",
    value: REQUESTS.filter((r) => r.status === "Denied").length,
    sub: "requires follow-up",
    Icon: XCircle,
    tone: "from-rose-500 to-pink-500",
    chip: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  {
    label: "Avg turnaround",
    value: "3.6d",
    sub: "submission → decision",
    Icon: Clock,
    tone: "from-indigo-500 to-brand-500",
    chip: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  {
    label: "Revenue at risk",
    value: "$184k",
    sub: "2 high-risk cases",
    Icon: AlertTriangle,
    tone: "from-amber-500 to-orange-500",
    chip: "bg-amber-50 text-amber-700 ring-amber-100",
  },
];

export default function DashboardPage() {
  const total = REQUESTS.length;
  const approved = REQUESTS.filter((r) => r.status === "Approved").length;
  const denied = REQUESTS.filter((r) => r.status === "Denied").length;
  const inProgress = REQUESTS.filter(
    (r) => !["Approved", "Denied"].includes(r.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <Activity className="h-3.5 w-3.5" /> Operational dashboard
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Today&apos;s prior authorization activity at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/requests" className="btn-secondary">
            <FileText className="h-4 w-4" /> All requests
          </Link>
          <Link href="/new-request" className="btn-primary">
            New request <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k) => (
          <div
            key={k.label}
            className="card card-hover relative overflow-hidden"
          >
            <div
              className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${k.tone} opacity-10 blur-2xl pointer-events-none`}
            />
            <div className="relative flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl text-white bg-gradient-to-br ${k.tone} shadow-soft`}
              >
                <k.Icon className="h-5 w-5" />
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider rounded-full ring-1 px-2 py-0.5 ${k.chip}`}
              >
                {k.sub}
              </span>
            </div>
            <div className="relative mt-4 text-3xl font-bold text-slate-900">
              {k.value}
            </div>
            <div className="relative text-sm text-slate-500 mt-0.5">
              {k.label}
            </div>
          </div>
        ))}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold text-slate-800">
                Submissions vs approvals
              </h2>
              <p className="text-xs text-slate-500">Last 6 weeks · mock data</p>
            </div>
            <span className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <BarChart3 className="h-3.5 w-3.5" /> Weekly
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WEEKLY_CHART}
                margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="bs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b6bf3" />
                    <stop offset="100%" stopColor="#3b6bf3" stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="ba" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16b27a" />
                    <stop offset="100%" stopColor="#16b27a" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(59,107,243,0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="submitted"
                  fill="url(#bs)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="approved"
                  fill="url(#ba)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800">Denial reasons</h2>
          <p className="text-xs text-slate-500 mb-2">Top categories · this month</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DENIAL_REASONS}
                  dataKey="value"
                  nameKey="reason"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {DENIAL_REASONS.map((_, i) => (
                    <Cell
                      key={i}
                      fill={DENIAL_COLORS[i % DENIAL_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#475569" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Funnel summary + activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-1">
          <h2 className="font-semibold text-slate-800">Pipeline</h2>
          <p className="text-xs text-slate-500 mb-4">Where requests stand</p>

          <div className="space-y-3">
            <PipelineRow
              label="Approved"
              value={approved}
              total={total}
              tone="bg-emerald-500"
              text="text-emerald-700"
            />
            <PipelineRow
              label="In progress"
              value={inProgress}
              total={total}
              tone="bg-brand-500"
              text="text-brand-700"
            />
            <PipelineRow
              label="Denied"
              value={denied}
              total={total}
              tone="bg-rose-500"
              text="text-rose-700"
            />
          </div>

          <div className="divider my-4" />

          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Payer performance
          </h3>
          <ul className="mt-3 space-y-2">
            {PAYER_PERFORMANCE.map((p) => (
              <li
                key={p.payer}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-700">{p.payer}</span>
                <span className="text-slate-500 tabular-nums">
                  {p.approval}% · {p.avgDays}d
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Recent activity</h2>
              <p className="text-xs text-slate-500">Latest system events</p>
            </div>
            <Link
              href="/requests"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="mt-3 divide-y divide-slate-100">
            {RECENT_ACTIVITY.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700 shrink-0">
                    <Activity className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm text-slate-800 truncate">
                      {a.text}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {a.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`badge ring-1 ${
                      a.type === "success"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : a.type === "danger"
                          ? "bg-rose-50 text-rose-700 ring-rose-100"
                          : a.type === "warning"
                            ? "bg-amber-50 text-amber-700 ring-amber-100"
                            : "bg-brand-50 text-brand-700 ring-brand-100"
                    }`}
                  >
                    {a.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            Denials down 8% week-over-week
          </div>
        </div>
      </section>
    </div>
  );
}

function PipelineRow({
  label,
  value,
  total,
  tone,
  text,
}: {
  label: string;
  value: number;
  total: number;
  tone: string;
  text: string;
}) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${text}`}>{label}</span>
        <span className="text-slate-500 tabular-nums">
          {value} · {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${tone} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
