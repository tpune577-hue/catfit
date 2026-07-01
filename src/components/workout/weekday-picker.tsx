"use client";

import { WEEKDAY_LABELS_SHORT } from "@/lib/weekdays";
import { cn } from "@/lib/utils";

interface WeekdayPickerProps {
  value: number[];
  onChange: (days: number[]) => void;
  min?: number;
  max?: number;
}

export function WeekdayPicker({ value, onChange, min = 1, max = 7 }: WeekdayPickerProps) {
  const toggle = (day: number) => {
    const isSelected = value.includes(day);
    if (isSelected) {
      if (value.length <= min) return;
      onChange(value.filter((d) => d !== day).sort((a, b) => a - b));
    } else {
      if (value.length >= max) return;
      onChange([...value, day].sort((a, b) => a - b));
    }
  };

  return (
    <div className="flex justify-between gap-1.5">
      {WEEKDAY_LABELS_SHORT.map((label, day) => {
        const active = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            aria-pressed={active}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
