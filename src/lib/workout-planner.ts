import type { Profile } from "@/types/profile";
import type { HealthAnalysis } from "@/types/health";
import type {
  WeeklyPlan,
  WorkoutDay,
  WorkoutExercise,
  CardioBlock,
} from "@/types/workout";
import type { Goal, Experience } from "@/types/profile";
import { selectExercises } from "./exercise-filter";
import { normalizeWorkoutDays } from "./weekdays";

interface DaySplit {
  label: string;
  muscleGroups: string[];
  includesCardio: boolean;
}

function pickSplit(daysPerWeek: number, focusAreas: string[]): DaySplit[] {
  const hasCardio = focusAreas.includes("cardio");
  const strengthFocus = focusAreas.filter((f) => f !== "cardio");

  if (daysPerWeek <= 3) {
    return Array.from({ length: daysPerWeek }, (_, i) => ({
      label: `Full Body ${i + 1}`,
      muscleGroups: strengthFocus.length ? strengthFocus : ["waist", "upper legs", "chest", "back"],
      includesCardio: hasCardio || i === daysPerWeek - 1,
    }));
  }

  if (daysPerWeek === 4) {
    return [
      { label: "Upper Body", muscleGroups: ["chest", "back", "shoulders", "upper arms"], includesCardio: false },
      { label: "Lower Body + Core", muscleGroups: ["upper legs", "waist", "lower legs"], includesCardio: hasCardio },
      { label: "Push", muscleGroups: ["chest", "shoulders", "upper arms"], includesCardio: false },
      { label: "Pull + Cardio", muscleGroups: ["back", "waist"], includesCardio: true },
    ];
  }

  return [
    { label: "Push", muscleGroups: ["chest", "shoulders", "upper arms"], includesCardio: false },
    { label: "Pull", muscleGroups: ["back", "upper arms"], includesCardio: false },
    { label: "Legs", muscleGroups: ["upper legs", "lower legs"], includesCardio: false },
    { label: "Core + Cardio", muscleGroups: ["waist"], includesCardio: true },
    { label: "Full Body", muscleGroups: strengthFocus.length ? strengthFocus.slice(0, 3) : ["chest", "back", "upper legs"], includesCardio: hasCardio },
    ...(daysPerWeek >= 6
      ? [{ label: "Active Recovery", muscleGroups: ["waist"], includesCardio: true }]
      : []),
  ].slice(0, daysPerWeek);
}

function getVolume(goal: Goal, experience: Experience) {
  if (goal === "lose_fat") {
    return { sets: 3, reps: "12-15", restSeconds: 45 };
  }
  if (goal === "gain_muscle") {
    return {
      sets: experience === "beginner" ? 3 : 4,
      reps: "8-12",
      restSeconds: 75,
    };
  }
  return { sets: 3, reps: "10-12", restSeconds: 60 };
}

function getCardioBlock(minutes: number): CardioBlock {
  return {
    type: "brisk_walk",
    minutes,
    label: `เดินเร็ว ${minutes} นาที`,
  };
}

export function generateWeeklyPlan(
  profile: Profile,
  healthAnalysis?: HealthAnalysis | null,
  cardioMinutes = 20
): WeeklyPlan {
  const focusAreas =
    healthAnalysis?.healthFocusAreas?.length
      ? healthAnalysis.healthFocusAreas
      : profile.focusAreas.length
        ? profile.focusAreas
        : ["waist", "cardio"];

  const split = pickSplit(profile.daysPerWeek, focusAreas);
  const workoutDays = normalizeWorkoutDays(profile.workoutDays, profile.daysPerWeek);
  const volume = getVolume(profile.goal, profile.experience);
  const exerciseCount = profile.experience === "beginner" ? 4 : 6;
  const lowFitness = healthAnalysis?.findings.some(
    (f) => f.category === "low_fitness"
  );
  const cardio = lowFitness ? Math.max(cardioMinutes, 30) : cardioMinutes;

  const days: WorkoutDay[] = split.map((day, index) => {
    const exercises = selectExercises({
      targets: day.muscleGroups,
      equipment: profile.availableEquipment,
      count: day.includesCardio ? Math.max(3, exerciseCount - 1) : exerciseCount,
    });

    const workoutExercises: WorkoutExercise[] = exercises.map((ex) => ({
      exercise: ex,
      sets: volume.sets,
      reps: volume.reps,
      restSeconds: volume.restSeconds,
    }));

    return {
      id: `day-${index}`,
      name: day.label,
      dayIndex: workoutDays[index],
      focus: day.muscleGroups,
      exercises: workoutExercises,
      cardioBlock: day.includesCardio ? getCardioBlock(cardio) : null,
    };
  });

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    days,
  };
}
