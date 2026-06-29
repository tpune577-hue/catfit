"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileStore } from "@/stores/profile-store";
import { useHealthStore } from "@/stores/health-store";
import { useWorkoutStore } from "@/stores/workout-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { useBodyMetricsStore } from "@/stores/body-metrics-store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const clearProfile = useProfileStore((s) => s.clearProfile);

  const resetAll = () => {
    if (!confirm("ลบข้อมูลทั้งหมดและเริ่มใหม่?")) return;
    clearProfile();
    useHealthStore.setState({ reports: [], latestAnalysis: null });
    useWorkoutStore.setState({ weeklyPlan: null, sessions: [] });
    useNutritionStore.setState({ meals: [], targets: null, calorieAdjustment: 0 });
    useBodyMetricsStore.setState({ metrics: [] });
    localStorage.clear();
    router.push("/onboarding");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">ตั้งค่า</h1>

      {profile && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">โปรไฟล์</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>เป้าหมาย: {profile.goal === "lose_fat" ? "ลดไขมัน" : profile.goal === "gain_muscle" ? "เพิ่มกล้าม" : "รักษา"}</p>
            <p>ระดับ: {profile.experience}</p>
            <p>ออกกำลังกาย: {profile.daysPerWeek} วัน/สัปดาห์</p>
            <p>อุปกรณ์: {profile.availableEquipment.join(", ")}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">PWA</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>ติดตั้งแอป: กด Share → Add to Home Screen บน iOS หรือ Install บน Android</p>
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full" onClick={resetAll}>
        รีเซ็ตข้อมูลทั้งหมด
      </Button>
    </div>
  );
}
