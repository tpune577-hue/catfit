"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HealthReport, HealthAnalysis } from "@/types/health";

interface HealthState {
  reports: HealthReport[];
  latestAnalysis: HealthAnalysis | null;
  addReport: (report: HealthReport, analysis: HealthAnalysis) => void;
  setLatestAnalysis: (analysis: HealthAnalysis | null) => void;
  getLatestReport: () => HealthReport | null;
  removeReport: (id: string) => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      reports: [],
      latestAnalysis: null,
      addReport: (report, analysis) =>
        set((s) => ({
          reports: [report, ...s.reports.filter((r) => r.id !== report.id)],
          latestAnalysis: analysis,
        })),
      setLatestAnalysis: (analysis) => set({ latestAnalysis: analysis }),
      getLatestReport: () => get().reports[0] ?? null,
      removeReport: (id) =>
        set((s) => ({
          reports: s.reports.filter((r) => r.id !== id),
        })),
    }),
    { name: "fitness-health" }
  )
);
