import { NextResponse } from "next/server";
import { mockExtractPrescription } from "@/lib/mock-extraction";

export async function POST(request: Request) {
  const body = (await request.json()) as { fileName?: string; sample?: string };

  // Future hook: call OCR provider here, then normalize with an LLM extraction step.
  const draft = await mockExtractPrescription(body.sample === "diabetes" ? "sugar-followup.pdf" : body.fileName);
  return NextResponse.json(draft);
}
