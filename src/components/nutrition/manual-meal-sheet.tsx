"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { MealType } from "@/types/nutrition";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "เช้า",
  lunch: "กลางวัน",
  dinner: "เย็น",
  snack: "ว่าง",
};

export interface ManualMealInput {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
}

export function ManualMealSheet({
  mealType,
  onSubmit,
}: {
  mealType: MealType;
  onSubmit: (data: ManualMealInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<MealType>(mealType);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setSelectedMeal(mealType);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    const kcal = Number(calories);

    if (!trimmed) {
      setError("กรุณาระบุชื่ออาหาร");
      return;
    }
    if (!Number.isFinite(kcal) || kcal <= 0) {
      setError("กรุณากรอกแคลอรี่ที่มากกว่า 0");
      return;
    }

    onSubmit({
      name: trimmed,
      calories: Math.round(kcal),
      protein: Math.max(0, Math.round(Number(protein) || 0)),
      carbs: Math.max(0, Math.round(Number(carbs) || 0)),
      fat: Math.max(0, Math.round(Number(fat) || 0)),
      mealType: selectedMeal,
    });
    reset();
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
        else setSelectedMeal(mealType);
      }}
    >
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full shadow-sm"
          aria-label="บันทึกอาหารเอง"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>บันทึกอาหารเอง</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MEAL_LABELS) as MealType[]).map((t) => (
              <Button
                key={t}
                type="button"
                variant={selectedMeal === t ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMeal(t)}
              >
                {MEAL_LABELS[t]}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-name">ชื่ออาหาร</Label>
            <Input
              id="meal-name"
              placeholder="เช่น ข้าวผัดกุ้ง"
              className="h-11 text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-calories">แคลอรี่ (kcal) *</Label>
            <Input
              id="meal-calories"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="450"
              className="h-11 text-base"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            โปรตีน / คาร์บ / ไขมัน (ไม่บังคับ)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="meal-protein" className="text-xs">
                โปรตีน (g)
              </Label>
              <Input
                id="meal-protein"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="0"
                className="h-10"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meal-carbs" className="text-xs">
                คาร์บ (g)
              </Label>
              <Input
                id="meal-carbs"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="0"
                className="h-10"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meal-fat" className="text-xs">
                ไขมัน (g)
              </Label>
              <Input
                id="meal-fat"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="0"
                className="h-10"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="h-12 w-full text-base" size="lg">
            บันทึก
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
