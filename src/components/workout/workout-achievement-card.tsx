"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import { useWorkoutStore } from "@/stores/workout-store";
import { format, isSameDay, parseISO } from "date-fns";
import { useMemo } from "react";

const ACHIEVEMENT_CATS = [
  { src: "/cats/achievement/cat-orange.png",  alt: "แมวส้มมีกล้าม" },
  { src: "/cats/achievement/cat-bw.png",      alt: "แมวขาวดำมีกล้าม" },
  { src: "/cats/achievement/cat-siamese.png", alt: "แมววิเชียรมาศมีกล้าม" },
  { src: "/cats/achievement/cat-grey.png",    alt: "แมวเทามีกล้าม" },
];

const SPARKLE_POSITIONS = [
  { left: "18%",  delay: "0s",    size: "1.1rem" },
  { left: "35%",  delay: "0.4s",  size: "0.85rem" },
  { left: "55%",  delay: "0.15s", size: "1rem" },
  { left: "72%",  delay: "0.6s",  size: "0.9rem" },
  { left: "85%",  delay: "0.3s",  size: "1.15rem" },
];

interface WorkoutAchievementCardProps {
  /** dayId of today's workout */
  todayDayId: string;
  todayWorkoutName: string;
  streak: number;
}

export function WorkoutAchievementCard({
  todayDayId,
  todayWorkoutName,
  streak,
}: WorkoutAchievementCardProps) {
  const sessions = useWorkoutStore((s) => s.sessions);

  const todayDateStr = format(new Date(), "yyyy-MM-dd");

  const isCompletedToday = useMemo(
    () =>
      sessions.some(
        (s) =>
          s.dayId === todayDayId &&
          s.completedAt &&
          isSameDay(parseISO(s.completedAt), new Date())
      ),
    [sessions, todayDayId]
  );

  if (!isCompletedToday) return null;

  /* stable cat per calendar day */
  const dayNum = Number(todayDateStr.replace(/-/g, ""));
  const cat = ACHIEVEMENT_CATS[dayNum % ACHIEVEMENT_CATS.length];

  return (
    <div className="animate-achievement-pop overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-50 to-orange-50 shadow-lg dark:from-amber-950/40 dark:to-orange-950/40">
      {/* sparkles row */}
      <div className="relative h-6 overflow-hidden">
        {SPARKLE_POSITIONS.map((sp, i) => (
          <span
            key={i}
            className="animate-sparkle absolute bottom-0 select-none"
            style={{
              left: sp.left,
              animationDelay: sp.delay,
              animationDuration: `${1.4 + i * 0.25}s`,
              fontSize: sp.size,
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* title bar */}
      <div className="flex items-center justify-center gap-2 px-4 pb-1">
        <Trophy className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
          วันนี้คุณออกกำลังกายสำเร็จแล้ว!
        </p>
        <Trophy className="h-4 w-4 text-amber-500" />
      </div>

      {/* cat image */}
      <div className="relative mx-auto h-52 w-full max-w-sm">
        <Image
          src={cat.src}
          alt={cat.alt}
          fill
          className="animate-cat-flex object-cover object-center"
          unoptimized
          priority
        />
      </div>

      {/* info footer */}
      <div className="flex items-center justify-between gap-3 bg-white/60 px-4 py-3 dark:bg-black/20">
        <div>
          <p className="text-sm font-bold text-foreground">{todayWorkoutName}</p>
          <p className="text-xs text-muted-foreground">เสร็จสิ้นแล้ววันนี้ 🎉</p>
        </div>
        {streak > 0 && (
          <div className="flex flex-col items-center rounded-xl bg-amber-100 px-3 py-1.5 dark:bg-amber-900/40">
            <span className="text-lg font-black leading-none text-amber-600 dark:text-amber-400">
              {streak}
            </span>
            <span className="text-[10px] font-semibold text-amber-600/80 dark:text-amber-400/80">
              วันติดกัน 🔥
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Returns true if today's workout day has a completed session today */
export function useTodayWorkoutDone(todayDayId: string | undefined): boolean {
  const sessions = useWorkoutStore((s) => s.sessions);
  return useMemo(() => {
    if (!todayDayId) return false;
    return sessions.some(
      (s) =>
        s.dayId === todayDayId &&
        s.completedAt &&
        isSameDay(parseISO(s.completedAt), new Date())
    );
  }, [sessions, todayDayId]);
}
