import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPatients } from "@/lib/data";
import { formatIndianDate } from "@/lib/utils";
import { Badge, SectionCard } from "@/components/ui";

export default async function DemoPage() {
  const patients = await getPatients();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f6faf8_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionCard title="Choose a demo story" eyebrow="Demo mode" action={<Link href="/onboarding" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white">New patient</Link>}>
          <div className="grid gap-4 md:grid-cols-3">
            {patients.map((patient) => (
              <Link key={patient.id} href={`/patients/${patient.id}`} className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-emerald-50/60 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] transition hover:-translate-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{patient.fullName}</h2>
                    <p className="mt-1 text-sm text-slate-500">{patient.age} years � {patient.gender} � {patient.city}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {patient.conditions.slice(0, 3).map((condition) => (
                    <Badge key={condition.id} tone="emerald">{condition.name}</Badge>
                  ))}
                </div>
                <div className="mt-5 rounded-[22px] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Latest visit</p>
                  <p className="mt-2 text-sm font-medium">{patient.latestVisit?.doctor.fullName || "No visits yet"}</p>
                  <p className="mt-1 text-sm text-white/65">{patient.latestVisit ? formatIndianDate(patient.latestVisit.visitDate) : "Create a record to begin"}</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
