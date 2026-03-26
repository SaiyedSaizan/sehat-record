import { notFound } from "next/navigation";
import { PatientShell } from "@/components/patient-shell";
import { UploadPrescriptionForm } from "@/components/upload-prescription-form";
import { SectionCard } from "@/components/ui";
import { getPatientRecord } from "@/lib/data";

export default async function UploadPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const record = await getPatientRecord(patientId);

  if (!record) notFound();

  return (
    <PatientShell patientId={patientId} activePath={`/patients/${patientId}/upload`}>
      <SectionCard title="Upload a new prescription" eyebrow="Extraction workflow">
        <UploadPrescriptionForm patientId={patientId} />
      </SectionCard>
    </PatientShell>
  );
}
