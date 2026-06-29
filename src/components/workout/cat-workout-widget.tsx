"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useProfileStore } from "@/stores/profile-store";
import { useBodyMetricsStore } from "@/stores/body-metrics-store";

type CatStage = "muscular" | "normal" | "chubby" | "fat" | "obese";

interface StageConfig {
  image: string;
  label: string;
  badge: string;
  message: string;
  /** tailwind bg class for the badge */
  badgeColor: string;
  /** css value for --cat-anim-speed */
  speed: string;
  /** which animation to use */
  anim: "animate-cat-workout" | "animate-cat-wobble";
}

const STAGE_CONFIG: Record<CatStage, StageConfig> = {
  muscular: {
    image: "/cats/cat-normal.png",
    label: "แมวมีกล้าม 💪",
    badge: "มีกล้าม",
    message: "แข็งแกร่งสุดๆ! ลุยต่อเลย",
    badgeColor: "bg-emerald-500",
    speed: "1.1s",
    anim: "animate-cat-workout",
  },
  normal: {
    image: "/cats/cat-normal.png",
    label: "แมวสมส่วน 😄",
    badge: "สมส่วน",
    message: "สุขภาพดีเยี่ยม รักษาไว้นะ!",
    badgeColor: "bg-sky-500",
    speed: "1.4s",
    anim: "animate-cat-workout",
  },
  chubby: {
    image: "/cats/cat-chubby.png",
    label: "แมวอวบ 😅",
    badge: "อวบ",
    message: "กำลังพัฒนา อย่าหยุดนะ!",
    badgeColor: "bg-amber-500",
    speed: "1.7s",
    anim: "animate-cat-wobble",
  },
  fat: {
    image: "/cats/cat-fat.png",
    label: "แมวอ้วน 😤",
    badge: "อ้วน",
    message: "เริ่มต้นได้เลย ทำได้แน่!",
    badgeColor: "bg-orange-500",
    speed: "2.1s",
    anim: "animate-cat-wobble",
  },
  obese: {
    image: "/cats/cat-obese.png",
    label: "แมวอ้วนมาก 🍔",
    badge: "อ้วนมาก",
    message: "ก้าวแรกสำคัญที่สุด เริ่มเลย!",
    badgeColor: "bg-rose-500",
    speed: "2.5s",
    anim: "animate-cat-wobble",
  },
};

function getStage(bmi: number, goal: string): CatStage {
  if (bmi < 23 && goal === "gain_muscle") return "muscular";
  if (bmi < 23) return "normal";
  if (bmi < 26) return "chubby";
  if (bmi < 29) return "fat";
  return "obese";
}

export function CatWorkoutWidget() {
  const profile = useProfileStore((s) => s.profile);
  const getLatest = useBodyMetricsStore((s) => s.getLatest);

  const { bmi, stage, config } = useMemo(() => {
    if (!profile) return { bmi: null, stage: "normal" as CatStage, config: STAGE_CONFIG.normal };

    const latestMetric = getLatest();
    const weight = latestMetric?.weight ?? profile.weight;
    const heightM = profile.height / 100;
    const bmiVal = weight / (heightM * heightM);
    const s = getStage(bmiVal, profile.goal);
    return { bmi: bmiVal, stage: s, config: STAGE_CONFIG[s] };
  }, [profile, getLatest]);

  if (!profile) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {/* Cat scene */}
      <div className="relative h-44 w-full overflow-hidden bg-sky-100">
        <Image
          src={config.image}
          alt={config.label}
          fill
          className={`object-cover object-center ${config.anim}`}
          style={{ "--cat-anim-speed": config.speed } as React.CSSProperties}
          unoptimized
          priority
        />
        {/* stage badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow ${config.badgeColor}`}
        >
          {config.badge}
        </span>
        {/* BMI chip */}
        {bmi !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            BMI {bmi.toFixed(1)}
          </span>
        )}
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-foreground">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.message}</p>
        </div>
        <div className="text-right text-xs text-muted-foreground/70">
          <p>น้ำหนัก {profile.weight} kg</p>
          <p>ส่วนสูง {profile.height} cm</p>
        </div>
      </div>
    </div>
  );
}
