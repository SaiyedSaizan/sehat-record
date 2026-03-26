export type ExtractedMedication = {
  name: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions: string;
  reasonAsWritten: string;
};

export type ExtractionDraft = {
  doctorName: string;
  clinicName: string;
  visitDate: string;
  complaint: string;
  diagnosis: string;
  notes: string;
  patientSafeSummary: string;
  tests: { testName: string; instructions: string }[];
  medications: ExtractedMedication[];
  extractedText: string;
};

const sampleDrafts: Record<string, ExtractionDraft> = {
  fever: {
    doctorName: "Dr. Sana Farooq",
    clinicName: "Sunrise Family Clinic",
    visitDate: "2026-03-18",
    complaint: "Fever with sore throat and body ache",
    diagnosis: "Acute upper respiratory infection",
    notes: "Hydration advised. Return if fever persists beyond 3 days.",
    patientSafeSummary:
      "As written in the prescription, this appears to be treatment for a short fever and throat infection episode. Please confirm all medicine timings with your doctor or pharmacist.",
    tests: [
      { testName: "CBC", instructions: "Only if fever continues for more than 3 days" },
    ],
    medications: [
      {
        name: "Dolo 650",
        dosage: "650 mg",
        frequency: "1 tablet three times a day if fever",
        durationDays: 3,
        instructions: "After food if possible",
        reasonAsWritten: "fever and body ache relief",
      },
      {
        name: "Azithromycin",
        dosage: "500 mg",
        frequency: "1 tablet once daily",
        durationDays: 3,
        instructions: "After food",
        reasonAsWritten: "appears to be for throat infection",
      },
      {
        name: "Levocetirizine",
        dosage: "5 mg",
        frequency: "1 tablet at night",
        durationDays: 5,
        instructions: "Night-time use may feel drowsy",
        reasonAsWritten: "cold or throat irritation support",
      },
    ],
    extractedText:
      "Dr Sana Farooq / Sunrise Family Clinic / Fever + sore throat / Dolo 650 TDS x 3 days / Azithromycin OD x 3 days / Levocetirizine HS x 5 days / CBC if fever persists",
  },
  diabetes: {
    doctorName: "Dr. Raghav Menon",
    clinicName: "MetroCare Diabetes Centre",
    visitDate: "2026-03-12",
    complaint: "Sugar follow-up with tingling in feet",
    diagnosis: "Type 2 diabetes with hypertension follow-up",
    notes: "Continue home BP and sugar log.",
    patientSafeSummary:
      "As written in the prescription, this appears to be a follow-up for diabetes and blood pressure. Please confirm dose changes before continuing older strips or tablets at home.",
    tests: [
      { testName: "HbA1c", instructions: "Repeat in 3 months" },
      { testName: "Urine microalbumin", instructions: "Within 2 weeks" },
    ],
    medications: [
      {
        name: "Metformin XR",
        dosage: "500 mg",
        frequency: "1 tablet twice daily",
        durationDays: 30,
        instructions: "After meals",
        reasonAsWritten: "blood sugar control",
      },
      {
        name: "Telmisartan",
        dosage: "40 mg",
        frequency: "1 tablet every morning",
        durationDays: 30,
        instructions: "Same time daily",
        reasonAsWritten: "blood pressure protection",
      },
      {
        name: "Pregabalin",
        dosage: "75 mg",
        frequency: "1 capsule at night",
        durationDays: 15,
        instructions: "Usually taken in the evening",
        reasonAsWritten: "appears to be for nerve pain symptoms",
      },
    ],
    extractedText:
      "MetroCare Diabetes Centre / Dr Raghav Menon / T2DM FU / Metformin XR BD / Telmisartan OM / Pregabalin HS / HbA1c 3 months / urine microalbumin",
  },
};

export async function mockExtractPrescription(fileName?: string): Promise<ExtractionDraft> {
  const lower = (fileName ?? "").toLowerCase();

  // Future hook: replace this with OCR preprocessing and LLM parsing pipeline.
  if (lower.includes("diab") || lower.includes("sugar")) {
    return sampleDrafts.diabetes;
  }

  return sampleDrafts.fever;
}

export function buildMedicationFriendlySummary(medication: ExtractedMedication) {
  return {
    title: medication.name,
    why: `This appears to be for ${medication.reasonAsWritten}, as written in the prescription.`,
    when: medication.frequency,
    days: `${medication.durationDays} days`,
    warning: medication.instructions || "Please confirm the exact timing with your doctor or pharmacist.",
  };
}
