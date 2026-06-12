import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/validation-engine";
import { callDeepSeek } from "@/lib/deepseek";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateRequest(body ?? {});

    // Optional DeepSeek enhancement
    const prompt = `You are an admin/clinical staff assistant for a healthcare prior authorization workflow. This is a DEMO. Do NOT provide medical diagnosis or treatment advice. Summarize the case and list any extra documentation or payer-specific tips in 4-6 short bullet points.

Patient initials: ${body.patientInitials ?? "n/a"}
Age range: ${body.ageRange ?? "n/a"}
Payer: ${body.payer ?? "n/a"}
Service: ${body.service ?? "n/a"}
Diagnosis: ${body.diagnosis ?? "n/a"}
Urgency: ${body.urgency ?? "n/a"}
Notes: ${body.clinicalNotes ?? "n/a"}
Selected docs: ${(body.requiredDocs ?? []).join(", ")}`;

    const ai = await callDeepSeek({
      messages: [
        {
          role: "system",
          content:
            "You are AuthPilot AI, a demo prior-authorization assistant. Be concise, professional, and admin-focused. No medical advice.",
        },
        { role: "user", content: prompt },
      ],
    });

    return NextResponse.json({
      ...result,
      aiNotes: ai,
      source: ai ? "deepseek" : "mock",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
