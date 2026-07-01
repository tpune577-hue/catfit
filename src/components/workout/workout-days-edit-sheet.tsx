"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WeekdayPicker } from "@/components/workout/weekday-picker";
import { useProfileStore } from "@/stores/profile-store";
import { useUpdateWorkoutDays } from "@/hooks/use-update-workout-days";

export function WorkoutDaysEditSheet() {
  const profile = useProfileStore((s) => s.profile);
  const updateWorkoutDays = useUpdateWorkoutDays();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number[]>(profile?.workoutDays ?? []);

  if (!profile) return null;

  const handleSave = () => {
    updateWorkoutDays(draft);
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setDraft(profile.workoutDays);
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 shrink-0 text-muted-foreground"
          aria-label="แก้ไขวันออกกำลังกาย"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>วันออกกำลังกาย</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 p-4 pt-0">
          <p className="text-sm text-muted-foreground">
            เลือกวันที่สะดวก ({draft.length} วัน/สัปดาห์)
          </p>
          <WeekdayPicker value={draft} onChange={setDraft} min={1} max={7} />
          <Button className="h-11 w-full text-base" onClick={handleSave}>
            บันทึก
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
