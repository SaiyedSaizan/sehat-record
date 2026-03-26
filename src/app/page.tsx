import Link from "next/link";
import { ArrowRight, FileText, HeartPulse, ShieldCheck, Stethoscope, UploadCloud } from "lucide-react";

const pillars = [
  {
    title: "Every paper slip becomes structured history",
    copy: "Visits, medicines, tests, allergies, and doctor names stay searchable instead of getting lost in a drawer.",
    icon: FileText,
  },
  {
    title: "Doctors get a summary in seconds",
    copy: "Past five visits, active medicines, duplicate-risk hints, and prior tests appear in one focused dashboard.",
    icon: Stethoscope,
  },
  {
    title: "Patients finally understand the prescription",
    copy: "Each medicine is explained in plain language with safe wording and visible source context.",
    icon: HeartPulse,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_34%),linear-gradient(180deg,#f5fbf9_0%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/80 bg-white/70 px-5 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Sehat Record</p>
            <p className="text-sm text-slate-500">Health records that people can actually use</p>
          </div>
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Open demo <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-8 px-1 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-sm text-emerald-900 backdrop-blur">
              <ShieldCheck className="h-4 w-4" /> Patient-owned record locker for India
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
              One clean patient story from scattered prescriptions, visits, and test advice.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Sehat Record helps families preserve medical history, helps patients understand medicines clearly, and helps doctors scan prior treatment faster without reading piles of paper.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_12px_35px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400">
                Start investor demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950">
                Create a fresh patient profile
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <p className="text-3xl font-semibold text-slate-950">3</p>
                <p className="mt-2 text-sm text-slate-600">Seeded patients including chronic care, elderly-parent management, and acute illness.</p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <p className="text-3xl font-semibold text-slate-950">9</p>
                <p className="mt-2 text-sm text-slate-600">Realistic doctor visits with medications, repeated prescriptions, and test advice.</p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <p className="text-3xl font-semibold text-slate-950">1</p>
                <p className="mt-2 text-sm text-slate-600">Mock extraction pipeline ready to swap for OCR and LLM services later.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[36px] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_40px_120px_rgba(15,23,42,0.2)]">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Live demo promise</p>
              <h2 className="mt-3 text-2xl font-semibold">Looks calm for patients. Feels fast for doctors.</h2>
              <div className="mt-6 space-y-3 text-sm leading-6 text-white/75">
                <p>Upload a messy prescription.</p>
                <p>Review extracted details and correct what OCR would miss.</p>
                <p>Open the patient timeline and doctor summary instantly.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                <UploadCloud className="h-5 w-5 text-emerald-300" />
                <p className="mt-3 text-sm font-medium">Upload and review</p>
                <p className="mt-2 text-sm text-white/65">Extraction is editable before anything gets saved.</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                <Stethoscope className="h-5 w-5 text-sky-300" />
                <p className="mt-3 text-sm font-medium">Doctor summary</p>
                <p className="mt-2 text-sm text-white/65">Medication history, tests, conditions, and duplicate-risk hints together.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-16 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.copy}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
