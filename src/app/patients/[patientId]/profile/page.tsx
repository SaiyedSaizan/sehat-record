import { notFound } from "next/navigation";
import { updatePatient } from "@/app/actions";
import { PatientShell } from "@/components/patient-shell";
import { SectionCard } from "@/components/ui";
import { getPatientRecord } from "@/lib/data";

export default async function ProfilePage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const record = await getPatientRecord(patientId);
  if (!record) notFound();

  const action = updatePatient.bind(null, patientId);

  return (
    <PatientShell patientId={patientId} activePath={`/patients/${patientId}/profile`}>
      <SectionCard title="Profile and settings" eyebrow="Patient ownership">
        <form action={action} className="grid gap-4 md:grid-cols-2">
          <input name="fullName" defaultValue={record.patient.fullName} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="age" type="number" defaultValue={record.patient.age} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="gender" defaultValue={record.patient.gender} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="phone" defaultValue={record.patient.phone} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="bloodGroup" defaultValue={record.patient.bloodGroup || ""} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="preferredLanguage" defaultValue={record.patient.preferredLanguage || ""} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="city" defaultValue={record.patient.city || ""} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="relationToPatient" defaultValue={record.patient.relationToPatient || ""} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="emergencyName" defaultValue={record.patient.emergencyName || ""} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input name="emergencyPhone" defaultValue={record.patient.emergencyPhone || ""} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <textarea name="allergies" defaultValue={record.patient.allergiesNote || ""} className="min-h-28 rounded-3xl border border-slate-200 px-4 py-3 md:col-span-2" />
          <textarea name="conditions" defaultValue={record.patient.chronicNote || ""} className="min-h-28 rounded-3xl border border-slate-200 px-4 py-3 md:col-span-2" />
          <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white md:w-fit">Save profile</button>
        </form>
      </SectionCard>
    </PatientShell>
  );
}
