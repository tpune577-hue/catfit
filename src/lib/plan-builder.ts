import type { Profile } from "@/types/profile";
import type { HealthAnalysis } from "@/types/health";
import {
  calculateBMR,
  calculateTDEE,
  getTargetCalories,
  calculateMacros,
} from "@/lib/body-analysis";
import { generateWeeklyPlan } from "@/lib/workout-planner";
import { mapHealthToPlan } from "@/lib/health-plan-mapper";

export function buildNutritionTargets(
  profile: Profile,
  calorieAdjustment = 0
) {
  const bmr = calculateBMR(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender
  );
  const tdee = calculateTDEE(
    bmr,
    profile.experience,
    profile.daysPerWeek,
    profile.sedentary
  );
  const base = getTargetCalories(tdee, profile.goal);
  const calories = base + calorieAdjustment;
  return calculateMacros(profile.weight, calories, profile.goal);
}

export function buildWeeklyPlan(
  profile: Profile,
  healthAnalysis?: HealthAnalysis | null
) {
  const settings = healthAnalysis
    ? mapHealthToPlan(healthAnalysis, {
        weight: profile.weight,
        height: profile.height,
        gender: profile.gender,
        sedentary: profile.sedentary,
        familyDiabetesHistory: profile.familyDiabetesHistory,
      })
    : null;

  return generateWeeklyPlan(
    profile,
    healthAnalysis,
    settings?.cardioMinutes ?? 20
  );
}
