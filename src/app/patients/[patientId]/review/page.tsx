import { notFound } from "next/navigation";
import { PatientShell } from "@/components/patient-shell";
import { ReviewPrescriptionForm } from "@/components/review-prescription-form";
import { SectionCard } from "@/components/ui";
import { getPatientRecord } from "@/lib/data";

export default async function ReviewPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const record = await getPatientRecord(patientId);

  if (!record) notFound();

  return (
    <PatientShell patientId={patientId} activePath={`/patients/${patientId}/upload`}>
      <SectionCard title="Review extracted prescription" eyebrow="Manual correction matters">
        <p className="mb-5 max-w-3xl text-sm leading-7 text-slate-600">Prescription handwriting is often messy. This review step keeps the workflow honest by letting patients or staff fix medicines, dosage, tests, and notes before the record becomes part of the timeline.</p>
        <ReviewPrescriptionForm patientId={patientId} />
      </SectionCard>
    </PatientShell>
  );
}
