import type { MealEntry, MacroTargets } from "@/types/nutrition";
import type { FoodTag } from "@/types/nutrition";

export function sumMeals(meals: MealEntry[]): MacroTargets {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
      carbs: acc.carbs + m.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function getMealWarnings(
  tags: FoodTag[],
  restrictions: string[]
): string[] {
  const warnings: string[] = [];
  const map: Record<string, string> = {
    "high-saturated-fat": "อาหารนี้มีไขมันอิ่มตัวสูง — ไม่เหมาะกับผลตรวจคอเลสเตอรอลสูง",
    fried: "อาหารทอด — ควรหลีกเลี่ยงตามคำแนะนำแพทย์",
    "red-meat": "เนื้อแดง — จำกัดตามผลตรวจ LDL สูง",
    "high-sugar": "น้ำตาลสูง — ระวังเบาหวาน",
  };

  for (const tag of tags) {
    if (restrictions.includes(tag) && map[tag]) {
      warnings.push(map[tag]);
    }
  }
  return warnings;
}

export function getCompliancePercent(
  actual: MacroTargets,
  targets: MacroTargets
): number {
  if (targets.calories === 0) return 0;
  const ratio = actual.calories / targets.calories;
  if (ratio > 1.1) return Math.max(0, 100 - (ratio - 1) * 100);
  if (ratio < 0.8) return ratio * 100;
  return 100 - Math.abs(1 - ratio) * 50;
}
