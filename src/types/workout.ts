import type { Exercise } from "./exercise";

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface CardioBlock {
  type: "brisk_walk" | "jogging" | "cycling";
  minutes: number;
  label: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayIndex: number;
  focus: string[];
  exercises: WorkoutExercise[];
  cardioBlock: CardioBlock | null;
}

export interface WeeklyPlan {
  id: string;
  createdAt: string;
  days: WorkoutDay[];
}

export interface WorkoutSession {
  id: string;
  dayId: string;
  startedAt: string;
  completedAt?: string;
  completedExercises: string[];
}
