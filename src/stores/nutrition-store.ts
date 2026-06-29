"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MealEntry, MacroTargets } from "@/types/nutrition";

interface NutritionState {
  meals: MealEntry[];
  targets: MacroTargets | null;
  calorieAdjustment: number;
  setTargets: (targets: MacroTargets) => void;
  adjustCalories: (delta: number) => void;
  addMeal: (meal: MealEntry) => void;
  removeMeal: (id: string) => void;
  getMealsForDate: (date: string) => MealEntry[];
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      meals: [],
      targets: null,
      calorieAdjustment: 0,
      setTargets: (targets) => set({ targets }),
      adjustCalories: (delta) =>
        set((s) => ({
          calorieAdjustment: s.calorieAdjustment + delta,
          targets: s.targets
            ? { ...s.targets, calories: s.targets.calories + delta }
            : null,
        })),
      addMeal: (meal) => set((s) => ({ meals: [meal, ...s.meals] })),
      removeMeal: (id) =>
        set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),
      getMealsForDate: (date) =>
        get().meals.filter((m) => m.date === date),
    }),
    { name: "fitness-nutrition" }
  )
);
