"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/profile-store";
import { useHealthStore } from "@/stores/health-store";
import { useWorkoutStore } from "@/stores/workout-store";
import { useNutritionStore } from "@/stores/nutrition-store";
import { useBodyMetricsStore } from "@/stores/body-metrics-store";

const persistedStores = [
  useProfileStore,
  useHealthStore,
  useWorkoutStore,
  useNutritionStore,
  useBodyMetricsStore,
] as const;

function allStoresHydrated() {
  if (typeof window === "undefined") return false;
  return persistedStores.every((store) => store.persist.hasHydrated());
}

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (allStoresHydrated()) {
      setHydrated(true);
      return;
    }

    const unsubscribers = persistedStores.map((store) =>
      store.persist.onFinishHydration(() => {
        if (allStoresHydrated()) setHydrated(true);
      })
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  return hydrated;
}

export function StoreHydrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useStoreHydration();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-base text-muted-foreground">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return <>{children}</>;
}
