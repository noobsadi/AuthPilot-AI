# AuthPilot AI — Healthcare Prior Authorization Copilot

**Built for VCP Final Round — Build Fest 2026**

AuthPilot AI is an AI-assisted healthcare workflow system designed to simplify and speed up the insurance prior authorization process. It helps healthcare administrative teams validate documentation, predict denial risk, draft payer communication, and manage escalation workflows from one simple dashboard.

> **Demo Notice:** This project is a 60-minute MVP demo built for Build Fest 2026. It uses mock data and mock external integrations only. No real patient data, real PHI, real EHR data, or real insurance API is used.

---

## Problem Statement

Prior authorization is one of the most time-consuming administrative processes in healthcare.

Before a patient can receive certain services such as MRI, CT scan, specialty medication, therapy, or surgery consultation, clinics often need approval from insurance payers. This process usually involves checking eligibility, collecting clinical documentation, preparing payer-specific forms, communicating with insurance companies, tracking approval or denial status, and preparing appeals or escalations.

If documentation is incomplete or unclear, requests may be delayed or denied. This increases staff workload, delays patient care, and puts clinic revenue at risk.

---

## Solution

**AuthPilot AI** acts as a healthcare prior authorization copilot.

It does not make medical decisions. Instead, it assists healthcare administrative and clinical support teams by checking missing documents, identifying documentation gaps, summarizing medical necessity, predicting denial risk, drafting payer communication, suggesting escalation next steps, and organizing prior authorization workflow status.

The goal is to help teams submit cleaner, more complete prior authorization requests faster.

---

## Key Features

### Dashboard

The dashboard gives a quick overview of the prior authorization workload:

* Pending authorization requests
* Approved requests
* Denial-risk cases
* Missing documentation cases
* Average turnaround time
* Weekly authorization chart
* Recent activity

### Prior Authorization Request Center

The request center organizes authorization cases by workflow status:

* Draft
* Needs Documentation
* Ready to Submit
* Submitted
* Approved
* Denied
* Escalated

Each request card shows patient initials only, requested service or procedure, diagnosis summary, payer, urgency, current status, and denial risk level.

Available actions include document validation, payer packet generation, denial risk prediction, and escalation support.

### New Request AI Validation

Clinic staff can create a new prior authorization request using mock patient initials and clinical details.

The AI validation flow checks missing documents, weak clinical notes, medical necessity summary, denial risk score, and suggested next steps.

This helps staff fix documentation gaps before submission.

### Payer Communication Assistant

AuthPilot AI can generate professional draft messages for payer communication, including:

* Prior authorization cover letter
* Payer portal message
* Phone call script
* Appeal or denial response draft

All generated messages are drafts and must be reviewed by clinic staff before sending.

### Analytics

The analytics page shows mock operational insights such as approval rate, denial rate, average turnaround time, top denial reasons, payer-wise performance, and revenue at risk estimate.

These insights help clinics understand where delays and denials are happening.

### Floating AI Copilot

The app includes an interactive AI copilot with quick actions:

* Summarize this case
* What documents are missing?
* Predict denial risk
* Draft payer message
* Escalation next step

The copilot gives practical administrative guidance, not medical advice.

---

## Business Value

AuthPilot AI helps healthcare organizations by reducing administrative workload, catching documentation gaps earlier, lowering avoidable rework, improving approval readiness, speeding up payer communication, supporting escalation workflows, protecting revenue at risk, and helping staff manage prior authorization cases more clearly.

The main value is simple:

**Cleaner requests + faster communication + fewer avoidable denials = better workflow efficiency and stronger revenue protection.**

---

## Safety and Privacy Note

This project is a demo MVP.

* No real patient data is used
* No real PHI is included
* Patient information uses initials only
* No real EHR integration is used
* No real payer API is used
* The app is not medical advice
* The AI does not approve or deny care
* Final review must remain with licensed clinical staff and payer reviewers

---

## Tech Stack

* **Framework:** Next.js App Router
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** lucide-react
* **Charts:** Recharts
* **AI:** DeepSeek API, optional
* **Fallback:** Mock AI responses if `DEEPSEEK_API_KEY` is not available
* **Deployment:** Vercel

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

The API key is optional. If it is not provided, the app will use mock AI responses so the demo still works.

Also include `.env.example`:

```env
DEEPSEEK_API_KEY=
```

---

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```bash
http://localhost:3000
```

Build the project:

```bash
npm run build
```

---

## Deployment on Vercel

Push the project to GitHub:

```bash
git add .
git commit -m "build AuthPilot AI MVP"
git push
```

Deploy with Vercel:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

Optional Vercel environment variable:

```env
DEEPSEEK_API_KEY=
```

If no API key is added, the demo will still run using mock AI responses.

---

## Project Context

This project was created for:

**VCP Final Round — Build Fest 2026**

Challenge:

**AI Healthcare Prior Authorization Copilot**

Goal:

Build an AI-assisted healthcare workflow system that automates and simplifies prior authorization requests, clinical documentation validation, eligibility-style checks, payer communication, denial prediction, and escalation workflows.

---

## Disclaimer

AuthPilot AI is a demo product and should not be used for real clinical, payer, or patient decisions without proper compliance, security, clinical validation, and healthcare integration.

This app is not medical advice and does not replace healthcare professionals, insurance reviewers, or compliance teams.
