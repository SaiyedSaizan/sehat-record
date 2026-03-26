import { notFound } from "next/navigation";
import { PatientShell } from "@/components/patient-shell";
import { Badge, SectionCard } from "@/components/ui";
import { getPatientRecord } from "@/lib/data";
import { formatIndianDate } from "@/lib/utils";

export default async function TimelinePage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const record = await getPatientRecord(patientId);
  if (!record) notFound();

  return (
    <PatientShell patientId={patientId} activePath={`/patients/${patientId}/timeline`}>
      <SectionCard title="Patient timeline" eyebrow="Chronological record">
        <div className="space-y-4">
          {record.timeline.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 md:grid-cols-[150px_1fr]">
              <div>
                <p className="text-sm font-medium text-slate-700">{formatIndianDate(item.date)}</p>
                <Badge tone={item.type === "test" ? "amber" : item.type.includes("active") ? "emerald" : "slate"}>{item.type.replace(/-/g, " ")}</Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PatientShell>
  );
}
