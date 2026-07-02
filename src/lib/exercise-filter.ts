import type { Exercise, RawExercise } from "@/types/exercise";
import { EXERCISE_CDN } from "@/types/exercise";
import rawExercises from "@/data/exercises.json";
import thaiStepsById from "@/data/exercise-steps-th.json";

const thaiSteps = thaiStepsById as Record<string, string[]>;

function mediaIdFrom(path: string): string {
  return path.replace(/^.*\/\d+-/, "").replace(/\.[^.]+$/, "");
}

export function normalizeExercise(raw: RawExercise): Exercise {
  const instructionSteps =
    raw.instruction_steps?.en ??
    (raw.instructions?.en
      ? raw.instructions.en.split(/(?<=[.!])\s+/).filter((s) => s.length > 10)
      : []);
  const instructions =
    instructionSteps.join(" ") ||
    raw.instructions?.en ||
    "";
  const instructionStepsTh = thaiSteps[raw.id] ?? [];
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category || raw.body_part,
    target: raw.target,
    equipment: raw.equipment,
    secondaryMuscles: raw.secondary_muscles ?? [],
    instructions,
    instructionSteps,
    instructionStepsTh,
    imageUrl: `${EXERCISE_CDN}/${mediaIdFrom(raw.image)}.gif`,
    gifUrl: `${EXERCISE_CDN}/${mediaIdFrom(raw.gif_url)}.gif`,
  };
}

let _cache: Exercise[] | null = null;

export function getAllExercises(): Exercise[] {
  if (!_cache) {
    _cache = (rawExercises as RawExercise[]).map(normalizeExercise);
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
