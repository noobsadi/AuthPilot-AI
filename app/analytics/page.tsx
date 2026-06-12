"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { CheckCircle2, XCircle, Clock, DollarSign, AlertTriangle, TrendingUp, Download } from "lucide-react";
import { REQUESTS, DENIAL_REASONS, PAYER_PERFORMANCE, WEEKLY_CHART } from "@/lib/mock-data";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AnalyticsPage() {
  const total = REQUESTS.length;
  const approved = REQUESTS.filter((r) => r.status === "Approved").length;
  const denied = REQUESTS.filter((r) => r.status === "Denied").length;
  const approvalRate = total ? Math.round((approved / total) * 100) : 0;
  const denialRate = total ? Math.round((denied / total) * 100) : 0;
  const turnaround = (
    REQUESTS.filter((r) => r.turnaroundDays).reduce((a, r) => a + (r.turnaroundDays ?? 0), 0) /
    REQUESTS.filter((r) => r.turnaroundDays).length
  ).toFixed(1);
  const revenueAtRisk = REQUESTS.filter((r) => r.denialRisk >= 60).length * 4250;

  const highRisk = REQUESTS.filter((r) => r.denialRisk >= 60);

  const exportHighRiskCsv = () => {
    const header = ["Case", "Patient", "Service", "Payer", "Risk"];
    const rows: (string | number)[][] = [header, ...highRisk.map((r) => [r.id, r.patientInitials, r.service, r.payer, r.denialRisk])];
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`authpilot-high-risk-${stamp}.csv`, rows);
  };

  const exportSummaryCsv = () => {
    const header = ["Metric", "Value"];
    const rows: (string | number)[][] = [
      header,
      ["Total requests", total],
      ["Approved", approved],
      ["Denied", denied],
      ["Approval rate %", approvalRate],
      ["Denial rate %", denialRate],
      ["Avg turnaround days", turnaround],
      ["Revenue at risk USD", revenueAtRisk],
    ];
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`authpilot-summary-${stamp}.csv`, rows);
  };

  const stats = [
    { label: "Approval rate", value: `${approvalRate}%`, icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-700" },
    { label: "Denial rate", value: `${denialRate}%`, icon: XCircle, tone: "bg-rose-100 text-rose-700" },
    { label: "Avg turnaround", value: `${turnaround}d`, icon: Clock, tone: "bg-brand-100 text-brand-700" },
    { label: "Revenue at risk", value: `$${revenueAtRisk.toLocaleString()}`, icon: DollarSign, tone: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-600">
            Operational metrics across the prior authorization pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={exportSummaryCsv}
          className="btn-secondary inline-flex items-center gap-2 text-sm"
        >
          <Download className="h-4 w-4" /> Export summary CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card !p-4">
            <div className={`grid h-9 w-9 place-items-center rounded-lg ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-slate-800">Top denial reasons</h2>
          <p className="text-xs text-slate-500 mb-2">Mock dataset for demo purposes</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DENIAL_REASONS} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#475569" }} />
                <YAxis
                  dataKey="reason"
                  type="category"
                  width={150}
                  tick={{ fontSize: 12, fill: "#475569" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800">Weekly trend</h2>
          <p className="text-xs text-slate-500 mb-2">Submitted vs approved</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="submitted"
                  name="Submitted"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-800">Payer-wise performance</h2>
          <p className="text-xs text-slate-500 mb-2">Approval rate by payer</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PAYER_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="payer" tick={{ fontSize: 12, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="approval" name="Approval %" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDays" name="Avg days" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" /> High-risk cases to review
          </h2>
          <button
            type="button"
            onClick={exportHighRiskCsv}
            disabled={highRisk.length === 0}
            className="btn-ghost inline-flex items-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th className="py-2">Case</th>
                <th>Patient</th>
                <th>Service</th>
                <th>Payer</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {highRisk.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 font-mono text-xs">{r.id}</td>
                  <td>{r.patientInitials}</td>
                  <td className="text-slate-700">{r.service}</td>
                  <td className="text-slate-700">{r.payer}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.denialRisk >= 70
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3" /> {r.denialRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
