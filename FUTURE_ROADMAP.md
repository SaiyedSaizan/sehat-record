# Future Roadmap

## OCR and extraction

- Add image preprocessing for skew correction, denoising, and multi-page PDF support
- Plug in multilingual OCR for English plus Indian-language prescription headers and notes
- Add confidence scores by field so low-confidence medicine names are highlighted in review
- Introduce doctor-signature, clinic-stamp, and date parsing helpers
- Add LLM-based structuring after OCR to normalize medicine names, dosage patterns, and test advice

## ABDM integration

- Add ABDM-linked patient consent flows
- Support importing records from ABDM-compliant providers where available
- Map visits and prescriptions to ABDM-aligned document structures
- Add audit logs for consented data pulls and document shares

## Doctor onboarding

- Add doctor and clinic accounts with lightweight onboarding
- Let clinics upload prescriptions directly after each visit
- Create a consultation handoff mode for front-desk staff
- Add specialty-specific summary modules for diabetology, cardiology, pediatrics, and pulmonology

## Pharmacy integration

- Add medicine-name normalization against pharmacy catalogs
- Enable pharmacy reconciliation for substituted brands vs generic molecules
- Add refill reminders for chronic medicines after prescription duration ends
- Support printable patient medication sheets in simple language

## Hospital and clinic partnerships

- Offer white-labeled clinic dashboards for small practices and diagnostic centers
- Build record-sharing workflows between family members, patients, and clinics
- Add document intake for lab reports and discharge summaries
- Create analytics around repeat visits, missing tests, and medication duplication patterns

## Product depth

- Add multilingual patient UI starting with Hindi and English
- Add family health locker views for children and parents
- Add secure document sharing with time-bound links
- Add role-aware access and stronger audit history once the MVP moves beyond demo mode
