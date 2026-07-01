"use client";

import { useProfileStore } from "@/stores/profile-store";
import { useHealthStore } from "@/stores/health-store";
import { useWorkoutStore } from "@/stores/workout-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { buildNutritionTargets, buildWeeklyPlan } from "@/lib/plan-builder";

export function useUpdateWorkoutDays() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const latestAnalysis = useHealthStore((s) => s.latestAnalysis);
  const setWeeklyPlan = useWorkoutStore((s) => s.setWeeklyPlan);
  const setTargets = useNutritionStore((s) => s.setTargets);
  const calorieAdjustment = useNutritionStore((s) => s.calorieAdjustment);

  return (workoutDays: number[]) => {
    if (!profile) return;
    const updated = { ...profile, workoutDays, daysPerWeek: workoutDays.length };
    updateProfile({ workoutDays, daysPerWeek: workoutDays.length });
    setWeeklyPlan(buildWeeklyPlan(updated, latestAnalysis));
    setTargets(buildNutritionTargets(updated, calorieAdjustment));
  };
}
