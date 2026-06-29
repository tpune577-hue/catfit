import type { HealthReport } from "@/types/health";

let workerConfigured = false;

function configurePdfWorker(pdfjs: typeof import("pdfjs-dist/legacy/build/pdf.mjs")) {
  if (workerConfigured) return;
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  workerConfigured = true;
}

function extractNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = parseFloat(match[1]);
      if (!Number.isNaN(value)) return value;
    }
  }
  return undefined;
}

export async function parsePdfFile(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  configurePdfWorker(pdfjs);

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    useWorkerFetch: false,
  }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }

  if (!fullText.trim()) {
    throw new Error("PDF ไม่มีข้อความที่อ่านได้ (อาจเป็นไฟล์สแกนภาพ)");
  }

  return fullText;
}

/** Lineman/SNH format: numbers often appear before labels */
function parseLinemanVitals(normalized: string) {
  // Pattern: "30.47 183.4 102.5 : BMI : Weight : Height"
  const bwh = normalized.match(
    /(\d{2}\.\d{1,2})\s+(\d{2,3}\.\d)\s+(\d{2,3}\.\d)\s*:?\s*BMI/i
  );

  let bmi = bwh ? parseFloat(bwh[1]) : undefined;
  let height = bwh ? parseFloat(bwh[2]) : undefined;
  let weight = bwh ? parseFloat(bwh[3]) : undefined;

  if (!bmi) {
    bmi = extractNumber(normalized, [/BMI[\s:]*(\d+\.?\d*)/i]);
  }
  if (!height) {
    height = extractNumber(normalized, [
      /Height[\s:]*(\d+\.?\d*)/i,
      /(\d{3}\.\d)\s*:?\s*Height/i,
    ]);
  }
  if (!weight) {
    weight = extractNumber(normalized, [
      /Weight[\s:]*(\d+\.?\d*)/i,
      /(\d{2,3}\.\d)\s*:?\s*Weight/i,
    ]);
  }

  const waist = extractNumber(normalized, [
    /รอบเอว\s*(\d{2,3})/,
    /waist\s*(\d{2,3})/i,
  ]);

  const age = extractNumber(normalized, [
    /-\d{5}-\d+\s+(\d{2})\s+Age/i,
    /\bAge\b[\s:]*(\d+)/i,
    /(\d{2})\s+Age\s+Sex/i,
  ]);

  return { bmi, height, weight, waist, age };
}

function parseLabValues(normalized: string) {
  return {
    fastingGlucose: extractNumber(normalized, [
      /(\d{2,3})\s*mg\/dL\s*\(70-\s*99\)/i,
      /Fasting Glucose[^]{0,80}?(\d{2,3})\s*mg\/dL/i,
    ]),
    totalCholesterol: extractNumber(normalized, [
      /(\d{2,3})\s*mg\/dL\s*H\s*<200/i,
      /Lipid\s*:\s*Total Cholesterol[^]{0,40}?(\d{2,3})/i,
    ]),
    hdl: extractNumber(normalized, [
      /(\d{2,3})\s*mg\/dl\s*>40/i,
      /HDL Cholesterol[^]{0,40}?(\d{2,3})/i,
    ]),
    ldl: extractNumber(normalized, [
      /(\d{2,3})\s*mg\/dl\s*H\s*<130/i,
      /LDL-cholesterol[^]{0,40}?(\d{2,3})/i,
    ]),
    triglycerides: extractNumber(normalized, [
      /(\d{2,3})\s*mg\/dl\s*<150/i,
      /Triglycerides[^]{0,40}?(\d{2,3})/i,
    ]),
  };
}

export function parseHealthReportText(text: string): Partial<HealthReport> {
  const normalized = text.replace(/\s+/g, " ");
  const vitals = parseLinemanVitals(normalized);
  const labs = parseLabValues(normalized);

  const bpMatch =
    normalized.match(/(\d{2,3})\s*\/\s*(\d{2,3})\s*mm\.?Hg/i) ??
    normalized.match(/ความด[^]*?(\d{2,3})\s*\/\s*(\d{2,3})/i) ??
    normalized.match(/Blood pressure[^]*?(\d{2,3})\s*\/\s*(\d{2,3})/i);

  const pulse = extractNumber(normalized, [
    /:\s*Pulse[^]*?(\d{2,3})/i,
    /ชีพจร[^]*?(\d{2,3})/,
    /(\d{2})\s*:\s*Temperatures/i,
  ]);

  const sedentary =
    /ไม{1,2}ออกก|ไม{1,2}เคยออกกำลังกาย|No exercise/i.test(normalized) &&
    !/ออกกำลังกาย[^]{0,20}Yes|Exercise[^]{0,20}Yes/i.test(normalized);

  const familyDiabetesHistory =
    /บสดา[^]{0,30}เบาหวาน|Family History[^]{0,80}เบาหวาน/i.test(
      normalized
    );

  const examDateMatch =
    normalized.match(/(\d{1,2}\/\d{1,2}\/\d{4})/) ??
    normalized.match(/(\d{1,2}-\w{3}-\d{2})/);

  const gender = /ชาย|Male/i.test(normalized)
    ? ("male" as const)
    : /หญิง|Female/i.test(normalized)
      ? ("female" as const)
      : undefined;

  return {
    source: "pdf",
    uploadedAt: new Date().toISOString(),
    examDate: examDateMatch?.[1],
    age: vitals.age,
    gender,
    weight: vitals.weight,
    height: vitals.height,
    bmi: vitals.bmi,
    waist: vitals.waist,
    bloodPressureSystolic: bpMatch ? parseInt(bpMatch[1]) : undefined,
    bloodPressureDiastolic: bpMatch ? parseInt(bpMatch[2]) : undefined,
    pulse,
    sedentary,
    familyDiabetesHistory,
    labs,
    rawText: text.slice(0, 8000),
  };
}

export function createHealthReportFromParsed(
  parsed: Partial<HealthReport>
): HealthReport {
  return {
    id: crypto.randomUUID(),
    source: parsed.source ?? "manual",
    uploadedAt: parsed.uploadedAt ?? new Date().toISOString(),
    examDate: parsed.examDate,
    name: parsed.name,
    age: parsed.age,
    gender: parsed.gender,
    height: parsed.height,
    weight: parsed.weight,
    bmi: parsed.bmi,
    waist: parsed.waist,
    bloodPressureSystolic: parsed.bloodPressureSystolic,
    bloodPressureDiastolic: parsed.bloodPressureDiastolic,
    pulse: parsed.pulse,
    sedentary: parsed.sedentary,
    familyDiabetesHistory: parsed.familyDiabetesHistory,
    labs: parsed.labs ?? {},
    doctorRecommendations: parsed.doctorRecommendations,
    rawText: parsed.rawText,
  };
}

export function countParsedFields(parsed: Partial<HealthReport>): number {
  let count = 0;
  if (parsed.age) count++;
  if (parsed.weight) count++;
  if (parsed.height) count++;
  if (parsed.bmi) count++;
  if (parsed.waist) count++;
  if (parsed.labs?.fastingGlucose) count++;
  if (parsed.labs?.totalCholesterol) count++;
  if (parsed.labs?.ldl) count++;
  if (parsed.labs?.hdl) count++;
  return count;
}
