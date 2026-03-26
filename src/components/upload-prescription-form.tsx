"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UploadPrescriptionFormProps = {
  patientId: string;
};

export function UploadPrescriptionForm({ patientId }: UploadPrescriptionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sample, setSample] = useState("fever");
  const [fileName, setFileName] = useState("paper-prescription.jpg");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/prescriptions/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, sample }),
    });

    const draft = await response.json();
    sessionStorage.setItem(`sehat-draft:${patientId}`, JSON.stringify(draft));
    router.push(`/patients/${patientId}/review`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-dashed border-emerald-300 bg-emerald-50/70 p-6">
      <div>
        <p className="text-sm font-medium text-slate-900">Upload prescription image or PDF</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">For the MVP, we simulate OCR using realistic templates and the uploaded filename. Manual correction remains part of the flow because prescriptions are often messy.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          Demo file name
          <input value={fileName} onChange={(event) => setFileName(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0" placeholder="example: sugar-followup.pdf" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Extraction template
          <select value={sample} onChange={(event) => setSample(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0">
            <option value="fever">Acute fever and throat infection</option>
            <option value="diabetes">Diabetes follow-up with BP review</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
        {loading ? "Extracting details..." : "Extract prescription for review"}
      </button>
    </form>
  );
}
