import type { HealthAnalysis } from "@/types/health";
import type { Goal, Experience, Profile } from "@/types/profile";
import { getIdealWeightRange } from "./body-analysis";
import { normalizeWorkoutDays } from "./weekdays";

export interface PlanSettings {
  goal: Goal;
  experience: Experience;
  daysPerWeek: number;
  targetWeight?: number;
  focusAreas: string[];
  dietaryRestrictions: string[];
  sedentary: boolean;
  familyDiabetesHistory: boolean;
  calorieAdjustment: number;
  cardioMinutes: number;
}

export function mapHealthToPlan(
  analysis: HealthAnalysis,
  report: {
    weight?: number;
    height?: number;
    gender?: "male" | "female";
    sedentary?: boolean;
    familyDiabetesHistory?: boolean;
  }
): PlanSettings {
  const gender = report.gender ?? "male";
  let goal: Goal = "maintain";
  let experience: Experience = report.sedentary ? "beginner" : "intermediate";
  let daysPerWeek = 4;
  let calorieAdjustment = 0;
  let cardioMinutes = 15;

  if (analysis.priorityGoals.includes("lose_fat")) {
    goal = "lose_fat";
    calorieAdjustment = -500;
    daysPerWeek = 4;
  }
  if (analysis.priorityGoals.includes("gain_muscle")) {
    goal = "gain_muscle";
    calorieAdjustment = 300;
  }

  if (analysis.findings.some((f) => f.category === "low_fitness")) {
    experience = "beginner";
    cardioMinutes = 30;
    daysPerWeek = Math.min(daysPerWeek, 4);
  }

  if (analysis.findings.some((f) => f.category === "hyperlipidemia")) {
    cardioMinutes = Math.max(cardioMinutes, 20);
  }

  let targetWeight: number | undefined;
  if (report.weight && report.height) {
    const [min, max] = getIdealWeightRange(report.height, gender);
    targetWeight = Math.round((min + max) / 2);
  }

  const focusAreas =
    analysis.healthFocusAreas.length > 0
      ? analysis.healthFocusAreas
      : ["waist", "cardio"];

  return {
    goal,
    experience,
    daysPerWeek,
    targetWeight,
    focusAreas,
    dietaryRestrictions: analysis.dietaryRestrictions,
    sedentary: report.sedentary ?? false,
    familyDiabetesHistory: report.familyDiabetesHistory ?? false,
    calorieAdjustment,
    cardioMinutes,
  };
}

export function applyPlanToProfile(
  profile: Partial<Profile>,
  settings: PlanSettings
): Profile {
  return {
    name: profile.name,
    gender: profile.gender ?? "male",
    age: profile.age ?? 30,
    weight: profile.weight ?? 70,
    height: profile.height ?? 170,
    waist: profile.waist,
    goal: settings.goal,
    experience: settings.experience,
    daysPerWeek: settings.daysPerWeek,
    workoutDays: normalizeWorkoutDays(profile.workoutDays, settings.daysPerWeek),
    targetWeight: settings.targetWeight,
    availableEquipment: profile.availableEquipment ?? ["body weight"],
    focusAreas: settings.focusAreas,
    healthFocusAreas: settings.focusAreas,
    dietaryRestrictions: settings.dietaryRestrictions,
    familyDiabetesHistory: settings.familyDiabetesHistory,
    sedentary: settings.sedentary,
    onboardingComplete: profile.onboardingComplete ?? false,
  };
}
