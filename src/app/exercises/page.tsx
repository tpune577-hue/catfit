"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { ExerciseCard } from "@/components/workout/exercise-card";
import {
  filterExercises,
  getCategories,
  getEquipmentList,
} from "@/lib/exercise-filter";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(), []);
  const equipmentList = useMemo(() => getEquipmentList(), []);

  const exercises = useMemo(
    () =>
      filterExercises({
        focusAreas: category ? [category] : undefined,
        equipment: equipment ? [equipment] : undefined,
        search,
        limit: 50,
      }),
    [category, equipment, search]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="คลังท่าออกกำลังกาย"
        description={`ค้นหาและกรองจาก ${exercises.length} ท่า`}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาท่า..."
          className="h-11 pl-9 text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
            category === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          ทั้งหมด
        </button>
        {categories.slice(0, 8).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c === category ? null : c)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {equipmentList.slice(0, 6).map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEquipment(e === equipment ? null : e)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
              equipment === e
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {exercises.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
