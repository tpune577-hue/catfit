/**
 * Client-side OCR for smartwatch/health-app workout summary screenshots
 * (e.g. Huawei Health). Runs entirely in the browser via tesseract.js;
 * the recognized text is then parsed with a few regexes to pull out the
 * numbers that matter. Always treat the result as a starting point —
 * the review form lets the user correct anything OCR got wrong.
 */
export interface ParsedWorkoutResult {
  calories?: number;
  durationSeconds?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  steps?: number;
}

function toSeconds(h: string, m: string, s: string): number {
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

export function parseWorkoutResultText(text: string): ParsedWorkoutResult {
  const result: ParsedWorkoutResult = {};

  const kcal = text.match(/(\d+(?:\.\d+)?)\s*k?cal/i);
  if (kcal) result.calories = Math.round(parseFloat(kcal[1]));

  const hms = text.match(/\b(\d{1,2}):([0-5]\d):([0-5]\d)\b/);
  const ms = text.match(/\b(\d{1,2}):([0-5]\d)\b/);
  if (hms) {
    result.durationSeconds = toSeconds(hms[1], hms[2], hms[3]);
  } else if (ms) {
    result.durationSeconds = Number(ms[1]) * 60 + Number(ms[2]);
  }

  const bpmMatches = [...text.matchAll(/(\d{2,3})\s*bpm/gi)].map((m) =>
    Number(m[1])
  );
  if (bpmMatches.length > 0) result.avgHeartRate = bpmMatches[0];
  if (bpmMatches.length > 1) result.maxHeartRate = Math.max(...bpmMatches.slice(1));

  const steps = text.match(/(\d{2,6})\s*steps?/i);
  if (steps) result.steps = Number(steps[1]);

  return result;
}

export async function recognizeWorkoutResultImage(
  imageSource: File | string
): Promise<{ text: string; parsed: ParsedWorkoutResult }> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(imageSource);
    return { text: data.text, parsed: parseWorkoutResultText(data.text) };
  } finally {
    await worker.terminate();
  }
}
