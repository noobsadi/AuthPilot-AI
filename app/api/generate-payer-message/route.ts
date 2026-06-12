import { NextRequest, NextResponse } from "next/server";
import { REQUESTS } from "@/lib/mock-data";
import { callDeepSeek } from "@/lib/deepseek";

export const runtime = "nodejs";

type OutputType = "cover" | "portal" | "phone" | "appeal";

const TITLES: Record<OutputType, string> = {
  cover: "Prior Authorization Cover Letter",
  portal: "Payer Portal Message",
  phone: "Phone Call Script",
  appeal: "Appeal / Denial Response Draft",
};

function buildMock(type: OutputType, ctx: any): string {
  const r = REQUESTS.find((x) => x.id === ctx.requestId) ?? REQUESTS[0];
  const payer = ctx.payer || r.payer;
  const service = ctx.service || r.service;
  const diagnosis = ctx.diagnosis || r.diagnosis;
  const notes = ctx.notes || r.clinicalNotes;
  const initials = ctx.initials || r.patientInitials;

  if (type === "cover") {
    return `Subject: Prior Authorization Request — ${r.id} (${service})

Dear ${payer} Prior Authorization Team,

We are submitting a prior authorization request for patient ${initials} for ${service}. The patient has a documented diagnosis of ${diagnosis}.

Clinical summary:
${notes}

Enclosed documents include the physician order, recent clinical note, and supporting diagnostic results. We respectfully request timely review given the ${r.urgency.toLowerCase()} nature of this case.

Please contact our office with any questions. Thank you for your prompt attention.

Sincerely,
AuthPilot AI (Demo) — on behalf of the care team`;
  }
  if (type === "portal") {
    return `[${payer} Provider Portal — Secure Message]

Request ID: ${r.id}
Patient: ${initials}
Service: ${service}
Diagnosis: ${diagnosis}
Urgency: ${r.urgency}

Hello ${payer} team — we are submitting a prior authorization packet for the above case. Clinical notes document the patient's history and prior management. Please confirm receipt and provide an expected turnaround time. We are available for a peer-to-peer review at your convenience.

Thank you,
Care team`;
  }
  if (type === "phone") {
    return `Phone Call Script — ${payer} PA Department

Opening:
"Hello, this is [Name] calling from [Clinic] regarding prior authorization request ${r.id} for patient ${initials}."

Reference:
"Patient is being seen for ${diagnosis}. We are requesting ${service}, urgency ${r.urgency}."

Key talking points:
- Documented diagnosis and clinical findings: ${notes.slice(0, 140)}...
- Patient has tried appropriate conservative measures where applicable.
- Supporting documents (order, notes, imaging) are attached and available.

Ask:
"Can you confirm the expected turnaround time and whether a peer-to-peer review will be required?"

Close:
"Thank you for your time. I'll document this call in the patient's record."`;
  }
  // appeal
  return `Appeal Letter — Request ${r.id} (${service})

Dear ${payer} Appeals Team,

We are writing to appeal the denial of prior authorization request ${r.id} for patient ${initials} regarding ${service}.

Basis for appeal:
- The service is medically necessary based on the documented diagnosis of ${diagnosis}.
- Clinical notes support the request: ${notes.slice(0, 200)}...
- Appropriate clinical criteria and payer guidelines support approval.

Requested action:
Please review the enclosed clinical documentation and reconsider approval. We are available for a peer-to-peer discussion with your medical director.

Thank you,
AuthPilot AI (Demo) — care team`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type: OutputType = body.type ?? "cover";
    const title = TITLES[type] ?? "Payer Message";
    const prompt = `Generate a ${title.toLowerCase()} for the following prior authorization case. Keep it professional, concise, and admin-focused. No medical advice.

Payer: ${body.payer ?? "n/a"}
Patient initials: ${body.initials ?? "n/a"}
Service: ${body.service ?? "n/a"}
Diagnosis: ${body.diagnosis ?? "n/a"}
Urgency: ${body.urgency ?? "Routine"}
Notes: ${body.notes ?? "n/a"}`;

    const ai = await callDeepSeek({
      messages: [
        {
          role: "system",
          content:
            "You are AuthPilot AI, a demo prior-authorization assistant. Be concise, professional, and admin-focused. No medical advice.",
        },
        { role: "user", content: prompt },
      ],
      maxTokens: 700,
    });

    const text = ai ?? buildMock(type, body);
    return NextResponse.json({ title, text, source: ai ? "deepseek" : "mock" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
