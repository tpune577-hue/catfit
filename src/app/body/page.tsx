"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ProgressChart } from "@/components/body/progress-chart";
import { useBodyMetricsStore } from "@/stores/body-metrics-store";
import { useProfileStore } from "@/stores/profile-store";
import { useHealthStore } from "@/stores/health-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { analyzeProgress, analyzeWaistProgress } from "@/lib/plan-adjuster";
import { calculateBMI, getBMICategory } from "@/lib/body-analysis";

export default function BodyPage() {
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const { metrics, addMetric } = useBodyMetricsStore();
  const profile = useProfileStore((s) => s.profile);
  const latestReport = useHealthStore((s) => s.getLatestReport());
  const adjustCalories = useNutritionStore((s) => s.adjustCalories);

  const bmi = profile
    ? calculateBMI(profile.weight, profile.height)
    : null;

  const adjustment = profile
    ? analyzeProgress(metrics, profile.goal)
    : null;

  const waistMsg = analyzeWaistProgress(metrics, latestReport?.waist);

  const save = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    addMetric({
      date: today,
      weight: weight ? parseFloat(weight) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
    });
    if (weight && profile) {
      useProfileStore.getState().updateProfile({ weight: parseFloat(weight) });
    }
    if (adjustment && adjustment.calorieDelta !== 0) {
      adjustCalories(adjustment.calorieDelta);
    }
    setWeight("");
    setWaist("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ข้อมูลร่างกาย"
        description="บันทึกน้ำหนักและรอบเอวเพื่อติดตามความคืบหน้า"
      />

      {profile && bmi && (
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border/80 bg-card p-4 text-center">
          <div>
            <p className="text-2xl font-semibold tabular-nums">{profile.weight}</p>
            <p className="text-sm text-muted-foreground">kg</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{bmi}</p>
            <p className="text-sm text-muted-foreground">BMI</p>
          </div>
          <div>
            <p className="text-base font-medium">{getBMICategory(bmi)}</p>
            <p className="text-sm text-muted-foreground">สถานะ</p>
          </div>
        </div>
      )}

      {adjustment && (
        <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-base leading-relaxed">
          {adjustment.message}
        </p>
      )}

      {waistMsg && (
        <p className="rounded-xl border border-border/80 bg-muted/50 px-4 py-3 text-base leading-relaxed text-muted-foreground">
          {waistMsg}
        </p>
      )}

      <Section title="บันทึกวันนี้">
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">น้ำหนัก (kg)</Label>
            <Input
              type="number"
              className="h-11 text-base"
              placeholder={String(profile?.weight ?? "")}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">รอบเอว (cm)</Label>
            <Input
              type="number"
              className="h-11 text-base"
              placeholder={String(latestReport?.waist ?? "")}
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />
          </div>
          <Button className="h-11 w-full text-base" onClick={save}>
            บันทึก
          </Button>
        </div>
      </Section>

      <Section title="แนวโน้ม">
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4">
          <ProgressChart
            metrics={metrics}
            dataKey="weight"
            label="น้ำหนัก"
            unit="kg"
          />
          <ProgressChart
            metrics={metrics}
            dataKey="waist"
            label="รอบเอว"
            unit="cm"
            color="#0d9488"
          />
        </div>
      </Section>

      {latestReport && (
        <p className="text-center text-sm text-muted-foreground">
          ค่าจากรายงานสุขภาพ: {latestReport.weight} kg
          {latestReport.waist && ` · รอบเอว ${latestReport.waist} cm`}
        </p>
      )}
    </div>
  );
}
