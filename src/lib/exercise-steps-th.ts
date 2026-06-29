import type { Exercise } from "@/types/exercise";
import thaiStepsById from "@/data/exercise-steps-th.json";
import stepCache from "@/data/exercise-step-cache.json";
import {
  isMostlyEnglish,
  translateSteps,
} from "@/lib/exercise-step-translator";

const thaiSteps = thaiStepsById as Record<string, string[]>;
const cache = stepCache as Record<string, string>;

export function getThaiInstructionSteps(exercise: Exercise): string[] {
  const fromFile = thaiSteps[exercise.id];
  if (fromFile?.length && !fromFile.some(isMostlyEnglish)) {
    return fromFile;
  }

  const enSteps =
    exercise.instructionSteps?.length > 0
      ? exercise.instructionSteps
      : exercise.instructions
          .split(/(?<=[.!])\s+/)
          .filter((s) => s.trim().length > 10);

  if (enSteps.length === 0) {
    return translateSteps([], exercise, cache);
  }

  return translateSteps(enSteps, exercise, cache);
}
