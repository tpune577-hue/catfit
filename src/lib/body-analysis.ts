import type { Gender, Goal, Experience } from "@/types/profile";
import type { MacroTargets } from "@/types/nutrition";

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 100) / 100;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "น้ำหนักน้อย";
  if (bmi < 23) return "ปกติ";
  if (bmi < 25) return "น้ำหนักเกิน";
  if (bmi < 30) return "อ้วน";
  return "อ้วนมาก";
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function getActivityFactor(
  experience: Experience,
  daysPerWeek: number,
  sedentary: boolean
): number {
  if (sedentary) return 1.2;
  if (daysPerWeek <= 2) return 1.375;
  if (daysPerWeek <= 4) return 1.55;
  if (daysPerWeek <= 5) return 1.725;
  return 1.9;
}

export function calculateTDEE(
  bmr: number,
  experience: Experience,
  daysPerWeek: number,
  sedentary: boolean
): number {
  return Math.round(bmr * getActivityFactor(experience, daysPerWeek, sedentary));
}

export function getTargetCalories(tdee: number, goal: Goal): number {
  if (goal === "lose_fat") return tdee - 500;
  if (goal === "gain_muscle") return tdee + 300;
  return tdee;
}

export function calculateMacros(
  weightKg: number,
  targetCalories: number,
  goal: Goal
): MacroTargets {
  const proteinPerKg = goal === "lose_fat" ? 2.0 : goal === "gain_muscle" ? 2.2 : 1.8;
  const protein = Math.round(weightKg * proteinPerKg);
  const fat = Math.round((targetCalories * 0.28) / 9);
  const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
  return { calories: targetCalories, protein, fat, carbs };
}

export function getIdealWeightRange(heightCm: number, gender: Gender): [number, number] {
  const heightM = heightCm / 100;
  const min = gender === "male" ? 20 : 19;
  const max = gender === "male" ? 23 : 22;
  return [
    Math.round(min * heightM * heightM),
    Math.round(max * heightM * heightM),
  ];
}
