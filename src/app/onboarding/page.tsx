import { createPatient } from "@/app/actions";
import { SectionCard } from "@/components/ui";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fafc_0%,#eefbf6_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionCard title="Create patient profile" eyebrow="Patient onboarding">
          <form action={createPatient} className="grid gap-4 md:grid-cols-2">
            <input name="fullName" required placeholder="Full name" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="age" type="number" required placeholder="Age" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="gender" required placeholder="Gender" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="phone" required placeholder="Phone" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="bloodGroup" placeholder="Blood group" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="preferredLanguage" placeholder="Preferred language" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="city" placeholder="City" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="relationToPatient" placeholder="Emergency contact relation" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="emergencyName" placeholder="Emergency contact name" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="emergencyPhone" placeholder="Emergency contact phone" className="rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea name="allergies" placeholder="Allergies" className="min-h-28 rounded-3xl border border-slate-200 px-4 py-3 md:col-span-2" />
            <textarea name="conditions" placeholder="Chronic conditions" className="min-h-28 rounded-3xl border border-slate-200 px-4 py-3 md:col-span-2" />
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white md:col-span-2 md:w-fit">Create patient and open record</button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
