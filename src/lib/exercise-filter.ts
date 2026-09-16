import type { Exercise, RawExercise } from "@/types/exercise";
import { EXERCISE_CDN } from "@/types/exercise";
import rawExercises from "@/data/exercises.json";
import thaiStepsById from "@/data/exercise-steps-th.json";

const thaiSteps = thaiStepsById as Record<string, string[]>;

/** free-exercise-db primaryMuscles -> the body-part buckets used by
 * FOCUS_AREA_OPTIONS / the weekly-plan split generator. */
const MUSCLE_TO_BODY_PART: Record<string, string> = {
  abdominals: "waist",
  "lower back": "waist",
  chest: "chest",
  lats: "back",
  "middle back": "back",
  traps: "back",
  shoulders: "shoulders",
  biceps: "upper arms",
  triceps: "upper arms",
  forearms: "upper arms",
  quadriceps: "upper legs",
  hamstrings: "upper legs",
  glutes: "upper legs",
  adductors: "upper legs",
  abductors: "upper legs",
  calves: "lower legs",
  neck: "neck",
};

/** free-exercise-db primaryMuscles -> the muscle keys used by
 * MUSCLE_TH / TARGET_FOCUS (kept aligned with the old dataset's vocabulary). */
const MUSCLE_TO_TARGET: Record<string, string> = {
  abdominals: "abs",
  chest: "pectorals",
  shoulders: "deltoids",
  lats: "lats",
  "middle back": "upper back",
  traps: "traps",
  biceps: "biceps",
  triceps: "triceps",
  forearms: "forearms",
  quadriceps: "quadriceps",
  hamstrings: "hamstrings",
  glutes: "glutes",
  adductors: "adductors",
  abductors: "abductors",
  calves: "calves",
  "lower back": "lower back",
  neck: "neck",
};

const EQUIPMENT_ALIAS: Record<string, string> = {
  "body only": "body weight",
  kettlebells: "kettlebell",
  bands: "resistance band",
  "e-z curl bar": "ez barbell",
  "exercise ball": "stability ball",
};

function normalizeEquipment(raw: string | null): string {
  if (!raw) return "body weight";
  return EQUIPMENT_ALIAS[raw] ?? raw;
}

function imageUrl(images: string[], index: number): string {
  const path = images[index] ?? images[0];
  return path ? `${EXERCISE_CDN}/${path}` : "";
}

export function normalizeExercise(raw: RawExercise): Exercise {
  const instructionSteps = (raw.instructions ?? []).filter(Boolean);
  const instructions = instructionSteps.join(" ");
  const instructionStepsTh = thaiSteps[raw.id] ?? [];

  const primaryMuscle = raw.primaryMuscles?.[0] ?? "";
  const isCardio = raw.category === "cardio";
  const category = isCardio
    ? "cardio"
    : MUSCLE_TO_BODY_PART[primaryMuscle] ?? "waist";
  const target = isCardio
    ? "cardiovascular system"
    : MUSCLE_TO_TARGET[primaryMuscle] ?? primaryMuscle;

  return {
    id: raw.id,
    name: raw.name,
    category,
    target,
    equipment: normalizeEquipment(raw.equipment),
    secondaryMuscles: (raw.secondaryMuscles ?? []).map(
      (m) => MUSCLE_TO_TARGET[m] ?? m
    ),
    instructions,
    instructionSteps,
    instructionStepsTh,
    imageUrl: imageUrl(raw.images, 0),
    gifUrl: imageUrl(raw.images, 1),
  };
}

let _cache: Exercise[] | null = null;

export function getAllExercises(): Exercise[] {
  if (!_cache) {
    _cache = (rawExercises as RawExercise[])
      .filter((raw) => raw.images?.length > 0)
      .map(normalizeExercise);
  }
  return _cache;
}

const FOCUS_MAP: Record<string, string[]> = {
  waist: ["waist", "abs"],
  cardio: ["cardio"],
  chest: ["chest"],
  back: ["back"],
  shoulders: ["shoulders"],
  "upper arms": ["upper arms", "biceps", "triceps"],
  "upper legs": ["upper legs", "quads", "glutes", "hamstrings"],
  "lower legs": ["lower legs", "calves"],
};

export function filterExercises(options: {
  focusAreas?: string[];
  equipment?: string[];
  search?: string;
  excludeIds?: string[];
  limit?: number;
}): Exercise[] {
  const all = getAllExercises();
  const {
    focusAreas = [],
    equipment = [],
    search = "",
    excludeIds = [],
    limit,
  } = options;

  let result = all.filter((ex) => !excludeIds.includes(ex.id));

  if (focusAreas.length > 0) {
    const targets = new Set<string>();
    for (const area of focusAreas) {
      if (area === "cardio") {
        targets.add("cardiovascular system");
      }
      const mapped = FOCUS_MAP[area] ?? [area];
      mapped.forEach((t) => targets.add(t));
    }

    result = result.filter(
      (ex) =>
        targets.has(ex.category) ||
        targets.has(ex.target) ||
        ex.secondaryMuscles.some((m) => targets.has(m))
    );
  }

  if (equipment.length > 0) {
    const eqSet = new Set(equipment.map((e) => e.toLowerCase()));
    result = result.filter(
      (ex) =>
        eqSet.has(ex.equipment.toLowerCase()) ||
        ex.equipment.toLowerCase() === "body weight"
    );
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.target.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q)
    );
  }

  if (limit) result = result.slice(0, limit);
  return result;
}

export function getCategories(): string[] {
  return [...new Set(getAllExercises().map((e) => e.category))].sort();
}

export function getEquipmentList(): string[] {
  return [...new Set(getAllExercises().map((e) => e.equipment))].sort();
}

export function selectExercises(options: {
  targets: string[];
  equipment: string[];
  count: number;
  excludeIds?: string[];
}): Exercise[] {
  const { targets, equipment, count, excludeIds = [] } = options;
  const selected: Exercise[] = [];
  const usedIds = new Set(excludeIds);

  for (const target of targets) {
    const candidates = filterExercises({
      focusAreas: [target],
      equipment,
      excludeIds: [...usedIds],
    });
    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * Math.min(5, candidates.length))];
      selected.push(pick);
      usedIds.add(pick.id);
    }
    if (selected.length >= count) break;
  }

  if (selected.length < count) {
    const more = filterExercises({
      focusAreas: targets,
      equipment,
      excludeIds: [...usedIds],
      limit: count - selected.length,
    });
    selected.push(...more);
  }

  return selected.slice(0, count);
}

/** หาท่าทดแทนที่โฟกัสกล้ามเดียวกัน รองรับอุปกรณ์ที่มี */
export function findAlternativeExercise(options: {
  current: Exercise;
  equipment: string[];
  excludeIds: string[];
}): Exercise | null {
  const { current, equipment, excludeIds } = options;
  const exclude = [...excludeIds, current.id];

  const tryFind = (eq: string[]) => {
    const byTarget = filterExercises({
      focusAreas: [current.target],
      equipment: eq,
      excludeIds: exclude,
    });
    if (byTarget.length > 0) {
      return byTarget[Math.floor(Math.random() * Math.min(8, byTarget.length))];
    }
    const byCategory = filterExercises({
      focusAreas: [current.category],
      equipment: eq,
      excludeIds: exclude,
    });
    if (byCategory.length > 0) {
      return byCategory[Math.floor(Math.random() * Math.min(8, byCategory.length))];
    }
    return null;
  };

  const withUserEq = equipment.length > 0 ? tryFind(equipment) : null;
  if (withUserEq) return withUserEq;

  return tryFind(["body weight"]);
}
