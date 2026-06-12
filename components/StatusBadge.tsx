import { Status, Urgency } from "@/lib/mock-data";
import {
  FileText,
  FileWarning,
  Send,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

const STATUS_TONE: Record<Status, { label: string; cls: string; Icon: any }> = {
  Draft: {
    label: "Draft",
    cls: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    Icon: FileText,
  },
  "Needs Documentation": {
    label: "Needs Docs",
    cls: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    Icon: FileWarning,
  },
  "Ready to Submit": {
    label: "Ready",
    cls: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
    Icon: CheckCircle2,
  },
  Submitted: {
    label: "Submitted",
    cls: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    Icon: Send,
  },
  Approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Icon: CheckCircle2,
  },
  Denied: {
    label: "Denied",
    cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    Icon: XCircle,
  },
  Escalated: {
    label: "Escalated",
    cls: "bg-orange-50 text-orange-800 ring-1 ring-orange-200",
    Icon: ShieldAlert,
  },
};

const URGENCY_TONE: Record<Urgency, string> = {
  Routine: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  Urgent: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  Emergent: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export function StatusBadge({ status, withIcon = true }: { status: Status; withIcon?: boolean }) {
  const t = STATUS_TONE[status];
  const Icon = t.Icon;
  return (
    <span className={`badge ${t.cls}`}>
      {withIcon && <Icon className="h-3 w-3" />}
      {t.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return <span className={`badge ${URGENCY_TONE[urgency]}`}>{urgency}</span>;
}

export function RiskBadge({ risk }: { risk: number }) {
  const tone =
    risk >= 70
      ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
      : risk >= 40
      ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
      : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  const Icon = risk >= 40 ? AlertTriangle : CheckCircle2;
  return (
    <span className={`badge ${tone}`}>
      <Icon className="h-3 w-3" />
      Risk {risk}
    </span>
  );
}
