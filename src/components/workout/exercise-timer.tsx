"use client";

import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Auto-starting stopwatch that tracks how long the current exercise has been
 * worked on. Mount it with `key={resetKey}` so a new exercise/set remounts
 * (and thus resets) the timer instead of reusing state across it.
 */
export function ExerciseTimer() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
    const t = setInterval(() => {
      const start = startRef.current;
      if (start !== null) {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-4 py-2">
      <Timer className="h-4 w-4 text-muted-foreground" />
      <span className="text-lg font-semibold tabular-nums">
        {formatTime(elapsed)}
      </span>
      <span className="text-xs text-muted-foreground">เวลาที่ใช้ท่านี้</span>
    </div>
  );
}
