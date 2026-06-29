"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { MacroRing } from "@/components/nutrition/macro-ring";
import {
  ManualMealSheet,
  type ManualMealInput,
} from "@/components/nutrition/manual-meal-sheet";
import { useNutritionStore } from "@/stores/nutrition-store";
import { useProfileStore } from "@/stores/profile-store";
import { sumMeals, getMealWarnings } from "@/lib/nutrition";
import foodsData from "@/data/thai-foods.json";
import type { FoodItem, MealType } from "@/types/nutrition";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "เช้า",
  lunch: "กลางวัน",
  dinner: "เย็น",
  snack: "ว่าง",
};

export default function NutritionPage() {
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const { targets, getMealsForDate, addMeal, removeMeal } = useNutritionStore();
  const profile = useProfileStore((s) => s.profile);
  const today = format(new Date(), "yyyy-MM-dd");
  const meals = getMealsForDate(today);
  const totals = sumMeals(meals);
  const foods = foodsData as FoodItem[];

  const filtered = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const restrictions = profile?.dietaryRestrictions ?? [];

  const addFood = (food: FoodItem) => {
    const warnings = getMealWarnings(food.tags, restrictions);
    addMeal({
      id: crypto.randomUUID(),
      foodId: food.id,
      name: food.name,
      mealType,
      servings: 1,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      tags: food.tags,
      date: today,
    });
    if (warnings.length > 0) {
      // warnings shown via UI on food items
    }
  };

  const addManualMeal = (data: ManualMealInput) => {
    addMeal({
      id: crypto.randomUUID(),
      name: data.name,
      mealType: data.mealType,
      servings: 1,
      calories: data.calories,
      protein: data.protein,
      fat: data.fat,
      carbs: data.carbs,
      tags: [],
      date: today,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="โภชนาการ"
        description="บันทึกมื้ออาหารและติดตามแคลอรี่รายวัน"
      />

      {restrictions.length > 0 && (
        <p className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          หลีกเลี่ยงเนื้อแดง เนย และอาหารทอด ตามผลตรวจคอเลสเตอรอล
        </p>
      )}

      {targets && (
        <div className="flex justify-around rounded-2xl border border-border/80 bg-card py-5">
          <MacroRing label="แคลอรี่" current={totals.calories} target={targets.calories} unit="" />
          <MacroRing label="โปรตีน" current={totals.protein} target={targets.protein} color="stroke-blue-500" />
          <MacroRing label="คาร์บ" current={totals.carbs} target={targets.carbs} color="stroke-amber-500" />
          <MacroRing label="ไขมัน" current={totals.fat} target={targets.fat} color="stroke-rose-500" />
        </div>
      )}

      <Section title="มื้อวันนี้">
        {meals.length === 0 ? (
          <p className="text-base text-muted-foreground">ยังไม่มีรายการอาหาร</p>
        ) : (
          <div className="space-y-2">
            {meals.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-3"
              >
                <div>
                  <p className="text-base font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {MEAL_LABELS[m.mealType]} · {m.calories} kcal
                    {!m.foodId && " · บันทึกเอง"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => removeMeal(m.id)}
                >
                  ลบ
                </Button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="เพิ่มอาหาร"
        action={<ManualMealSheet mealType={mealType} onSubmit={addManualMeal} />}
      >
        <div className="flex flex-wrap gap-2">
        {(Object.keys(MEAL_LABELS) as MealType[]).map((t) => (
          <Button
            key={t}
            variant={mealType === t ? "default" : "outline"}
            size="sm"
            onClick={() => setMealType(t)}
          >
            {MEAL_LABELS[t]}
          </Button>
        ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาอาหาร..."
            className="h-11 pl-9 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {filtered.slice(0, 20).map((food) => {
            const warnings = getMealWarnings(food.tags, restrictions);
            return (
              <button
                key={food.id}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-border/60 p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-accent/40"
                onClick={() => addFood(food)}
              >
                <div>
                  <p className="text-base font-medium">{food.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {food.servingSize} · {food.calories} kcal
                  </p>
                </div>
                {warnings.length > 0 && (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                )}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
