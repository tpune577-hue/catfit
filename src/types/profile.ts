export type Gender = "male" | "female";
export type Goal = "lose_fat" | "gain_muscle" | "maintain";
export type Experience = "beginner" | "intermediate" | "advanced";

export interface Profile {
  name?: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  waist?: number;
  goal: Goal;
  experience: Experience;
  daysPerWeek: number;
  /** Weekday indices the user works out, 0 = Monday .. 6 = Sunday. */
  workoutDays: number[];
  targetWeight?: number;
  availableEquipment: string[];
  focusAreas: string[];
  healthFocusAreas: string[];
  dietaryRestrictions: string[];
  familyDiabetesHistory: boolean;
  sedentary: boolean;
  onboardingComplete: boolean;
}

export const DEFAULT_EQUIPMENT = [
  "body weight",
  "dumbbell",
  "barbell",
  "cable",
  "machine",
  "resistance band",
  "kettlebell",
];

export const FOCUS_AREA_OPTIONS = [
  { id: "waist", label: "หน้าท้อง" },
  { id: "cardio", label: "คาร์ดิโอ" },
  { id: "chest", label: "อก" },
  { id: "back", label: "หลัง" },
  { id: "shoulders", label: "ไหล่" },
  { id: "upper arms", label: "แขน" },
  { id: "upper legs", label: "ขา" },
  { id: "lower legs", label: "น่อง" },
];
