import { NextRequest, NextResponse } from "next/server";
import { REQUESTS } from "@/lib/mock-data";
import { computeDenialRisk } from "@/lib/denial-risk";
import { validateRequest } from "@/lib/validation-engine";
import { callDeepSeek } from "@/lib/deepseek";

export const runtime = "nodejs";

const SYSTEM = `You are AuthPilot AI, a demo prior-authorization copilot for healthcare admin and clinical staff.
Be concise, professional, and admin-focused. Do NOT provide medical diagnosis or treatment advice. 
Help with: summarizing cases, finding missing documentation, predicting denial risk, drafting payer messages, and recommending escalation steps.`;

function pickRequest(id?: string) {
  return REQUESTS.find((r) => r.id === id) ?? REQUESTS[0];
}

function buildMockReply(message: string, reqId?: string): string {
  const r = pickRequest(reqId);
  const m = message.toLowerCase();
  const risk = computeDenialRisk({
    payer: r.payer,
    service: r.service,
    diagnosis: r.diagnosis,
    clinicalNotes: r.clinicalNotes,
    urgency: r.urgency,
    requiredDocs: r.requiredDocs,
  });
  const validation = validateRequest({
    patientInitials: r.patientInitials,
    ageRange: r.ageRange,
    payer: r.payer,
    service: r.service,
    diagnosis: r.diagnosis,
    clinicalNotes: r.clinicalNotes,
    urgency: r.urgency,
    requiredDocs: r.requiredDocs,
  });

  if (m.includes("summarize") || m.includes("summary")) {
    return `Case ${r.id} — ${r.service}\nPatient: ${r.patientInitials} (${r.ageRange})\nPayer: ${r.payer}\nDiagnosis: ${r.diagnosis}\nUrgency: ${r.urgency}\nStatus: ${r.status}\n\nKey points:\n- ${r.clinicalNotes}\n- Denial risk currently ${r.denialRisk}/100 (${risk.level}).`;
  }
  if (m.includes("missing") || m.includes("document")) {
    return `For case ${r.id}, missing or recommended documents:\n${
      validation.missingDocuments.length
        ? "• " + validation.missingDocuments.join("\n• ")
        : "• None from the standard checklist"
    }\n\nDocumentation gaps to address:\n${
      validation.documentationGaps.length
        ? "• " + validation.documentationGaps.join("\n• ")
        : "• No major gaps detected"
    }`;
  }
  if (m.includes("denial") || m.includes("risk")) {
    return `Denial risk for case ${r.id}: ${risk.score}/100 (${risk.level}).\n\nTop factors:\n${
      risk.factors
        .slice(0, 4)
        .map((f) => `• ${f.name} (${f.weight > 0 ? "+" : ""}${f.weight}): ${f.detail}`)
        .join("\n")
    }\n\nRecommendation: ${risk.recommendation}`;
  }
  if (m.includes("draft") || m.includes("payer message") || m.includes("message")) {
    return `Suggested payer portal message for ${r.payer} (case ${r.id}):\n\n"Hello ${r.payer} team — we are submitting a prior authorization request for ${r.service} for patient ${r.patientInitials} (${r.diagnosis}). Clinical notes are attached. Please confirm receipt and expected turnaround. We are available for a peer-to-peer review at your convenience. Thank you."`;
  }
  if (m.includes("escalat")) {
    return risk.score >= 60
      ? `Recommended next step: Escalate case ${r.id} to the medical director and prepare for a peer-to-peer review with ${r.payer}. Bundle the letter of medical necessity, prior therapy documentation, and specialist consult.`
      : `Case ${r.id} does not yet need escalation. Tighten documentation first, then reassess denial risk.`;
  }
  return `I can help with case ${r.id}. Try: "Summarize this case", "What documents are missing?", "Predict denial risk", "Draft payer message", or "Escalation next step".`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, requestId } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const r = pickRequest(requestId);
    const prompt = `Context case: ${r.id} — ${r.service} for ${r.patientInitials} under ${r.payer}. Status: ${r.status}. Notes: ${r.clinicalNotes}\n\nUser question: ${message}`;

    const ai = await callDeepSeek({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      maxTokens: 500,
    });

    const reply = ai ?? buildMockReply(message, requestId);
    return NextResponse.json({ reply, source: ai ? "deepseek" : "mock" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
