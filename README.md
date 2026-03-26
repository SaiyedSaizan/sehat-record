# Sehat Record

Sehat Record is a polished local-demo MVP for an Indian healthtech startup. It brings scattered paper prescriptions into one searchable record, simplifies medicines for patients in safer plain language, and gives doctors a summary view that saves OPD time.

## What the MVP includes

- Landing page with investor-demo-ready positioning
- Demo mode with 3 seeded patient stories
- Patient onboarding form
- Prescription upload flow with mock OCR/extraction and manual review
- Patient dashboard with search and date filters
- Prescription detail page with patient-friendly medicine explanations
- Patient timeline of visits, medicines, and tests
- Doctor summary page with conditions, allergies, current medicines, repeated prescriptions, prior tests, and overlap flags
- Profile/settings page for record ownership and edits
- SQLite database with Prisma client access

## Tech stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Prisma Client
- SQLite

## Quick start

1. Install dependencies.

```bash
npm install
```

2. Initialize the SQLite schema and generate the Prisma client.

```bash
npm run db:init
npm run db:push
```

3. Seed the demo dataset.

```bash
npm run db:seed
```

4. Start the app.

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Demo data included

The seed creates:

- 3 patients
- 9 visits across multiple doctors
- Chronic-care flow for diabetes and hypertension
- Elderly-parent record management use case
- Acute illness and respiratory follow-up use case
- Overlapping medication patterns for doctor-summary review
- Test recommendations across visits

## Core flows to show

- `Landing -> Demo -> Patient dashboard`
- `Upload prescription -> Review extraction -> Save`
- `Patient dashboard -> Prescription details`
- `Patient dashboard -> Timeline`
- `Patient dashboard -> Doctor summary`
- `Demo -> New patient onboarding`

## Project structure

```text
src/
  app/
    api/
    demo/
    onboarding/
    patients/[patientId]/
    prescriptions/[prescriptionId]/
  components/
  lib/
prisma/
  schema.prisma
  seed.mjs
scripts/
  init-db.mjs
```

## Notes on the mock extraction pipeline

The MVP uses a structured mock extractor in `src/lib/mock-extraction.ts`.

- `src/app/api/prescriptions/extract/route.ts` is the API boundary for OCR/extraction.
- Replace the mock extraction function with real OCR preprocessing and an LLM normalization step later.
- The review screen is intentionally editable because handwritten prescriptions and imperfect OCR need human correction.

## Verification

The app was verified with:

```bash
npm run lint
npm run build
```

## Product boundaries

- No diagnosis generation
- No treatment recommendation engine
- No claim of medical certainty beyond record summarization
- Patient-friendly wording is intentionally cautious and asks users to confirm details with their doctor or pharmacist
