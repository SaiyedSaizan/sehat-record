import { Prisma } from "@prisma/client";
import { isAfter } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatIndianDate } from "@/lib/utils";

const patientInclude = {
  allergies: true,
  conditions: true,
  visits: {
    orderBy: { visitDate: "desc" },
    include: {
      doctor: true,
      prescriptions: {
        include: {
          medications: {
            include: {
              medication: true,
            },
          },
        },
      },
      testRecommendations: true,
    },
  },
} satisfies Prisma.PatientInclude;

export async function getPatients() {
  const patients = await prisma.patient.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      conditions: true,
      allergies: true,
      visits: {
        take: 1,
        orderBy: { visitDate: "desc" },
        include: { doctor: true },
      },
    },
  });

  return patients.map((patient) => ({
    ...patient,
    latestVisit: patient.visits[0] ?? null,
  }));
}

export async function getPatientRecord(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: patientInclude,
  });

  if (!patient) {
    return null;
  }

  const flattenedMedications = patient.visits.flatMap((visit) =>
    visit.prescriptions.flatMap((prescription) =>
      prescription.medications.map((med) => ({
        id: med.id,
        prescriptionId: prescription.id,
        visitId: visit.id,
        visitDate: visit.visitDate,
        doctorName: visit.doctor.fullName,
        medicationName: med.medication.name,
        category: med.medication.category,
        explanation: med.medication.patientExplanation,
        caution: med.medication.caution,
        dosage: med.dosage,
        frequency: med.frequency,
        durationDays: med.durationDays,
        instructions: med.instructions,
        startDate: med.startDate,
        endDate: med.endDate,
        isCurrent: med.isCurrent || (!!med.endDate && isAfter(med.endDate, new Date())),
        reasonAsWritten: med.reasonAsWritten,
      })),
    ),
  );

  const currentMedications = flattenedMedications.filter((med) => med.isCurrent);

  const repeatedPrescriptions = Object.values(
    flattenedMedications.reduce<Record<string, { name: string; count: number; lastSeen: Date }>>(
      (acc, med) => {
        const current = acc[med.medicationName] ?? {
          name: med.medicationName,
          count: 0,
          lastSeen: med.visitDate,
        };

        current.count += 1;
        if (med.visitDate > current.lastSeen) {
          current.lastSeen = med.visitDate;
        }
        acc[med.medicationName] = current;
        return acc;
      },
      {},
    ),
  )
    .filter((item) => item.count > 1)
    .sort((a, b) => b.count - a.count);

  const duplicateWarnings = Object.values(
    flattenedMedications.reduce<
      Record<string, { medicationName: string; spans: string[]; activeCount: number }>
    >((acc, med) => {
      if (!med.startDate || !med.endDate) {
        return acc;
      }

      const key = med.medicationName;
      const item = acc[key] ?? { medicationName: med.medicationName, spans: [], activeCount: 0 };
      item.spans.push(`${formatIndianDate(med.startDate)} to ${formatIndianDate(med.endDate)}`);
      if (med.isCurrent) {
        item.activeCount += 1;
      }
      acc[key] = item;
      return acc;
    }, {}),
  ).filter((item) => item.spans.length > 1 || item.activeCount > 1);

  const tests = patient.visits.flatMap((visit) =>
    visit.testRecommendations.map((test) => ({
      ...test,
      doctorName: visit.doctor.fullName,
      visitDate: visit.visitDate,
    })),
  );

  const timeline = patient.visits.flatMap((visit) => {
    const visitItem = {
      id: `visit-${visit.id}`,
      type: "visit",
      title: visit.diagnosis || visit.complaint || "Doctor visit",
      subtitle: `${visit.doctor.fullName} � ${visit.clinicName || visit.doctor.hospitalName || "Clinic"}`,
      date: visit.visitDate,
      note: visit.patientSummary || visit.doctorSummary || "",
    };

    const medItems = visit.prescriptions.flatMap((prescription) =>
      prescription.medications.map((med) => ({
        id: `med-${med.id}`,
        type: med.isCurrent ? "medication-active" : "medication",
        title: `${med.medication.name} ${med.isCurrent ? "ongoing" : "started"}`,
        subtitle: `${med.dosage || "Dose not captured"} � ${med.frequency || "Schedule not captured"}`,
        date: med.startDate || visit.visitDate,
        note: med.instructions || med.reasonAsWritten || prescription.patientSafeSummary || "",
      })),
    );

    const testItems = visit.testRecommendations.map((test) => ({
      id: `test-${test.id}`,
      type: "test",
      title: test.testName,
      subtitle: "Test advised",
      date: test.recommendedDate || visit.visitDate,
      note: test.instructions || "",
    }));

    return [visitItem, ...medItems, ...testItems];
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    patient,
    flattenedMedications,
    currentMedications,
    repeatedPrescriptions,
    duplicateWarnings,
    tests,
    timeline,
  };
}

export async function getPrescriptionDetails(prescriptionId: string) {
  return prisma.prescription.findUnique({
    where: { id: prescriptionId },
    include: {
      visit: {
        include: {
          patient: { include: { conditions: true, allergies: true } },
          doctor: true,
          testRecommendations: true,
        },
      },
      medications: {
        include: {
          medication: true,
        },
      },
    },
  });
}
