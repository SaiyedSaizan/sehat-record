import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  eyebrow,
  action,
  className,
  children,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-[28px] border border-slate-200/70 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-emerald-700/70">{eyebrow}</p> : null}
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 text-3xl font-semibold text-slate-950">{value}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{hint}</p>
    </div>
  );
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "emerald" | "amber" | "rose" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-700",
  };

  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}
