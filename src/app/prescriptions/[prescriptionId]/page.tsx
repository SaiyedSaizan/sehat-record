import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, SectionCard } from "@/components/ui";
import { getPrescriptionDetails } from "@/lib/data";
import { formatIndianDate } from "@/lib/utils";

export default async function PrescriptionDetailPage({ params }: { params: Promise<{ prescriptionId: string }> }) {
  const { prescriptionId } = await params;
  const prescription = await getPrescriptionDetails(prescriptionId);
  if (!prescription) notFound();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fafc_0%,#eefcf7_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href={`/patients/${prescription.visit.patientId}`} className="text-sm font-medium text-emerald-700">Back to patient dashboard</Link>
        <SectionCard title="Prescription details" eyebrow="Patient-friendly explanation">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Visit</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{prescription.visit.diagnosis || prescription.visit.complaint}</h2>
              <p className="mt-2 text-sm text-slate-600">{prescription.visit.doctor.fullName} � {formatIndianDate(prescription.visit.visitDate)}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{prescription.patientSafeSummary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {prescription.visit.patient.conditions.map((condition) => <Badge key={condition.id} tone="emerald">{condition.name}</Badge>)}
                {prescription.visit.patient.allergies.map((allergy) => <Badge key={allergy.id} tone="amber">{allergy.name}</Badge>)}
              </div>
            </div>
            <div className="space-y-4">
              {prescription.medications.map((medication) => (
                <div key={medication.id} className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{medication.medication.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{medication.dosage} � {medication.frequency}</p>
                    </div>
                    <Badge tone="emerald">{medication.durationDays || 0} days</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{medication.medication.patientExplanation || `This appears to be for ${medication.reasonAsWritten}, as written in the prescription.`}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">When to take</p>
                      <p className="mt-2 text-sm text-slate-800">{medication.frequency}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Duration</p>
                      <p className="mt-2 text-sm text-slate-800">{medication.durationDays} days</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Warning</p>
                      <p className="mt-2 text-sm text-slate-800">{medication.instructions || medication.medication.caution || "Please confirm with your doctor or pharmacist."}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
