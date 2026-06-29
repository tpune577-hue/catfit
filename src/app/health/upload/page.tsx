"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/health/upload-dropzone";
import { ParsedDataReview } from "@/components/health/parsed-data-review";
import { FindingCards } from "@/components/health/finding-badge";
import { useHealthStore } from "@/stores/health-store";
import { useProfileStore } from "@/stores/profile-store";
import { useWorkoutStore } from "@/stores/workout-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { analyzeHealthReport } from "@/lib/health-analyzer";
import { mapHealthToPlan, applyPlanToProfile } from "@/lib/health-plan-mapper";
import { buildNutritionTargets, buildWeeklyPlan } from "@/lib/plan-builder";
import type { HealthReport } from "@/types/health";

export default function HealthUploadPage() {
  const router = useRouter();
  const [report, setReport] = useState<HealthReport | null>(null);
  const [phase, setPhase] = useState<"upload" | "review" | "analysis">("upload");

  const addReport = useHealthStore((s) => s.addReport);
  const setProfile = useProfileStore((s) => s.setProfile);
  const profile = useProfileStore((s) => s.profile);
  const setWeeklyPlan = useWorkoutStore((s) => s.setWeeklyPlan);
  const setTargets = useNutritionStore((s) => s.setTargets);

  const analysis = report ? analyzeHealthReport(report) : null;

  const apply = () => {
    if (!report || !analysis) return;
    addReport(report, analysis);
    const settings = mapHealthToPlan(analysis, report);
    if (profile) {
      const updated = applyPlanToProfile(
        { ...profile, ...report, waist: report.waist },
        settings
      );
      updated.onboardingComplete = true;
      setProfile({ ...updated, availableEquipment: profile.availableEquipment });
      setTargets(buildNutritionTargets(updated, settings.calorieAdjustment));
      setWeeklyPlan(buildWeeklyPlan(updated, analysis));
    }
    router.push("/health");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">อัปโหลดรายงานสุขภาพ</h1>

      {phase === "upload" && (
        <UploadDropzone
          onParsed={(r) => {
            setReport(r);
            setPhase("review");
          }}
        />
      )}

      {phase === "review" && report && (
        <>
          <ParsedDataReview report={report} onChange={setReport} />
          <Button className="w-full" onClick={() => setPhase("analysis")}>
            วิเคราะห์ผลตรวจ
          </Button>
        </>
      )}

      {phase === "analysis" && analysis && (
        <>
          <p className="text-sm">{analysis.summary}</p>
          <FindingCards findings={analysis.findings} />
          <Button className="w-full" onClick={apply}>
            บันทึกและปรับแผน
          </Button>
        </>
      )}
    </div>
  );
}
