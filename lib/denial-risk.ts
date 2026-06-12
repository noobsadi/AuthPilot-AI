import { AuthRequest, REQUIRED_DOCS } from "./mock-data";

export interface DenialRiskResult {
  score: number; // 0-100
  level: "Low" | "Moderate" | "High" | "Very High";
  factors: { name: string; weight: number; detail: string }[];
  recommendation: string;
}

export function computeDenialRisk(input: {
  payer: string;
  service: string;
  diagnosis: string;
  clinicalNotes: string;
  urgency: string;
  requiredDocs?: string[];
}): DenialRiskResult {
  const factors: { name: string; weight: number; detail: string }[] = [];
  let score = 20; // baseline

  const notes = (input.clinicalNotes || "").toLowerCase();
  const diagnosis = (input.diagnosis || "").toLowerCase();
  const docs = input.requiredDocs ?? [];

  // Payer-specific historical risk
  const payerRisk: Record<string, number> = {
    Aetna: 5,
    "Blue Cross Blue Shield": 7,
    Cigna: 14,
    UnitedHealthcare: 4,
    Humana: 18,
    Medicare: -8,
    Medicaid: 9,
  };
  const pr = payerRisk[input.payer] ?? 6;
  if (pr !== 0) {
    factors.push({
      name: "Payer history",
      weight: pr,
      detail: `${input.payer} historical approval profile.`,
    });
    score += pr;
  }

  // Service complexity
  const highComplexity = [
    "spinal cord stimulator",
    "gastric bypass",
    "sleeve",
    "fusion",
  ];
  if (
    highComplexity.some((k) => input.service.toLowerCase().includes(k))
  ) {
    factors.push({
      name: "High-complexity service",
      weight: 15,
      detail: "Service often requires peer-to-peer review and extra documentation.",
    });
    score += 15;
  }

  // Documentation completeness
  const missingDocs = REQUIRED_DOCS.filter((d) => !docs.includes(d));
  if (missingDocs.length > 0) {
    const penalty = Math.min(25, missingDocs.length * 4);
    factors.push({
      name: "Missing documentation",
      weight: penalty,
      detail: `Missing ${missingDocs.length} typical document(s): ${missingDocs
        .slice(0, 3)
        .join(", ")}.`,
    });
    score += penalty;
  }

  // Clinical note quality signals
  if (notes.length < 80) {
    factors.push({
      name: "Thin clinical narrative",
      weight: 10,
      detail: "Clinical notes are short — add objective findings, prior therapies, and functional impact.",
    });
    score += 10;
  } else if (notes.length > 200) {
    factors.push({
      name: "Detailed narrative",
      weight: -6,
      detail: "Clinical notes include relevant history and prior treatment.",
    });
    score -= 6;
  }

  // Conservative therapy
  const conservativeSignals = [
    "pt",
    "physical therapy",
    "nsaid",
    "conservative",
    "failed",
    "tried",
  ];
  if (conservativeSignals.some((k) => notes.includes(k))) {
    factors.push({
      name: "Conservative therapy documented",
      weight: -8,
      detail: "Notes reference failed conservative treatment.",
    });
    score -= 8;
  } else {
    factors.push({
      name: "No conservative therapy mentioned",
      weight: 8,
      detail: "Payers often require evidence of prior conservative management.",
    });
    score += 8;
  }

  // Urgency vs service alignment
  if (input.urgency === "Emergent" && !notes.includes("emerg")) {
    factors.push({
      name: "Urgency not justified",
      weight: 5,
      detail: "Emergent urgency without supporting narrative may trigger review.",
    });
    score += 5;
  }

  // Diagnosis specificity
  if (!/\b[MGS]\d{2}/.test(diagnosis) && diagnosis.length > 0) {
    factors.push({
      name: "Diagnosis lacks ICD-10 code",
      weight: 4,
      detail: "Add an ICD-10 code to support medical necessity.",
    });
    score += 4;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let level: DenialRiskResult["level"] = "Low";
  if (score >= 70) level = "Very High";
  else if (score >= 50) level = "High";
  else if (score >= 30) level = "Moderate";

  const recommendation =
    level === "Very High"
      ? "Escalate to medical director and prepare a peer-to-peer review with detailed medical necessity documentation."
      : level === "High"
      ? "Address the top documentation gaps before submission and consider a pre-call to the payer."
      : level === "Moderate"
      ? "Tighten the clinical narrative and ensure all supporting documents are attached."
      : "Documentation is solid. Submit and monitor for payer response.";

  return { score, level, factors, recommendation };
}
