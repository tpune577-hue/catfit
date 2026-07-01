"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/components/health/upload-dropzone";
import { ParsedDataReview } from "@/components/health/parsed-data-review";
import { FindingCards } from "@/components/health/finding-badge";
import { useProfileStore } from "@/stores/profile-store";
import { useHealthStore } from "@/stores/health-store";
import { useWorkoutStore } from "@/stores/workout-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { analyzeHealthReport } from "@/lib/health-analyzer";
import { mapHealthToPlan, applyPlanToProfile } from "@/lib/health-plan-mapper";
import { buildNutritionTargets, buildWeeklyPlan } from "@/lib/plan-builder";
import { DEFAULT_EQUIPMENT, FOCUS_AREA_OPTIONS } from "@/types/profile";
import type { HealthReport } from "@/types/health";
import { createHealthReportFromParsed } from "@/lib/health-pdf-parser";
import { WeekdayPicker } from "@/components/workout/weekday-picker";
import { defaultWorkoutDays } from "@/lib/weekdays";

const STEPS = [
  "อัปโหลดรายงาน",
  "ตรวจสอบข้อมูล",
  "เป้าหมาย",
  "อุปกรณ์",
  "ตาราง",
  "สรุป",
];

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useProfileStore((s) => s.setProfile);
  const addReport = useHealthStore((s) => s.addReport);
  const setWeeklyPlan = useWorkoutStore((s) => s.setWeeklyPlan);
  const setTargets = useNutritionStore((s) => s.setTargets);

  const [step, setStep] = useState(0);
  const [report, setReport] = useState<HealthReport | null>(null);
  const [equipment, setEquipment] = useState<string[]>(["body weight"]);
  const [workoutDays, setWorkoutDays] = useState<number[]>(defaultWorkoutDays(4));
  const [skipUpload, setSkipUpload] = useState(false);
  const daysPerWeek = workoutDays.length;

  const analysis = report ? analyzeHealthReport(report) : null;
  const planSettings = analysis && report
    ? mapHealthToPlan(analysis, report)
    : null;

  const finish = () => {
    const defaultSettings = {
      goal: "maintain" as const,
      experience: "beginner" as const,
      daysPerWeek: 4,
      focusAreas: ["waist", "cardio"],
      dietaryRestrictions: [] as string[],
      sedentary: false,
      familyDiabetesHistory: false,
      calorieAdjustment: 0,
      cardioMinutes: 20,
    };

    const base = report && planSettings
      ? applyPlanToProfile(
          {
            name: report.name,
            gender: report.gender ?? "male",
            age: report.age ?? 30,
            weight: report.weight ?? 70,
            height: report.height ?? 170,
            waist: report.waist,
            familyDiabetesHistory: report.familyDiabetesHistory ?? false,
            sedentary: report.sedentary ?? false,
          },
          planSettings
        )
      : {
          gender: "male" as const,
          age: 30,
          weight: 70,
          height: 170,
          goal: "maintain" as const,
          experience: "beginner" as const,
          daysPerWeek: 4,
          availableEquipment: ["body weight"],
          focusAreas: ["waist", "cardio"],
          healthFocusAreas: [],
          dietaryRestrictions: [],
          familyDiabetesHistory: false,
          sedentary: false,
          onboardingComplete: false,
        };

    const profile = {
      ...base,
      availableEquipment: equipment,
      daysPerWeek,
      workoutDays,
      onboardingComplete: true,
    };

    setProfile(profile);
    if (report && analysis) addReport(report, analysis);
    const settings = planSettings ?? defaultSettings;
    setTargets(buildNutritionTargets(profile, settings.calorieAdjustment));
    setWeeklyPlan(buildWeeklyPlan(profile, analysis));
    router.push("/");
  };

  return (
    <div className="space-y-4 pb-8">
      <div>
        <p className="text-xs text-muted-foreground">
          ขั้นตอน {step + 1}/{STEPS.length}: {STEPS[step]}
        </p>
        <div className="mt-2 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">อัปโหลดรายงานสุขภาพ</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadDropzone
                onParsed={(r) => {
                  setReport(r);
                  setStep(1);
                }}
              />
            </CardContent>
          </Card>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSkipUpload(true);
              setReport(createHealthReportFromParsed({ source: "manual" }));
              setStep(2);
            }}
          >
            ข้าม — กรอกข้อมูลเอง
          </Button>
        </div>
      )}

      {step === 1 && report && (
        <div className="space-y-4">
          <ParsedDataReview report={report} onChange={setReport} />
          <Button className="w-full" onClick={() => setStep(2)}>
            ยืนยันข้อมูล
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {analysis && (
            <>
              <p className="text-sm">{analysis.summary}</p>
              <FindingCards findings={analysis.findings} />
              {planSettings && (
                <Card>
                  <CardContent className="space-y-1 p-4 text-sm">
                    <p>เป้าหมาย: {planSettings.goal === "lose_fat" ? "ลดไขมัน" : planSettings.goal === "gain_muscle" ? "เพิ่มกล้าม" : "รักษาร่างกาย"}</p>
                    <p>ระดับ: {planSettings.experience === "beginner" ? "เริ่มต้น" : planSettings.experience}</p>
                    <p>Focus: {planSettings.focusAreas.join(", ")}</p>
                    {planSettings.targetWeight && (
                      <p>น้ำหนักเป้าหมาย: {planSettings.targetWeight} kg</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
          {!analysis && (
            <p className="text-sm text-muted-foreground">
              ตั้งค่าเป้าหมายในขั้นตอนถัดไป
            </p>
          )}
          <Button className="w-full" onClick={() => setStep(3)}>
            ถัดไป
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">เลือกอุปกรณ์ที่มี</p>
          {DEFAULT_EQUIPMENT.map((eq) => (
            <div key={eq} className="flex items-center gap-2">
              <Checkbox
                id={eq}
                checked={equipment.includes(eq)}
                onCheckedChange={(checked) => {
                  setEquipment((prev) =>
                    checked
                      ? [...prev, eq]
                      : prev.filter((e) => e !== eq)
                  );
                }}
              />
              <Label htmlFor={eq} className="capitalize text-sm">
                {eq}
              </Label>
            </div>
          ))}
          <Button className="w-full" onClick={() => setStep(4)}>
            ถัดไป
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <Label>วันที่สะดวกออกกำลังกาย</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              เลือกได้ 3-6 วัน/สัปดาห์ (เลือกแล้ว {daysPerWeek} วัน)
            </p>
          </div>
          <WeekdayPicker value={workoutDays} onChange={setWorkoutDays} min={3} max={6} />
          <div className="flex flex-wrap gap-2">
            {FOCUS_AREA_OPTIONS.map((f) => (
              <span
                key={f.id}
                className="rounded-full bg-muted px-3 py-1 text-xs capitalize"
              >
                {f.label}
              </span>
            ))}
          </div>
          <Button className="w-full" onClick={() => setStep(5)}>
            ถัดไป
          </Button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">พร้อมเริ่มต้น!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ แผนออกกำลังกาย {daysPerWeek} วัน/สัปดาห์</p>
              <p>✓ เป้าแคลอรี่และ macros คำนวณแล้ว</p>
              {!skipUpload && report && <p>✓ ข้อมูลสุขภาพบันทึกแล้ว</p>}
            </CardContent>
          </Card>
          <Button className="w-full" size="lg" onClick={finish}>
            เริ่มใช้งาน FitTrack
          </Button>
        </div>
      )}
    </div>
  );
}
