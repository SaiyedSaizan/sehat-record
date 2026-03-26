import Link from "next/link";
import { Activity, Clock3, FileText, LayoutDashboard, ShieldCheck, UploadCloud, UserRound } from "lucide-react";
import { getPatients } from "@/lib/data";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "" },
  { label: "Upload", icon: UploadCloud, href: "/upload" },
  { label: "Timeline", icon: Clock3, href: "/timeline" },
  { label: "Doctor summary", icon: Activity, href: "/doctor-summary" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

export async function PatientShell({
  patientId,
  activePath,
  children,
}: {
  patientId: string;
  activePath: string;
  children: React.ReactNode;
}) {
  const patients = await getPatients();
  const currentPatient = patients.find((patient) => patient.id === patientId);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(180deg,#f5fbf9_0%,#eff5fb_55%,#f7fafc_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full rounded-[28px] border border-white/70 bg-slate-950 px-5 py-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80">
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90">
            <ShieldCheck className="h-4 w-4 text-emerald-300" /> Demo workspace
          </Link>
          <div className="mt-5 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Sehat Record</p>
            <h1 className="text-2xl font-semibold">{currentPatient?.fullName}</h1>
            <p className="text-sm text-white/70">
              {currentPatient?.age} years � {currentPatient?.gender} � {currentPatient?.city || "India"}
            </p>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Why teams demo this screen</p>
            <p className="mt-2 text-sm leading-6 text-white/85">
              Doctors see the last few visits fast, families keep every paper slip in one place, and the patient-friendly explanation stays visible beside the source record.
            </p>
          </div>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const href = `/patients/${patientId}${item.href}`;
              const active = activePath === href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    active ? "bg-emerald-400 text-slate-950" : "text-white/75 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
            <div className="flex items-center justify-between text-white/65">
              <span>Other demo patients</span>
              <FileText className="h-4 w-4" />
            </div>
            {patients.map((patient) => (
              <Link key={patient.id} href={`/patients/${patient.id}`} className="block rounded-2xl border border-white/8 px-3 py-2 text-white/80 hover:border-white/20 hover:bg-white/6">
                <div className="font-medium text-white">{patient.fullName}</div>
                <div className="text-xs text-white/55">{patient.conditions.map((condition) => condition.name).join(" � ") || "No active conditions"}</div>
              </Link>
            ))}
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
