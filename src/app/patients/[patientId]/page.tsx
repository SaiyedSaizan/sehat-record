import Link from "next/link";
import { notFound } from "next/navigation";
import { PatientShell } from "@/components/patient-shell";
import { Badge, SectionCard, StatCard } from "@/components/ui";
import { getPatientRecord } from "@/lib/data";
import { formatIndianDate } from "@/lib/utils";

export default async function PatientOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ q?: string; month?: string }>;
}) {
  const { patientId } = await params;
  const { q = "", month = "all" } = await searchParams;
  const record = await getPatientRecord(patientId);

  if (!record) notFound();

  const search = q.toLowerCase();
  const filteredVisits = record.patient.visits.filter((visit) => {
    const haystack = [
      visit.doctor.fullName,
      visit.diagnosis,
      visit.complaint,
      formatIndianDate(visit.visitDate),
      ...visit.prescriptions.flatMap((prescription) => prescription.medications.map((med) => med.medication.name)),
      ...record.patient.conditions.map((condition) => condition.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const monthOk =
      month === "all" ||
      `${visit.visitDate.getFullYear()}-${String(visit.visitDate.getMonth() + 1).padStart(2, "0")}` === month;

    return haystack.includes(search) && monthOk;
  });

  const monthOptions = Array.from(
    new Set(
      record.patient.visits.map(
        (visit) => `${visit.visitDate.getFullYear()}-${String(visit.visitDate.getMonth() + 1).padStart(2, "0")}`,
      ),
    ),
  );

  return (
    <PatientShell patientId={patientId} activePath={`/patients/${patientId}`}>
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#14532d_120%)] p-7 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)]">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-300">Patient command center</p>
              <h1 className="mt-3 text-4xl font-semibold">Your health records, visit history, and medicine context in one place.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                This screen helps the patient understand what happened, while keeping enough clinical structure for a doctor to scan the same timeline quickly.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {record.patient.conditions.map((condition) => (
                  <Badge key={condition.id} tone="emerald">{condition.name}</Badge>
                ))}
                {record.patient.allergies.map((allergy) => (
                  <Badge key={allergy.id} tone="amber">Allergy: {allergy.name}</Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <p className="text-sm text-white/60">Current medications</p>
                <p className="mt-2 text-3xl font-semibold">{record.currentMedications.length}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <p className="text-sm text-white/60">Past visits</p>
                <p className="mt-2 text-3xl font-semibold">{record.patient.visits.length}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Past 5 visits" value={String(record.patient.visits.slice(0, 5).length)} hint="Quick context for the next doctor consult." />
          <StatCard label="Repeated medicines" value={String(record.repeatedPrescriptions.length)} hint="Highlights long-running or repeated treatment patterns." />
          <StatCard label="Tests advised" value={String(record.tests.length)} hint="Keeps older test recommendations visible across clinics." />
        </div>

        <SectionCard title="Search and filters" eyebrow="Find any record quickly">
          <form className="grid gap-3 md:grid-cols-[1.4fr_0.6fr_auto]">
            <input name="q" defaultValue={q} placeholder="Search by doctor, medicine, condition, or date" className="rounded-2xl border border-slate-200 bg-white px-4 py-3" />
            <select name="month" defaultValue={month} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <option value="all">All dates</option>
              {monthOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">Apply</button>
          </form>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Recent visits" eyebrow="Structured history" action={<Link href={`/patients/${patientId}/upload`} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950">Upload prescription</Link>}>
            <div className="space-y-4">
              {filteredVisits.map((visit) => (
                <div key={visit.id} className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{formatIndianDate(visit.visitDate)}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-950">{visit.diagnosis || visit.complaint}</h3>
                      <p className="mt-1 text-sm text-slate-600">{visit.doctor.fullName} � {visit.clinicName || visit.doctor.hospitalName}</p>
                    </div>
                    {visit.prescriptions[0] ? (
                      <Link href={`/prescriptions/${visit.prescriptions[0].id}`} className="text-sm font-medium text-emerald-700">Open details</Link>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{visit.patientSummary || visit.doctorSummary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {visit.prescriptions.flatMap((prescription) => prescription.medications.slice(0, 4)).map((medication) => (
                      <Badge key={medication.id}>{medication.medication.name}</Badge>
                    ))}
                  </div>
                </div>
              ))}
              {filteredVisits.length === 0 ? <p className="text-sm text-slate-600">No visits matched this filter.</p> : null}
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Current medications" eyebrow="Patient-facing simplification">
              <div className="space-y-3">
                {record.currentMedications.slice(0, 5).map((medication) => (
                  <div key={medication.id} className="rounded-[24px] border border-emerald-100 bg-emerald-50/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{medication.medicationName}</p>
                        <p className="mt-1 text-sm text-slate-600">{medication.dosage} � {medication.frequency}</p>
                      </div>
                      <Badge tone="emerald">Ongoing</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{medication.explanation || `This appears to be for ${medication.reasonAsWritten}, as written in the prescription.`}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{medication.instructions || medication.caution}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Red flags and repeats" eyebrow="Doctor time-savers">
              <div className="space-y-3">
                {record.duplicateWarnings.map((warning) => (
                  <div key={warning.medicationName} className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                    <p className="font-semibold text-amber-950">Possible overlap: {warning.medicationName}</p>
                    <p className="mt-2 text-sm leading-6 text-amber-900/80">Multiple entries exist across visits. Please verify which active strip the patient is actually continuing.</p>
                  </div>
                ))}
                {record.repeatedPrescriptions.slice(0, 4).map((medication) => (
                  <div key={medication.name} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {medication.name} appears in {medication.count} prescriptions.
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
