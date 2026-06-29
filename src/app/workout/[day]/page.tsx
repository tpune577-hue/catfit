"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExerciseGuide } from "@/components/workout/exercise-guide";
import { useWorkoutStore } from "@/stores/workout-store";
import { useProfileStore } from "@/stores/profile-store";
import { findAlternativeExercise } from "@/lib/exercise-filter";
import { translateEquipment } from "@/lib/exercise-i18n";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function WorkoutDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayId } = use(params);
  const weeklyPlan = useWorkoutStore((s) => s.weeklyPlan);
  const swapExercise = useWorkoutStore((s) => s.swapExercise);
  const profile = useProfileStore((s) => s.profile);
  const [swapMsg, setSwapMsg] = useState<string | null>(null);

  const day = weeklyPlan?.days.find((d) => d.id === dayId);

  const handleSwap = (index: number) => {
    if (!day) return;
    const current = day.exercises[index];
    const alternative = findAlternativeExercise({
      current: current.exercise,
      equipment: profile?.availableEquipment ?? ["body weight"],
      excludeIds: day.exercises.map((e) => e.exercise.id),
    });
    if (!alternative) {
      setSwapMsg("ไม่พบท่าทดแทน");
      return;
    }
    swapExercise(dayId, index, alternative);
    setSwapMsg(`ท่าที่ ${index + 1}: เปลี่ยนเป็น ${alternative.name}`);
    setTimeout(() => setSwapMsg(null), 3000);
  };

  if (!day) {
    return (
      <div className="py-12 text-center">
        <p>ไม่พบแผนวันนี้</p>
        <Link href="/workout">
          <Button variant="link">กลับ</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/workout">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          กลับ
        </Button>
      </Link>

      <h1 className="text-xl font-bold">{day.name}</h1>

      {swapMsg && (
        <p className="rounded-xl bg-primary/10 px-4 py-2 text-sm text-primary">
          {swapMsg}
        </p>
      )}

      {day.cardioBlock && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="font-medium">คาร์ดิโอ</p>
          <p className="text-sm text-muted-foreground">{day.cardioBlock.label}</p>
        </div>
      )}

      <div className="space-y-3">
        {day.exercises.map((we, i) => (
          <div
            key={`${we.exercise.id}-${i}`}
            className="rounded-2xl border border-border/80 bg-card p-3"
          >
            <div className="flex gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={we.exercise.imageUrl}
                  alt={we.exercise.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">ท่าที่ {i + 1}</p>
                <p className="font-semibold">{we.exercise.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {we.sets} เซ็ต × {we.reps}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {translateEquipment(we.exercise.equipment)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    ดูวิธีทำ
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{we.exercise.name}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <ExerciseGuide exercise={we.exercise} />
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => handleSwap(i)}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                เปลี่ยนท่า
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Link href={`/workout/session?day=${day.id}`}>
        <Button className="h-12 w-full text-base" size="lg">
          <Play className="mr-2 h-4 w-4" />
          เริ่ม Session
        </Button>
      </Link>
    </div>
  );
}
