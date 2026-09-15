"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RepCounter({
  reps,
  targetLabel,
  onChange,
}: {
  reps: number;
  targetLabel: string;
  onChange: (reps: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card px-4 py-3">
      <div>
        <p className="text-xs text-muted-foreground">นับ Rep · เป้าหมาย {targetLabel}</p>
        <p className="text-3xl font-bold tabular-nums">{reps}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full"
          onClick={() => onChange(Math.max(0, reps - 1))}
          aria-label="ลด rep"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          className="h-11 w-11 rounded-full"
          onClick={() => onChange(reps + 1)}
          aria-label="เพิ่ม rep"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
