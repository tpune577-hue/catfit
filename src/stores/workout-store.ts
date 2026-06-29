"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WeeklyPlan, WorkoutSession } from "@/types/workout";
import type { Exercise } from "@/types/exercise";

interface WorkoutState {
  weeklyPlan: WeeklyPlan | null;
  sessions: WorkoutSession[];
  setWeeklyPlan: (plan: WeeklyPlan) => void;
  swapExercise: (dayId: string, exerciseIndex: number, newExercise: Exercise) => void;
  addSession: (session: WorkoutSession) => void;
  completeSession: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      weeklyPlan: null,
      sessions: [],
      setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),
      swapExercise: (dayId, exerciseIndex, newExercise) =>
        set((s) => {
          if (!s.weeklyPlan) return s;
          const days = s.weeklyPlan.days.map((day) => {
            if (day.id !== dayId) return day;
            const exercises = day.exercises.map((we, i) =>
              i === exerciseIndex
                ? { ...we, exercise: newExercise }
                : we
            );
            return { ...day, exercises };
          });
          return { weeklyPlan: { ...s.weeklyPlan, days } };
        }),
      addSession: (session) =>
        set((s) => ({ sessions: [session, ...s.sessions] })),
      completeSession: (id) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id
              ? { ...sess, completedAt: new Date().toISOString() }
              : sess
          ),
        })),
    }),
    { name: "fitness-workout" }
  )
);
