/**
 * One-time / on-demand generator for Thai exercise instruction steps.
 * Run: node scripts/generate-thai-steps.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { translate } from "@vitalets/google-translate-api";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const exercisesPath = join(root, "src/data/exercises.json");
const cachePath = join(root, "src/data/exercise-step-cache.json");
const outputPath = join(root, "src/data/exercise-steps-th.json");

const POST_FIXES = [
  [/กล้ามเนื้อหน้าท้อง/g, "กล้ามท้อง"],
  [/หมอน/g, "เบาะ"],
  [/แถบยาง/g, "ยางยืด"],
  [/แถบ/g, "ยางยืด"],
  [/ดัมเบลล์/g, "ดัมเบล"],
  [/บาร์เบลล์/g, "บาร์เบล"],
  [/เครื่องเคเบิล/g, "เครื่องเคเบิล"],
  [/การออกกำลังกาย/g, "ออกกำลังกาย"],
];

function polishThai(text) {
  let result = text;
  for (const [pattern, replacement] of POST_FIXES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateStep(text, cache) {
  const key = text.trim();
  if (cache[key]) return cache[key];

  let attempts = 0;
  while (attempts < 4) {
    try {
      const { text: translated } = await translate(key, { from: "en", to: "th" });
      const polished = polishThai(translated);
      cache[key] = polished;
      return polished;
    } catch (err) {
      attempts++;
      await sleep(1000 * attempts);
      if (attempts >= 4) throw err;
    }
  }
}

async function main() {
  const exercises = JSON.parse(readFileSync(exercisesPath, "utf8"));
  const cache = existsSync(cachePath)
    ? JSON.parse(readFileSync(cachePath, "utf8"))
    : {};

  const uniqueSteps = new Set();
  for (const ex of exercises) {
    for (const step of ex.instruction_steps?.en ?? []) {
      uniqueSteps.add(step.trim());
    }
  }

  const total = uniqueSteps.size;
  let done = 0;
  console.log(`Translating ${total} unique steps (${Object.keys(cache).length} cached)...`);

  for (const step of uniqueSteps) {
    if (!cache[step]) {
      await translateStep(step, cache);
      done++;
      if (done % 25 === 0) {
        writeFileSync(cachePath, JSON.stringify(cache, null, 0));
        console.log(`  ${Object.keys(cache).length}/${total}`);
      }
      await sleep(120);
    }
  }

  writeFileSync(cachePath, JSON.stringify(cache, null, 0));

  const byExercise = {};
  for (const ex of exercises) {
    const enSteps = ex.instruction_steps?.en ?? [];
    byExercise[ex.id] = enSteps.map((s) => cache[s.trim()] ?? s.trim());
  }

  writeFileSync(outputPath, JSON.stringify(byExercise, null, 0));
  console.log(`Wrote ${outputPath} (${exercises.length} exercises)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
