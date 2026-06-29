export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type FoodTag =
  | "high-saturated-fat"
  | "fried"
  | "red-meat"
  | "high-sugar"
  | "low-gi"
  | "high-protein";

export interface FoodItem {
  id: string;
  name: string;
  nameEn?: string;
  servingSize: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  tags: FoodTag[];
}

export interface MealEntry {
  id: string;
  foodId?: string;
  name: string;
  mealType: MealType;
  servings: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  tags: FoodTag[];
  date: string;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DailyNutrition {
  date: string;
  meals: MealEntry[];
  targets: MacroTargets;
}
