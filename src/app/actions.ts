"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createPatient(formData: FormData) {
  const patient = await prisma.patient.create({
    data: {
      fullName: String(formData.get("fullName") || "").trim(),
      age: Number(formData.get("age") || 0),
      gender: String(formData.get("gender") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      bloodGroup: String(formData.get("bloodGroup") || "").trim(),
      allergiesNote: String(formData.get("allergies") || "").trim(),
      chronicNote: String(formData.get("conditions") || "").trim(),
      emergencyName: String(formData.get("emergencyName") || "").trim(),
      emergencyPhone: String(formData.get("emergencyPhone") || "").trim(),
      relationToPatient: String(formData.get("relationToPatient") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      preferredLanguage: String(formData.get("preferredLanguage") || "").trim(),
    },
  });

  redirect(`/patients/${patient.id}`);
}

export async function updatePatient(patientId: string, formData: FormData) {
  await prisma.patient.update({
    where: { id: patientId },
    data: {
      fullName: String(formData.get("fullName") || "").trim(),
      age: Number(formData.get("age") || 0),
      gender: String(formData.get("gender") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      bloodGroup: String(formData.get("bloodGroup") || "").trim(),
      allergiesNote: String(formData.get("allergies") || "").trim(),
      chronicNote: String(formData.get("conditions") || "").trim(),
      emergencyName: String(formData.get("emergencyName") || "").trim(),
      emergencyPhone: String(formData.get("emergencyPhone") || "").trim(),
      relationToPatient: String(formData.get("relationToPatient") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      preferredLanguage: String(formData.get("preferredLanguage") || "").trim(),
    },
  });

  redirect(`/patients/${patientId}/profile`);
}
