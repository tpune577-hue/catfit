"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BodyMetric } from "@/lib/plan-adjuster";

interface BodyMetricsState {
  metrics: BodyMetric[];
  addMetric: (metric: BodyMetric) => void;
  getLatest: () => BodyMetric | null;
}

export const useBodyMetricsStore = create<BodyMetricsState>()(
  persist(
    (set, get) => ({
      metrics: [],
      addMetric: (metric) =>
        set((s) => ({
          metrics: [
            metric,
            ...s.metrics.filter((m) => m.date !== metric.date),
          ],
        })),
      getLatest: () => get().metrics[0] ?? null,
    }),
    { name: "fitness-body-metrics" }
  )
);
