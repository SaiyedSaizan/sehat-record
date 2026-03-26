# Risks and Guardrails

## Medical safety boundaries

- Sehat Record does not diagnose disease.
- Sehat Record does not recommend treatment changes.
- Patient-friendly summaries must stay explicitly uncertain and source-linked.
- The UI should keep using language like "as written in the prescription" and "please confirm with your doctor or pharmacist."
- Duplicate-risk flags are heuristics, not clinical decisions.

## Privacy considerations

- Health records are sensitive personal data and should be treated as such from the first production version.
- Any future cloud deployment should include encryption at rest, secure backups, access logs, and clear consent controls.
- Family access should be explicit and revocable.
- Any ABDM or provider integration should log what was imported, when, and under whose consent.

## Product boundaries

- This is not a hospital ERP.
- This is not an insurance workflow tool.
- This is not a doctor decision-support engine.
- This is not a medication adherence claims system.
- The product should remain focused on record organization, clarity, and continuity of care.

## Trust and UX guardrails

- Always show the original extracted record context alongside simplified wording.
- Always let users manually correct extracted fields.
- Never hide uncertainty when extraction confidence is low.
- Keep patient language simple and non-alarming.
- Avoid medical jargon on patient-facing screens unless paired with plain-language explanation.

## Operational risks for later stages

- OCR errors may silently create wrong medicine records if review friction is removed too aggressively.
- Incomplete records can mislead doctors if the product presents summaries with too much confidence.
- Brand-name variation in India can create duplicate or fragmented medication histories unless molecule mapping is introduced.
- Shared-family devices can create privacy leakage if access controls stay too weak beyond MVP stage.
