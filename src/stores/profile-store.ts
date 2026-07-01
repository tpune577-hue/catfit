"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/types/profile";

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  clearProfile: () => void;
}

const defaultProfile: Profile = {
  gender: "male",
  age: 30,
  weight: 70,
  height: 170,
  goal: "maintain",
  experience: "beginner",
  daysPerWeek: 4,
  workoutDays: [0, 1, 2, 3],
  availableEquipment: ["body weight"],
  focusAreas: ["waist", "cardio"],
  healthFocusAreas: [],
  dietaryRestrictions: [],
  familyDiabetesHistory: false,
  sedentary: false,
  onboardingComplete: false,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (partial) =>
        set((s) => ({
          profile: { ...(s.profile ?? defaultProfile), ...partial },
        })),
      clearProfile: () => set({ profile: null }),
    }),
    { name: "fitness-profile" }
  )
);
