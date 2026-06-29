"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Flame, ChevronRight, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FindingCards } from "@/components/health/finding-badge";
import { PageHeader } from "@/components/layout/page-header";
import { StatTile } from "@/components/layout/stat-tile";
import { Section } from "@/components/layout/section";
import { DailyStreakDots } from "@/components/workout/daily-streak-dots";
import { useStoreHydration } from "@/components/providers/store-hydration-gate";
import { useProfileStore } from "@/stores/profile-store";
import { useHealthStore } from "@/stores/health-store";
import { useWorkoutStore } from "@/stores/workout-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { sumMeals } from "@/lib/nutrition";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const hydrated = useStoreHydration();
  const profile = useProfileStore((s) => s.profile);
  const latestAnalysis = useHealthStore((s) => s.latestAnalysis);
  const weeklyPlan = useWorkoutStore((s) => s.weeklyPlan);
  const { targets, getMealsForDate } = useNutritionStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayMeals = getMealsForDate(today);
  const todayTotals = sumMeals(todayMeals);

  useEffect(() => {
    if (!hydrated) return;
    if (!profile?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [hydrated, profile, router]);

  if (!hydrated || !profile?.onboardingComplete) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  const todayIndex = new Date().getDay();
  const planDayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const todayWorkout = weeklyPlan?.days[planDayIndex % (weeklyPlan?.days.length ?? 1)];

  const calPct = targets
    ? Math.min(100, (todayTotals.calories / targets.calories) * 100)
    : 0;

  const issues = latestAnalysis?.findings.filter(
    (f) => f.severity !== "normal"
  ) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`สวัสดี${profile.name ? `, ${profile.name}` : ""}`}
        description={
          latestAnalysis?.summary ?? "ติดตามสุขภาพและออกกำลังกายของคุณ"
        }
      />

      <DailyStreakDots />

      <p className="rounded-xl border border-primary/30 bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground/80">
        แอปนี้ช่วยจัดการไลฟ์สไตล์ ไม่ใช่คำแนะนำทางการแพทย์
      </p>

      {issues.length > 0 && (
        <Section
          title="ปัญหาที่ต้องแก้"
          description="จากรายงานสุขภาพล่าสุด"
          action={
            issues.length > 3 ? (
              <Link
                href="/health"
                className="shrink-0 text-sm font-medium text-primary"
              >
                ดูทั้งหมด
              </Link>
            ) : undefined
          }
        >
          <FindingCards findings={issues.slice(0, 3)} />
        </Section>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="แคลอรี่วันนี้"
          value={Math.round(todayTotals.calories)}
          unit={`/ ${targets?.calories ?? "—"} kcal`}
          icon={Flame}
        >
          <Progress value={calPct} className="mt-3 h-2" />
        </StatTile>

        <StatTile
          label="น้ำหนักปัจจุบัน"
          value={profile.weight}
          unit="kg"
          sub={
            profile.targetWeight
              ? `เป้าหมาย ${profile.targetWeight} kg`
              : undefined
          }
          icon={Activity}
        />
      </div>

      {todayWorkout && (
        <Section title={`วันนี้ · ${todayWorkout.name}`}>
          <div className="rounded-2xl border-2 border-primary/40 bg-foreground p-4 text-background shadow-md">
            <p className="text-base font-medium">
              {todayWorkout.exercises.length} ท่า
              {todayWorkout.cardioBlock &&
                ` · ${todayWorkout.cardioBlock.label}`}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href={`/workout/${todayWorkout.id}`} className="flex-1">
                <Button className="h-11 w-full text-base font-semibold" size="lg">
                  เริ่มออกกำลังกาย
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/exercises" className="sm:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full gap-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 sm:w-auto"
                >
                  <Library className="h-4 w-4" />
                  คลังท่า
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      )}

      <Section title="บันทึกด่วน">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/nutrition">
            <Button variant="outline" className="h-12 w-full text-base">
              บันทึกอาหาร
            </Button>
          </Link>
          <Link href="/body">
            <Button variant="outline" className="h-12 w-full text-base">
              บันทึกน้ำหนัก
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
