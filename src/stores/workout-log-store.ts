"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkoutResultLog } from "@/types/workout-log";

interface WorkoutLogState {
  logs: WorkoutResultLog[];
  addLog: (log: WorkoutResultLog) => void;
  updateLog: (id: string, patch: Partial<WorkoutResultLog>) => void;
  removeLog: (id: string) => void;
}

export const useWorkoutLogStore = create<WorkoutLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => set((s) => ({ logs: [log, ...s.logs] })),
      updateLog: (id, patch) =>
        set((s) => ({
          logs: s.logs.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      removeLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),
    }),
    { name: "fitness-workout-logs" }
  )
);
