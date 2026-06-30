"use client";

import { Fragment, useMemo } from "react";
import { Flame } from "lucide-react";
import { startOfWeek, addDays, isSameDay, isAfter, parseISO, format } from "date-fns";
import { useWorkoutStore } from "@/stores/workout-store";
import { cn } from "@/lib/utils";

function CatPaw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      {/* main pad */}
      <ellipse cx="12" cy="16" rx="4" ry="3" />
      {/* toe pads */}
      <ellipse cx="6.5" cy="10.5" rx="1.8" ry="2.2" transform="rotate(-20 6.5 10.5)" />
      <ellipse cx="9.5" cy="8.5" rx="1.8" ry="2.2" transform="rotate(-8 9.5 8.5)" />
      <ellipse cx="14.5" cy="8.5" rx="1.8" ry="2.2" transform="rotate(8 14.5 8.5)" />
      <ellipse cx="17.5" cy="10.5" rx="1.8" ry="2.2" transform="rotate(20 17.5 10.5)" />
    </svg>
  );
}

const DAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

type DotState = "completed" | "today" | "skipped" | "upcoming" | "rest";

interface DayDot {
  dayIndex: number;
  state: DotState;
  hasWorkout: boolean;
}

export function DailyStreakDots() {
  const weeklyPlan = useWorkoutStore((s) => s.weeklyPlan);
  const sessions = useWorkoutStore((s) => s.sessions);

  const today = useMemo(() => new Date(), []);
  const weekStart = useMemo(() => startOfWeek(today, { weekStartsOn: 1 }), [today]);

  const dots: DayDot[] = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = addDays(weekStart, i);
      const planDay = weeklyPlan?.days.find((d) => d.dayIndex === i);

      if (!planDay) {
        return { dayIndex: i, state: "rest" as DotState, hasWorkout: false };
      }

      const isToday = isSameDay(dayDate, today);
      const isPast = !isSameDay(dayDate, today) && !isAfter(dayDate, today);
      const dayDateStr = format(dayDate, "yyyy-MM-dd");

      const completed = sessions.some((s) => {
        if (s.dayId !== planDay.id || !s.completedAt) return false;
        return format(parseISO(s.completedAt), "yyyy-MM-dd") === dayDateStr;
      });

      if (completed) return { dayIndex: i, state: "completed" as DotState, hasWorkout: true };
      if (isToday) return { dayIndex: i, state: "today" as DotState, hasWorkout: true };
      if (isPast) return { dayIndex: i, state: "skipped" as DotState, hasWorkout: true };
      return { dayIndex: i, state: "upcoming" as DotState, hasWorkout: true };
    });
  }, [weeklyPlan, sessions, weekStart, today]);

  const streak = useMemo(() => {
    const todayDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    let count = 0;

    // count today if completed
    if (dots[todayDayIndex]?.state === "completed") count = 1;

    // walk backwards from yesterday
    for (let i = todayDayIndex - 1; i >= 0; i--) {
      const s = dots[i].state;
      if (s === "rest") continue;
      if (s === "completed") count++;
      else break;
    }
    return count;
  }, [dots, today]);

  const completedCount = dots.filter((d) => d.state === "completed").length;
  const totalWorkoutDays = dots.filter((d) => d.hasWorkout).length;

  if (!weeklyPlan) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-card px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">สัปดาห์นี้</p>
          <p className="text-xs text-muted-foreground">
            {completedCount} / {totalWorkoutDays} วัน
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1">
            <Flame className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-bold text-primary">{streak}</span>
            <span className="text-xs text-primary/80">วันติดกัน</span>
          </div>
        )}
      </div>

      <div className="flex items-center">
        {dots.map((dot, i) => (
          <Fragment key={i}>
            <div className="flex flex-1 flex-col items-center gap-1">
              <DotIndicator state={dot.state} animDelay={i * 60} />
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  dot.state === "completed"
                    ? "text-primary"
                    : dot.state === "today"
                      ? "text-foreground font-bold"
                      : "text-muted-foreground/60"
                )}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
            {i < 6 && (
              <div className="relative h-0.5 w-3 shrink-0 overflow-hidden rounded-full bg-border">
                {dot.state === "completed" && (
                  <div
                    className="absolute inset-0 bg-red-500 animate-line-fill"
                    style={{ animationDelay: `${i * 60 + 45}ms` }}
                  />
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function DotIndicator({ state, animDelay }: { state: DotState; animDelay: number }) {
  if (state === "rest") {
    return (
      <div className="flex h-7 w-7 items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-border" />
      </div>
    );
  }

  if (state === "completed") {
    return (
      <div
        className="flex h-7 w-7 items-center justify-center animate-paw-stamp"
        style={{ animationDelay: `${animDelay}ms` }}
      >
        <CatPaw className="h-7 w-7 text-red-500" />
      </div>
    );
  }

  if (state === "today") {
    return (
      <div className="relative flex h-7 w-7 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-foreground/15 animate-ping opacity-40" />
        <CatPaw className="h-7 w-7 text-foreground" />
      </div>
    );
  }

  if (state === "skipped") {
    return (
      <div className="flex h-7 w-7 items-center justify-center">
        <CatPaw className="h-7 w-7 text-muted-foreground/35" />
      </div>
    );
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center">
      <CatPaw className="h-7 w-7 text-border" />
    </div>
  );
}
