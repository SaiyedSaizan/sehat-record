import { notFound } from "next/navigation";
import { PatientShell } from "@/components/patient-shell";
import { Badge, SectionCard } from "@/components/ui";
import { getPatientRecord } from "@/lib/data";
import { formatIndianDate } from "@/lib/utils";

export default async function DoctorSummaryPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const record = await getPatientRecord(patientId);
  if (!record) notFound();

  return (
    <PatientShell patientId={patientId} activePath={`/patients/${patientId}/doctor-summary`}>
      <div className="space-y-6">
        <section className="rounded-[34px] border border-slate-900/5 bg-[linear-gradient(135deg,#e0f2fe_0%,#ecfdf5_100%)] p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Doctor summary</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Scan the patient story without reading every old prescription.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Built to save OPD time: conditions, allergies, recent visits, active medicines, repeat patterns, prior tests, and basic overlap heuristics all appear in one place.</p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Clinical snapshot" eyebrow="At a glance">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Major conditions</p>
                <div className="mt-2 flex flex-wrap gap-2">{record.patient.conditions.map((condition) => <Badge key={condition.id} tone="emerald">{condition.name}</Badge>)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Allergies</p>
                <div className="mt-2 flex flex-wrap gap-2">{record.patient.allergies.length ? record.patient.allergies.map((allergy) => <Badge key={allergy.id} tone="amber">{allergy.name}</Badge>) : <Badge>No allergies recorded</Badge>}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Current medications</p>
                <div className="mt-3 space-y-3">
                  {record.currentMedications.map((medication) => (
                    <div key={medication.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <p className="font-medium text-slate-950">{medication.medicationName}</p>
                      <p className="mt-1 text-sm text-slate-600">{medication.dosage} � {medication.frequency}</p>
                      <p className="mt-2 text-xs text-slate-500">Prescriber: {medication.doctorName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Past 5 visits" eyebrow="Consult-ready context">
            <div className="space-y-4">
              {record.patient.visits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950">{visit.diagnosis || visit.complaint}</h3>
                      <p className="mt-1 text-sm text-slate-500">{visit.doctor.fullName} � {formatIndianDate(visit.visitDate)}</p>
                    </div>
                    <Badge>{visit.clinicName || visit.doctor.hospitalName || "Clinic"}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{visit.doctorSummary || visit.patientSummary}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Medication history timeline" eyebrow="Treatment continuity">
            <div className="space-y-3">
              {record.flattenedMedications.map((medication) => (
                <div key={medication.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{medication.medicationName}</p>
                      <p className="mt-1 text-sm text-slate-600">{medication.dosage} � {medication.frequency}</p>
                    </div>
                    <p className="text-sm text-slate-500">{formatIndianDate(medication.visitDate)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{medication.doctorName}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Repeated prescriptions" eyebrow="Pattern detection">
              <div className="space-y-3">
                {record.repeatedPrescriptions.map((item) => (
                  <div key={item.name} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <p className="font-medium text-slate-950">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">Appears across {item.count} prescriptions.</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Duplicate or overlap check" eyebrow="Basic heuristic only">
              <div className="space-y-3">
                {record.duplicateWarnings.length ? record.duplicateWarnings.map((warning) => (
                  <div key={warning.medicationName} className="rounded-[22px] border border-amber-200 bg-amber-50 p-4">
                    <p className="font-medium text-amber-950">{warning.medicationName}</p>
                    <p className="mt-1 text-sm text-amber-900/80">Multiple entries found across visits. Please verify which strip is actually active with the patient.</p>
                  </div>
                )) : <p className="text-sm text-slate-600">No obvious overlap based on the current demo data.</p>}
              </div>
            </SectionCard>
            <SectionCard title="Tests previously advised" eyebrow="Carry-forward memory">
              <div className="space-y-3">
                {record.tests.map((test) => (
                  <div key={test.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <p className="font-medium text-slate-950">{test.testName}</p>
                    <p className="mt-1 text-sm text-slate-600">{test.instructions}</p>
                    <p className="mt-2 text-xs text-slate-500">{test.doctorName} � {formatIndianDate(test.visitDate)}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PatientShell>
  );
}
