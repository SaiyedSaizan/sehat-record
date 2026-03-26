import { PrismaClient } from "@prisma/client";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

const medicationCatalog = [
  ["Telmisartan", "Blood pressure", "Often used to help control blood pressure and protect the heart or kidneys.", "Take it regularly and confirm with your doctor if you feel dizzy."],
  ["Amlodipine", "Blood pressure", "Often used to relax blood vessels and support blood pressure control.", "Swelling in the feet should be reported to your doctor."],
  ["Metformin XR", "Diabetes", "Often used to support blood sugar control, especially after meals.", "Usually taken after food to reduce stomach upset."],
  ["Pantoprazole", "Acidity", "Often used to reduce acidity or protect the stomach lining.", "Often written for before-food use; confirm exact timing."],
  ["Pregabalin", "Nerve pain", "This appears to be for nerve pain or tingling symptoms.", "It can cause sleepiness in some people."],
  ["Dolo 650", "Fever relief", "Often used to reduce fever or body pain.", "Avoid exceeding the total daily dose advised by your doctor."],
  ["Azithromycin", "Antibiotic", "This appears to be an antibiotic for an infection, as written in the prescription.", "Complete only as directed and confirm before reusing old strips."],
  ["Levocetirizine", "Allergy", "Often used for allergy, cold, or throat irritation symptoms.", "May cause drowsiness at night."],
  ["Budesonide Inhaler", "Respiratory", "Often used to reduce airway inflammation in breathing symptoms.", "Rinse your mouth after inhaler use unless your doctor said otherwise."],
];

async function main() {
  await prisma.prescriptionMedication.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.testRecommendation.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.allergy.deleteMany();
  await prisma.condition.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.medication.deleteMany();

  const meds = Object.fromEntries(
    await Promise.all(
      medicationCatalog.map(async ([name, category, patientExplanation, caution]) => [
        name,
        await prisma.medication.create({ data: { name, category, patientExplanation, caution } }),
      ]),
    ),
  );

  const rajesh = await prisma.patient.create({
    data: {
      fullName: "Rajesh Sharma",
      age: 68,
      gender: "Male",
      phone: "+91 98765 43210",
      bloodGroup: "B+",
      allergiesNote: "Sulfa allergy reported many years ago",
      chronicNote: "Type 2 diabetes and hypertension for more than 10 years",
      emergencyName: "Neha Sharma",
      emergencyPhone: "+91 98111 22334",
      relationToPatient: "Daughter",
      city: "Gurugram",
      preferredLanguage: "Hindi",
      allergies: { create: [{ name: "Sulfa drugs", severity: "Moderate", notes: "Please reconfirm before prescribing" }] },
      conditions: { create: [{ name: "Type 2 Diabetes", status: "Active", notes: "Monitoring with regular HbA1c" }, { name: "Hypertension", status: "Active" }, { name: "Peripheral neuropathy symptoms", status: "Active" }] },
    },
  });

  const meera = await prisma.patient.create({
    data: {
      fullName: "Meera Iyer",
      age: 34,
      gender: "Female",
      phone: "+91 99887 77665",
      bloodGroup: "O+",
      allergiesNote: "No known drug allergies",
      chronicNote: "Hypothyroidism and recurring acidity",
      emergencyName: "Arjun Iyer",
      emergencyPhone: "+91 99555 44332",
      relationToPatient: "Spouse",
      city: "Bengaluru",
      preferredLanguage: "English",
      conditions: { create: [{ name: "Hypothyroidism", status: "Active" }, { name: "Acidity", status: "Intermittent" }] },
    },
  });

  const armaan = await prisma.patient.create({
    data: {
      fullName: "Armaan Khan",
      age: 11,
      gender: "Male",
      phone: "+91 98989 12345",
      bloodGroup: "A+",
      allergiesNote: "Dust allergy",
      chronicNote: "Usually healthy; occasional wheeze during seasonal changes",
      emergencyName: "Saba Khan",
      emergencyPhone: "+91 98220 11223",
      relationToPatient: "Mother",
      city: "Lucknow",
      preferredLanguage: "Hindi",
      allergies: { create: [{ name: "Dust allergy", severity: "Mild" }] },
      conditions: { create: [{ name: "Seasonal wheeze", status: "Monitor" }] },
    },
  });

  const doctorList = await Promise.all([
    prisma.doctor.create({ data: { fullName: "Dr. Raghav Menon", specialty: "Diabetology", hospitalName: "MetroCare Diabetes Centre", city: "Gurugram" } }),
    prisma.doctor.create({ data: { fullName: "Dr. Priya Sethi", specialty: "Internal Medicine", hospitalName: "Sanjeevani Clinic", city: "Gurugram" } }),
    prisma.doctor.create({ data: { fullName: "Dr. Kavya Nair", specialty: "Family Medicine", hospitalName: "Lakeview Family Care", city: "Bengaluru" } }),
    prisma.doctor.create({ data: { fullName: "Dr. Sana Farooq", specialty: "General Physician", hospitalName: "Sunrise Family Clinic", city: "Lucknow" } }),
    prisma.doctor.create({ data: { fullName: "Dr. Aditya Rao", specialty: "Pulmonology", hospitalName: "BreatheWell Chest Clinic", city: "Lucknow" } }),
  ]);
  const doctors = Object.fromEntries(doctorList.map((doctor) => [doctor.fullName, doctor]));

  async function createVisit(args) {
    const visitDate = subDays(new Date("2026-03-25T09:00:00.000Z"), args.daysAgo);
    await prisma.visit.create({
      data: {
        patientId: args.patientId,
        doctorId: doctors[args.doctorName].id,
        visitDate,
        complaint: args.complaint,
        diagnosis: args.diagnosis,
        clinicName: args.clinicName,
        patientSummary: args.patientSummary,
        doctorSummary: args.doctorSummary,
        prescriptions: {
          create: {
            sourceType: "seed",
            sourceLabel: "Demo data",
            extractedText: `${args.doctorName} ${args.complaint} ${args.diagnosis}`,
            patientSafeSummary: args.patientSummary,
            medications: {
              create: args.medsToAdd.map((item) => ({
                medicationId: meds[item.name].id,
                dosage: item.dosage,
                frequency: item.frequency,
                durationDays: item.durationDays,
                instructions: item.instructions,
                startDate: visitDate,
                endDate: addDays(visitDate, item.durationDays),
                isCurrent: item.isCurrent ?? false,
                reasonAsWritten: item.reasonAsWritten,
              })),
            },
          },
        },
        testRecommendations: args.tests ? { create: args.tests.map((test) => ({ ...test, recommendedDate: addDays(visitDate, 7) })) } : undefined,
      },
    });
  }

  await createVisit({ patientId: rajesh.id, doctorName: "Dr. Priya Sethi", daysAgo: 140, complaint: "Routine BP follow-up with occasional headache", diagnosis: "Hypertension review", clinicName: "Sanjeevani Clinic", patientSummary: "As written in the prescription, this appears to be a blood pressure follow-up. Please keep taking tablets exactly as your doctor advised.", doctorSummary: "Long-standing hypertension. Amlodipine started. No chest pain. Asked to bring home BP log.", medsToAdd: [{ name: "Amlodipine", dosage: "5 mg", frequency: "1 tablet at night", durationDays: 60, instructions: "Same time daily", reasonAsWritten: "blood pressure control" }, { name: "Pantoprazole", dosage: "40 mg", frequency: "1 tablet before breakfast", durationDays: 14, instructions: "Before food", reasonAsWritten: "acidity protection" }] });
  await createVisit({ patientId: rajesh.id, doctorName: "Dr. Raghav Menon", daysAgo: 85, complaint: "Sugar follow-up, fasting sugars high", diagnosis: "Type 2 diabetes review", clinicName: "MetroCare Diabetes Centre", patientSummary: "This appears to be a diabetes follow-up. Please confirm the final sugar medicines before continuing any older strips already at home.", doctorSummary: "HbA1c still above target. Metformin continued. Telmisartan added for BP and renal protection.", medsToAdd: [{ name: "Metformin XR", dosage: "500 mg", frequency: "1 tablet twice daily", durationDays: 90, instructions: "After meals", isCurrent: true, reasonAsWritten: "blood sugar control" }, { name: "Telmisartan", dosage: "40 mg", frequency: "1 tablet every morning", durationDays: 90, instructions: "Morning", isCurrent: true, reasonAsWritten: "blood pressure and kidney protection" }], tests: [{ testName: "HbA1c", instructions: "Repeat after 3 months" }, { testName: "Creatinine", instructions: "Within 10 days" }] });
  await createVisit({ patientId: rajesh.id, doctorName: "Dr. Raghav Menon", daysAgo: 42, complaint: "Foot tingling, sugar review", diagnosis: "Type 2 diabetes with neuropathy symptoms", clinicName: "MetroCare Diabetes Centre", patientSummary: "As written in the prescription, this appears to be for diabetes follow-up plus nerve pain symptoms in the feet.", doctorSummary: "Neuropathy symptoms worse at night. Pregabalin added. Telmisartan and Metformin continued.", medsToAdd: [{ name: "Metformin XR", dosage: "500 mg", frequency: "1 tablet twice daily", durationDays: 60, instructions: "After meals", isCurrent: true, reasonAsWritten: "blood sugar control" }, { name: "Telmisartan", dosage: "40 mg", frequency: "1 tablet every morning", durationDays: 60, instructions: "Morning", isCurrent: true, reasonAsWritten: "blood pressure support" }, { name: "Pregabalin", dosage: "75 mg", frequency: "1 capsule at bedtime", durationDays: 21, instructions: "Night use", isCurrent: false, reasonAsWritten: "nerve pain symptoms" }], tests: [{ testName: "Urine microalbumin", instructions: "Next 2 weeks" }] });
  await createVisit({ patientId: rajesh.id, doctorName: "Dr. Priya Sethi", daysAgo: 14, complaint: "Mild chest burning and BP review", diagnosis: "Hypertension and gastritis symptoms", clinicName: "Sanjeevani Clinic", patientSummary: "This appears to be a blood pressure follow-up with acidity complaints. Please confirm whether both older and newer BP medicines should continue together.", doctorSummary: "Amlodipine still listed from prior slip. Telmisartan active. Pantoprazole given for acidity. Possible duplicate BP carry-forward risk if patient resumes both.", medsToAdd: [{ name: "Telmisartan", dosage: "40 mg", frequency: "1 tablet every morning", durationDays: 30, instructions: "Morning", isCurrent: true, reasonAsWritten: "blood pressure support" }, { name: "Amlodipine", dosage: "5 mg", frequency: "1 tablet at night", durationDays: 30, instructions: "Night", isCurrent: true, reasonAsWritten: "blood pressure support" }, { name: "Pantoprazole", dosage: "40 mg", frequency: "1 tablet before breakfast", durationDays: 10, instructions: "Before food", reasonAsWritten: "acidity relief" }] });
  await createVisit({ patientId: meera.id, doctorName: "Dr. Kavya Nair", daysAgo: 96, complaint: "Acidity and bloating after office meals", diagnosis: "Acid peptic symptoms", clinicName: "Lakeview Family Care", patientSummary: "As written in the prescription, this appears to be for acidity and stomach discomfort.", doctorSummary: "Pantoprazole for 2 weeks. Lifestyle modification discussed.", medsToAdd: [{ name: "Pantoprazole", dosage: "40 mg", frequency: "1 tablet before breakfast", durationDays: 14, instructions: "Before food", reasonAsWritten: "acidity relief" }] });
  await createVisit({ patientId: meera.id, doctorName: "Dr. Kavya Nair", daysAgo: 38, complaint: "Recurring acidity with work stress", diagnosis: "Gastritis symptoms", clinicName: "Lakeview Family Care", patientSummary: "This appears to be another acidity visit. Please confirm with your doctor if you are restarting old acidity medicines from a prior strip.", doctorSummary: "Repeat gastritis symptoms. Pantoprazole repeated. Asked to avoid late dinner and excess tea.", medsToAdd: [{ name: "Pantoprazole", dosage: "40 mg", frequency: "1 tablet before breakfast", durationDays: 21, instructions: "Before food", reasonAsWritten: "acidity relief" }], tests: [{ testName: "H. pylori stool antigen", instructions: "If symptoms recur again" }] });
  await createVisit({ patientId: armaan.id, doctorName: "Dr. Sana Farooq", daysAgo: 25, complaint: "Fever with sore throat", diagnosis: "Upper respiratory infection", clinicName: "Sunrise Family Clinic", patientSummary: "This appears to be treatment for a short fever and throat infection episode.", doctorSummary: "Acute febrile illness, no breathing distress. Symptomatic management plus antibiotic written.", medsToAdd: [{ name: "Dolo 650", dosage: "650 mg", frequency: "1 tablet three times daily if fever", durationDays: 3, instructions: "After food if possible", reasonAsWritten: "fever relief" }, { name: "Azithromycin", dosage: "500 mg", frequency: "1 tablet once daily", durationDays: 3, instructions: "After food", reasonAsWritten: "infection support" }, { name: "Levocetirizine", dosage: "5 mg", frequency: "1 tablet at night", durationDays: 5, instructions: "Night use", reasonAsWritten: "cold or throat irritation support" }] });
  await createVisit({ patientId: armaan.id, doctorName: "Dr. Aditya Rao", daysAgo: 6, complaint: "Cough with mild wheeze after dust exposure", diagnosis: "Reactive airway episode", clinicName: "BreatheWell Chest Clinic", patientSummary: "As written in the prescription, this appears to be for cough and wheeze after dust exposure. Please confirm inhaler technique with your doctor.", doctorSummary: "Seasonal wheeze episode. Budesonide inhaler started for short course. Dust avoidance reviewed.", medsToAdd: [{ name: "Budesonide Inhaler", dosage: "2 puffs", frequency: "Twice daily", durationDays: 14, instructions: "Rinse mouth after use", isCurrent: true, reasonAsWritten: "breathing symptom support" }, { name: "Levocetirizine", dosage: "5 mg", frequency: "1 tablet at night", durationDays: 7, instructions: "Night use", isCurrent: true, reasonAsWritten: "allergy support" }], tests: [{ testName: "Peak flow review", instructions: "At follow-up if symptoms persist" }] });
  await createVisit({ patientId: armaan.id, doctorName: "Dr. Sana Farooq", daysAgo: 2, complaint: "Follow-up after fever, better but mild cough remains", diagnosis: "Recovery follow-up", clinicName: "Sunrise Family Clinic", patientSummary: "This appears to be a quick follow-up visit. Please confirm whether older fever medicines should now be stopped.", doctorSummary: "Fever settled. Dolo stopped. Supportive care only.", medsToAdd: [{ name: "Levocetirizine", dosage: "5 mg", frequency: "1 tablet at night", durationDays: 3, instructions: "Night use", reasonAsWritten: "cough or irritation support" }] });
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
