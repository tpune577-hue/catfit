"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RestTimer } from "@/components/workout/rest-timer";
import { ExerciseGuide } from "@/components/workout/exercise-guide";
import { useWorkoutStore } from "@/stores/workout-store";
import { useProfileStore } from "@/stores/profile-store";
import { findAlternativeExercise } from "@/lib/exercise-filter";
import { translateEquipment } from "@/lib/exercise-i18n";

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dayId = searchParams.get("day");
  const weeklyPlan = useWorkoutStore((s) => s.weeklyPlan);
  const swapExercise = useWorkoutStore((s) => s.swapExercise);
  const addSession = useWorkoutStore((s) => s.addSession);
  const completeSession = useWorkoutStore((s) => s.completeSession);
  const profile = useProfileStore((s) => s.profile);

  const day = weeklyPlan?.days.find((d) => d.id === dayId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [showRest, setShowRest] = useState(false);
  const [swapMessage, setSwapMessage] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  const current = day?.exercises[currentIndex];
  const exerciseId = current?.exercise.id ?? "";
  const setsDone = completedSets[exerciseId] ?? 0;
  const totalSets = current?.sets ?? 0;

  const completeSet = useCallback(() => {
    if (!current) return;
    const newCount = setsDone + 1;
    setCompletedSets((prev) => ({ ...prev, [exerciseId]: newCount }));
    if (newCount < totalSets) {
      setShowRest(true);
    } else if (day && currentIndex < day.exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowRest(false);
      setSwapMessage(null);
    }
  }, [current, setsDone, totalSets, exerciseId, day, currentIndex]);

  const handleSwap = () => {
    if (!current || !day || !dayId) return;
    const excludeIds = day.exercises.map((e) => e.exercise.id);
    const alternative = findAlternativeExercise({
      current: current.exercise,
      equipment: profile?.availableEquipment ?? ["body weight"],
      excludeIds,
    });

    if (!alternative) {
      setSwapMessage("ไม่พบท่าทดแทน — ลองเพิ่มอุปกรณ์ในการตั้งค่า");
      return;
    }

    swapExercise(dayId, currentIndex, alternative);
    setCompletedSets((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
    setShowRest(false);
    setSwapMessage(
      `เปลี่ยนเป็น ${alternative.name} (${translateEquipment(alternative.equipment)})`
    );
  };

  const finish = () => {
    addSession({
      id: sessionId,
      dayId: dayId!,
      startedAt: new Date().toISOString(),
      completedExercises: Object.keys(completedSets),
    });
    completeSession(sessionId);
    router.push("/workout");
  };

  if (!day || !current) {
    return <p className="py-12 text-center">ไม่พบ session</p>;
  }

  const allDone =
    currentIndex === day.exercises.length - 1 && setsDone >= totalSets;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          ท่า {currentIndex + 1}/{day.exercises.length}
        </span>
      </div>

      <Progress
        value={
          ((currentIndex + setsDone / totalSets) / day.exercises.length) * 100
        }
        className="h-2"
      />

      <h2 className="text-xl font-semibold">{current.exercise.name}</h2>

      <div className="relative mx-auto aspect-square max-w-xs overflow-hidden rounded-2xl bg-muted">
        <Image
          src={current.exercise.gifUrl}
          alt={current.exercise.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <ExerciseGuide exercise={current.exercise} />

      {swapMessage && (
        <p className="rounded-xl bg-primary/10 px-4 py-2 text-sm text-primary">
          {swapMessage}
        </p>
      )}

      <div className="text-center">
        <p className="text-3xl font-bold tabular-nums">
          {setsDone}/{totalSets}
        </p>
        <p className="text-sm text-muted-foreground">
          เซ็ต · {current.reps} ครั้ง
        </p>
      </div>

      <Button
        variant="outline"
        className="h-11 w-full gap-2 text-base"
        onClick={handleSwap}
      >
        <RefreshCw className="h-4 w-4" />
        เปลี่ยนท่า (เล่นไม่ไหว / ไม่มีอุปกรณ์)
      </Button>

      {showRest ? (
        <RestTimer
          seconds={current.restSeconds}
          onComplete={() => setShowRest(false)}
        />
      ) : allDone ? (
        <Button className="h-12 w-full text-base" size="lg" onClick={finish}>
          <Check className="mr-2 h-4 w-4" />
          เสร็จสิ้น Session
        </Button>
      ) : (
        <Button className="h-12 w-full text-base" size="lg" onClick={completeSet}>
          เสร็จเซ็ต {setsDone + 1}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default function WorkoutSessionPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center">กำลังโหลด...</p>}>
      <SessionContent />
    </Suspense>
  );
}
