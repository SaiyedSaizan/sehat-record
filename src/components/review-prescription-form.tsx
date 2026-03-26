"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ExtractionDraft } from "@/lib/mock-extraction";

type Props = {
  patientId: string;
};

export function ReviewPrescriptionForm({ patientId }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<ExtractionDraft | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = sessionStorage.getItem(`sehat-draft:${patientId}`);
    return raw ? (JSON.parse(raw) as ExtractionDraft) : null;
  });
  const [saving, setSaving] = useState(false);

  const medicationRows = useMemo(() => draft?.medications ?? [], [draft]);

  function updateMedication(index: number, key: string, value: string) {
    setDraft((current) => {
      if (!current) return current;
      const medications = [...current.medications];
      medications[index] = {
        ...medications[index],
        [key]: key === "durationDays" ? Number(value) : value,
      };
      return { ...current, medications };
    });
  }

  async function saveDraft() {
    if (!draft) {
      return;
    }
    setSaving(true);

    const response = await fetch(`/api/patients/${patientId}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const result = await response.json();
    sessionStorage.removeItem(`sehat-draft:${patientId}`);
    router.push(`/prescriptions/${result.id}`);
  }

  if (!draft) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600">No extraction draft found yet. Start from the upload page to generate one.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          Doctor name
          <input value={draft.doctorName} onChange={(event) => setDraft({ ...draft, doctorName: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Clinic or hospital
          <input value={draft.clinicName} onChange={(event) => setDraft({ ...draft, clinicName: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Visit date
          <input type="date" value={draft.visitDate} onChange={(event) => setDraft({ ...draft, visitDate: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Complaint
          <input value={draft.complaint} onChange={(event) => setDraft({ ...draft, complaint: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
        </label>
      </div>
      <label className="block space-y-2 text-sm text-slate-700">
        Diagnosis or visit label
        <input value={draft.diagnosis} onChange={(event) => setDraft({ ...draft, diagnosis: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
      </label>
      <label className="block space-y-2 text-sm text-slate-700">
        Patient-friendly summary
        <textarea value={draft.patientSafeSummary} onChange={(event) => setDraft({ ...draft, patientSafeSummary: event.target.value })} className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" />
      </label>
      <div className="space-y-4">
        {medicationRows.map((medication, index) => (
          <div key={`${medication.name}-${index}`} className="grid gap-3 rounded-[28px] border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-3">
            <input value={medication.name} onChange={(event) => updateMedication(index, "name", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={medication.dosage} onChange={(event) => updateMedication(index, "dosage", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={medication.frequency} onChange={(event) => updateMedication(index, "frequency", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={String(medication.durationDays)} onChange={(event) => updateMedication(index, "durationDays", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={medication.instructions} onChange={(event) => updateMedication(index, "instructions", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={medication.reasonAsWritten} onChange={(event) => updateMedication(index, "reasonAsWritten", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
        ))}
      </div>
      <label className="block space-y-2 text-sm text-slate-700">
        Raw extracted text
        <textarea value={draft.extractedText} onChange={(event) => setDraft({ ...draft, extractedText: event.target.value })} className="min-h-24 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" />
      </label>
      <button onClick={saveDraft} disabled={saving} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
        {saving ? "Saving prescription..." : "Save reviewed prescription"}
      </button>
    </div>
  );
}
