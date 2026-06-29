/**
 * Build exercise-steps-th.json from cache + offline translator (no API).
 * Run: node scripts/build-thai-steps-offline.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Register ts paths via compiled approach - use dynamic import of built modules
// For simplicity, inline the offline logic by requiring after ts compile won't work.
// We'll duplicate minimal build logic in JS.

const exercisesPath = join(root, "src/data/exercises.json");
const cachePath = join(root, "src/data/exercise-step-cache.json");
const outputPath = join(root, "src/data/exercise-steps-th.json");

const exercises = JSON.parse(readFileSync(exercisesPath, "utf8"));
const cache = existsSync(cachePath)
  ? JSON.parse(readFileSync(cachePath, "utf8"))
  : {};

// Import translator via tsx or compile - use node with experimental strip types
const { translateSteps } = await import("../src/lib/exercise-step-translator.ts");

const byExercise = {};
for (const ex of exercises) {
  const enSteps = ex.instruction_steps?.en ?? [];
  const exercise = {
    id: ex.id,
    name: ex.name,
    category: ex.category || ex.body_part,
    target: ex.target,
    equipment: ex.equipment,
    secondaryMuscles: ex.secondary_muscles ?? [],
    instructions: enSteps.join(" "),
    instructionSteps: enSteps,
    instructionStepsTh: [],
    imageUrl: "",
    gifUrl: "",
  };
  byExercise[ex.id] = translateSteps(enSteps, exercise, cache);
}

writeFileSync(outputPath, JSON.stringify(byExercise));
console.log(`Wrote ${outputPath} (${exercises.length} exercises, ${Object.keys(cache).length} cached phrases)`);
