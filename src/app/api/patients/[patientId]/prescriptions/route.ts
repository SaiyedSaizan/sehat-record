import { addDays } from "date-fns";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ExtractionDraft } from "@/lib/mock-extraction";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  const body = (await request.json()) as ExtractionDraft;

  const doctor = await prisma.doctor.findFirst({
    where: { fullName: body.doctorName },
  }).then((existing) =>
    existing ?? prisma.doctor.create({
      data: {
        fullName: body.doctorName,
        hospitalName: body.clinicName,
        specialty: "General Practice",
      },
    }),
  );

  const visitDate = new Date(body.visitDate);

  const visit = await prisma.visit.create({
    data: {
      patientId,
      doctorId: doctor.id,
      visitDate,
      complaint: body.complaint,
      diagnosis: body.diagnosis,
      clinicName: body.clinicName,
      patientSummary: body.patientSafeSummary,
      doctorSummary: `Reviewed from uploaded prescription for ${body.diagnosis || body.complaint}.`,
      testRecommendations: {
        create: body.tests.map((test) => ({
          testName: test.testName,
          instructions: test.instructions,
          recommendedDate: addDays(visitDate, 7),
        })),
      },
    },
  });

  const medicationRows = [];
  for (const medication of body.medications) {
    const catalog = await prisma.medication.findFirst({ where: { name: medication.name } }).then((existing) =>
      existing ?? prisma.medication.create({
        data: {
          name: medication.name,
          category: "Imported from upload",
          patientExplanation: `This appears to be for ${medication.reasonAsWritten}, as written in the prescription. Please confirm with your doctor or pharmacist.`,
          caution: medication.instructions,
        },
      }),
    );

    medicationRows.push({
      medicationId: catalog.id,
      dosage: medication.dosage,
      frequency: medication.frequency,
      durationDays: Number(medication.durationDays) || 0,
      instructions: medication.instructions,
      startDate: visitDate,
      endDate: addDays(visitDate, Number(medication.durationDays) || 0),
      isCurrent: Number(medication.durationDays) > 10,
      reasonAsWritten: medication.reasonAsWritten,
    });
  }

  const prescription = await prisma.prescription.create({
    data: {
      visitId: visit.id,
      sourceType: "uploaded",
      sourceLabel: body.clinicName,
      extractedText: body.extractedText,
      patientSafeSummary: body.patientSafeSummary,
      notes: body.notes,
      medications: {
        create: medicationRows,
      },
    },
  });

  return NextResponse.json({ id: prescription.id });
}
