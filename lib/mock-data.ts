export type Urgency = "Routine" | "Urgent" | "Emergent";
export type Status =
  | "Draft"
  | "Needs Documentation"
  | "Ready to Submit"
  | "Submitted"
  | "Approved"
  | "Denied"
  | "Escalated";

export interface AuthRequest {
  id: string;
  patientInitials: string;
  ageRange: string;
  payer: string;
  service: string;
  diagnosis: string;
  clinicalNotes: string;
  urgency: Urgency;
  status: Status;
  denialRisk: number; // 0-100
  createdAt: string;
  turnaroundDays?: number;
  requiredDocs?: string[];
}

export const PAYERS = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Humana",
  "Medicare",
  "Medicaid",
];

export const SERVICES = [
  "MRI Lumbar Spine",
  "CT Chest w/ Contrast",
  "Sleep Study (Polysomnography)",
  "Knee Arthroscopy",
  "Continuous Positive Airway Pressure (CPAP)",
  "Spinal Cord Stimulator Trial",
  "Gastric Bypass Surgery",
  "Physical Therapy (12 weeks)",
  "Botulinum Toxin Injections",
  "Genetic Panel Testing",
];

export const REQUIRED_DOCS = [
  "Physician order / prescription",
  "Recent clinical note (< 30 days)",
  "Imaging report",
  "Lab results",
  "Conservative therapy documentation",
  "Letter of medical necessity",
  "Prior therapies tried",
  "Diagnosis ICD-10 code",
  "Procedure CPT code",
  "Specialist consult note",
];

export const REQUESTS: AuthRequest[] = [
  {
    id: "PA-1024",
    patientInitials: "J.D.",
    ageRange: "45-54",
    payer: "Aetna",
    service: "MRI Lumbar Spine",
    diagnosis: "Chronic low back pain with radiculopathy (M54.16)",
    clinicalNotes:
      "Patient failed 6 weeks of PT and NSAIDs. Pain 7/10, positive straight leg raise. Considering epidural steroid injection vs surgical consult.",
    urgency: "Urgent",
    status: "Needs Documentation",
    denialRisk: 62,
    createdAt: "2026-06-09",
    requiredDocs: [
      "Physician order / prescription",
      "Recent clinical note (< 30 days)",
      "Conservative therapy documentation",
      "Imaging report",
    ],
  },
  {
    id: "PA-1025",
    patientInitials: "M.R.",
    ageRange: "60-69",
    payer: "Medicare",
    service: "Sleep Study (Polysomnography)",
    diagnosis: "Obstructive sleep apnea, suspected (G47.33)",
    clinicalNotes:
      "STOP-BANG 6, witnessed apneas, daytime sleepiness (ESS 14). Comorbid HTN.",
    urgency: "Routine",
    status: "Ready to Submit",
    denialRisk: 18,
    createdAt: "2026-06-08",
    turnaroundDays: 3,
    requiredDocs: [
      "Physician order / prescription",
      "Recent clinical note (< 30 days)",
      "Sleep questionnaire (STOP-BANG / ESS)",
    ],
  },
  {
    id: "PA-1026",
    patientInitials: "A.K.",
    ageRange: "30-39",
    payer: "Cigna",
    service: "Spinal Cord Stimulator Trial",
    diagnosis: "Failed back surgery syndrome, chronic pain (G96.11)",
    clinicalNotes:
      "Two prior lumbar surgeries, chronic neuropathic pain, failed multiple meds. Candidate for SCS trial per pain specialist.",
    urgency: "Urgent",
    status: "Submitted",
    denialRisk: 71,
    createdAt: "2026-06-06",
    turnaroundDays: 5,
    requiredDocs: [
      "Letter of medical necessity",
      "Specialist consult note",
      "Prior therapies tried",
      "Psychological evaluation",
    ],
  },
  {
    id: "PA-1027",
    patientInitials: "S.T.",
    ageRange: "55-64",
    payer: "UnitedHealthcare",
    service: "CT Chest w/ Contrast",
    diagnosis: "Pulmonary nodule, follow-up (R91.1)",
    clinicalNotes:
      "Incidental 8mm nodule on CXR. Smoker 30 pack-years. Fleischner criteria suggest CT surveillance at 3 months.",
    urgency: "Urgent",
    status: "Approved",
    denialRisk: 12,
    createdAt: "2026-06-04",
    turnaroundDays: 2,
    requiredDocs: [
      "Physician order / prescription",
      "Recent clinical note (< 30 days)",
      "Prior imaging report",
    ],
  },
  {
    id: "PA-1028",
    patientInitials: "L.P.",
    ageRange: "25-34",
    payer: "Blue Cross Blue Shield",
    service: "Gastric Bypass Surgery",
    diagnosis: "Morbid obesity, BMI 44 (E66.01)",
    clinicalNotes:
      "BMI 44, comorbid OSA and HTN. Failed 6-month medically supervised weight loss program.",
    urgency: "Routine",
    status: "Denied",
    denialRisk: 84,
    createdAt: "2026-06-02",
    turnaroundDays: 7,
    requiredDocs: [
      "Letter of medical necessity",
      "Documentation of supervised weight loss program",
      "Psychological evaluation",
      "Nutritional counseling notes",
    ],
  },
  {
    id: "PA-1029",
    patientInitials: "R.W.",
    ageRange: "70-79",
    payer: "Humana",
    service: "Knee Arthroscopy",
    diagnosis: "Meniscal tear, left knee (S83.211A)",
    clinicalNotes:
      "Mechanical symptoms, failed conservative management. MRI confirms complex tear.",
    urgency: "Routine",
    status: "Escalated",
    denialRisk: 78,
    createdAt: "2026-06-01",
    turnaroundDays: 9,
    requiredDocs: [
      "Imaging report",
      "Conservative therapy documentation",
      "Letter of medical necessity",
    ],
  },
  {
    id: "PA-1030",
    patientInitials: "C.N.",
    ageRange: "40-49",
    payer: "Aetna",
    service: "Botulinum Toxin Injections",
    diagnosis: "Chronic migraine (G43.709)",
    clinicalNotes:
      "15+ headache days/month. Failed 3 preventive classes. Candidate for Botox per protocol.",
    urgency: "Routine",
    status: "Draft",
    denialRisk: 28,
    createdAt: "2026-06-10",
    requiredDocs: [
      "Headache diary",
      "Prior therapies tried",
      "Specialist consult note",
    ],
  },
  {
    id: "PA-1031",
    patientInitials: "B.H.",
    ageRange: "50-59",
    payer: "Medicaid",
    service: "CPAP Device",
    diagnosis: "Obstructive sleep apnea (G47.33)",
    clinicalNotes:
      "AHI 28 on home sleep test. Symptoms impacting daily function.",
    urgency: "Routine",
    status: "Submitted",
    denialRisk: 22,
    createdAt: "2026-06-05",
    turnaroundDays: 4,
    requiredDocs: [
      "Sleep study report",
      "Physician order / prescription",
    ],
  },
];

export const WEEKLY_CHART = [
  { day: "Mon", submitted: 12, approved: 8, denied: 2 },
  { day: "Tue", submitted: 15, approved: 11, denied: 1 },
  { day: "Wed", submitted: 9, approved: 6, denied: 3 },
  { day: "Thu", submitted: 18, approved: 13, denied: 2 },
  { day: "Fri", submitted: 14, approved: 10, denied: 1 },
  { day: "Sat", submitted: 6, approved: 4, denied: 1 },
  { day: "Sun", submitted: 4, approved: 3, denied: 0 },
];

export const DENIAL_REASONS = [
  { reason: "Insufficient documentation", count: 18 },
  { reason: "Not medically necessary", count: 14 },
  { reason: "Missing conservative therapy", count: 11 },
  { reason: "Coding / ICD-10 mismatch", count: 8 },
  { reason: "Out of network provider", count: 5 },
  { reason: "Duplicate request", count: 3 },
];

export const PAYER_PERFORMANCE = [
  { payer: "Aetna", approval: 78, avgDays: 3.2 },
  { payer: "BCBS", approval: 74, avgDays: 3.8 },
  { payer: "Cigna", approval: 68, avgDays: 4.5 },
  { payer: "UHC", approval: 81, avgDays: 2.9 },
  { payer: "Humana", approval: 62, avgDays: 5.1 },
  { payer: "Medicare", approval: 88, avgDays: 2.1 },
  { payer: "Medicaid", approval: 71, avgDays: 4.0 },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    text: "PA-1027 CT Chest approved by UnitedHealthcare",
    time: "2h ago",
    type: "success" as const,
  },
  {
    id: 2,
    text: "PA-1026 SCS trial submitted to Cigna — awaiting review",
    time: "4h ago",
    type: "info" as const,
  },
  {
    id: 3,
    text: "PA-1028 Gastric bypass denied — appeal recommended",
    time: "6h ago",
    type: "danger" as const,
  },
  {
    id: 4,
    text: "PA-1029 Knee arthroscopy escalated to medical director",
    time: "1d ago",
    type: "warning" as const,
  },
  {
    id: 5,
    text: "PA-1025 Sleep study documents validated, ready to submit",
    time: "1d ago",
    type: "success" as const,
  },
];
