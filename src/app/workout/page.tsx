"use client";

import Link from "next/link";
import { ChevronRight, Library } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/stores/workout-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStoreHydration } from "@/components/providers/store-hydration-gate";

const DAY_NAMES = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"];

export default function WorkoutPage() {
  const router = useRouter();
  const hydrated = useStoreHydration();
  const weeklyPlan = useWorkoutStore((s) => s.weeklyPlan);

  useEffect(() => {
    if (!hydrated) return;
    if (!weeklyPlan) router.replace("/onboarding");
  }, [hydrated, weeklyPlan, router]);

  if (!hydrated || !weeklyPlan) {
    return (
      <p className="py-12 text-center text-muted-foreground">กำลังโหลด...</p>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="แผนรายสัปดาห์"
        description="ตารางออกกำลังกายที่ปรับตามเป้าหมายของคุณ"
        action={
          <Link href="/exercises">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Library className="h-4 w-4" />
              คลังท่า
            </Button>
          </Link>
        }
      />

      <div className="space-y-3">
        {weeklyPlan.days.map((day, i) => (
          <Link key={day.id} href={`/workout/${day.id}`}>
            <div className="rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold">
                    {DAY_NAMES[i % 7]} · {day.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {day.exercises.length} ท่า
                    {day.cardioBlock && ` · ${day.cardioBlock.label}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {day.focus.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-secondary-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
