import { REQUIRED_DOCS } from "./mock-data";

export interface ValidationInput {
  patientInitials?: string;
  ageRange?: string;
  payer?: string;
  service?: string;
  diagnosis?: string;
  clinicalNotes?: string;
  urgency?: string;
  requiredDocs?: string[];
}

export interface ValidationResult {
  missingDocuments: string[];
  documentationGaps: string[];
  medicalNecessitySummary: string;
  denialRiskScore: number; // 0-100
  suggestedNextSteps: string[];
  completeness: number; // 0-100
}

export function validateRequest(input: ValidationInput): ValidationResult {
  const selected = input.requiredDocs ?? [];
  const missing = REQUIRED_DOCS.filter((d) => !selected.includes(d));

  const gaps: string[] = [];
  const notes = (input.clinicalNotes || "").toLowerCase();
  const diagnosis = input.diagnosis || "";
  const service = input.service || "";

  if (!input.patientInitials)
    gaps.push("Patient initials are missing.");
  if (!input.payer) gaps.push("Payer is not selected.");
  if (!input.service) gaps.push("Requested service is not specified.");
  if (!input.diagnosis) gaps.push("Diagnosis summary is empty.");
  if (!input.urgency) gaps.push("Urgency level is not set.");

  if (notes.length < 80)
    gaps.push(
      "Clinical notes are too brief — include onset, severity, prior treatments, and functional impact."
    );

  if (!/(m54|g47|e66|g43|r91|s83)/i.test(diagnosis))
    gaps.push(
      "Add a specific ICD-10 code to the diagnosis summary to support medical necessity."
    );

  if (
    /(surgery|arthroscopy|stimulator|bypass|implant)/i.test(service) &&
    !/physical therapy|conservative|nsaid|failed/i.test(notes)
  )
    gaps.push(
      "Payers typically require documented conservative therapy before approving surgical or implant procedures."
    );

  if (!input.ageRange) gaps.push("Patient age range is not provided.");

  // Medical necessity summary (template-based, no real medical advice)
  const necessity = `Request for ${service || "[service]"} for ${
    input.patientInitials || "[patient]"
  } (${
    input.ageRange || "[age]"
  }) under ${input.payer || "[payer]"}. Diagnosis: ${
    diagnosis || "[diagnosis]"
  }. The clinical narrative indicates the need for this service to support the patient's care plan. ${
    notes.length > 60 ? "Provider notes document relevant history and prior management." : "Notes may need additional clinical context."
  }`;

  // Simple composite score (0-100, higher = better quality)
  const fieldsPresent =
    [
      input.patientInitials,
      input.ageRange,
      input.payer,
      input.service,
      input.diagnosis,
      input.clinicalNotes,
      input.urgency,
    ].filter((x) => x && String(x).trim().length > 0).length / 7;
  const docScore = selected.length / REQUIRED_DOCS.length;
  const gapPenalty = Math.min(0.4, gaps.length * 0.07);
  const completeness = Math.max(
    0,
    Math.min(100, Math.round((fieldsPresent * 0.45 + docScore * 0.55) * 100 - gapPenalty * 100))
  );

  // Denial risk (inverse-ish mapping: 100 - completeness, then nudge by gaps)
  const denialRiskScore = Math.max(
    5,
    Math.min(95, 100 - completeness + gaps.length * 3)
  );

  const nextSteps: string[] = [];
  if (missing.length > 0)
    nextSteps.push(`Attach the ${missing.length} missing typical document(s).`);
  if (gaps.length > 0)
    nextSteps.push("Address documentation gaps in the clinical narrative.");
  if (denialRiskScore >= 60)
    nextSteps.push("Consider peer-to-peer escalation with the payer.");
  if (denialRiskScore < 30)
    nextSteps.push("Documentation looks strong — proceed to submission.");
  nextSteps.push("Generate a payer packet and cover letter before sending.");

  return {
    missingDocuments: missing,
    documentationGaps: gaps,
    medicalNecessitySummary: necessity,
    denialRiskScore,
    suggestedNextSteps: nextSteps,
    completeness,
  };
}
