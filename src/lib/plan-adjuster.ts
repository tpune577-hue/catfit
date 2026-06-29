import type { Goal } from "@/types/profile";

export interface BodyMetric {
  date: string;
  weight?: number;
  waist?: number;
  chest?: number;
  hips?: number;
}

export interface PlanAdjustment {
  type: "keep" | "reduce_deficit" | "increase_deficit" | "reduce_surplus" | "add_cardio" | "change_split";
  message: string;
  calorieDelta: number;
  cardioDelta: number;
}

export function analyzeProgress(
  metrics: BodyMetric[],
  goal: Goal
): PlanAdjustment {
  if (metrics.length < 2) {
    return {
      type: "keep",
      message: "บันทึกข้อมูลเพิ่มเติมเพื่อให้ระบบวิเคราะห์แนวโน้มได้",
      calorieDelta: 0,
      cardioDelta: 0,
    };
  }

  const sorted = [...metrics]
    .filter((m) => m.weight !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length < 2) {
    return {
      type: "keep",
      message: "บันทึกน้ำหนักเพิ่มเติมเพื่อติดตามความคืบหน้า",
      calorieDelta: 0,
      cardioDelta: 0,
    };
  }

  const recent = sorted.slice(-4);
  const first = recent[0].weight!;
  const last = recent[recent.length - 1].weight!;
  const weeks = Math.max(
    1,
    (new Date(recent[recent.length - 1].date).getTime() -
      new Date(recent[0].date).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );
  const weeklyChange = (last - first) / weeks;

  if (goal === "lose_fat") {
    if (weeklyChange < -1) {
      return {
        type: "reduce_deficit",
        message: `น้ำหนักลดเร็วเกินไป (${weeklyChange.toFixed(1)} kg/สัปดาห์) — ลด deficit 150 kcal`,
        calorieDelta: 150,
        cardioDelta: 0,
      };
    }
    if (weeklyChange > -0.1 && weeks >= 2) {
      return {
        type: "increase_deficit",
        message: "น้ำหนักยังไม่ลด — เพิ่มคาร์ดิโอ 10 นาที/วัน",
        calorieDelta: 0,
        cardioDelta: 10,
      };
    }
    if (weeklyChange >= -0.7 && weeklyChange <= -0.2) {
      return {
        type: "keep",
        message: `น้ำหนักลด ${Math.abs(weeklyChange).toFixed(1)} kg/สัปดาห์ — อยู่ในเกณฑ์ดี คงแผนเดิม`,
        calorieDelta: 0,
        cardioDelta: 0,
      };
    }
  }

  if (goal === "gain_muscle" && weeklyChange > 0.5) {
    return {
      type: "reduce_surplus",
      message: "น้ำหนักขึ้นเร็วเกินไป — ลด surplus 150 kcal",
      calorieDelta: -150,
      cardioDelta: 0,
    };
  }

  if (weeks >= 4 && Math.abs(weeklyChange) < 0.1) {
    return {
      type: "change_split",
      message: "น้ำหนักคงที่ 4 สัปดาห์ — ลองเปลี่ยนโปรแกรมหรือเพิ่ม volume",
      calorieDelta: 0,
      cardioDelta: 5,
    };
  }

  return {
    type: "keep",
    message: "ดำเนินการตามแผนปัจจุบัน",
    calorieDelta: 0,
    cardioDelta: 0,
  };
}

export function analyzeWaistProgress(
  metrics: BodyMetric[],
  baselineWaist?: number
): string | null {
  const withWaist = metrics.filter((m) => m.waist !== undefined);
  if (withWaist.length < 2) return null;

  const latest = withWaist[withWaist.length - 1].waist!;
  const first = withWaist[0].waist!;
  const change = latest - first;

  if (baselineWaist && latest < baselineWaist) {
    return `รอบเอวลดจาก ${baselineWaist} → ${latest} cm — ดีมาก!`;
  }
  if (change < -2) {
    return `รอบเอวลด ${Math.abs(change).toFixed(0)} cm — ความคืบหน้าดี`;
  }
  if (change > 1) {
    return "รอบเอวเพิ่มขึ้น — เน้นคาร์ดิโอและควบคุมอาหาร";
  }
  return null;
}
