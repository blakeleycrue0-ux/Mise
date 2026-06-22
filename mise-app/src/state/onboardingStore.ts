/**
 * Onboarding working state. Holds the partial answers as the user moves through
 * steps, plus the current step index. Kept separate from the persisted profile
 * so a user can abandon/restart without polluting their saved data.
 */
import { create } from 'zustand';
import type { OnboardingInput } from '@types';

export type OnboardingDraft = Partial<OnboardingInput>;

interface OnboardingState {
  stepIndex: number;
  draft: OnboardingDraft;
  setStep: (i: number) => void;
  next: () => void;
  back: () => void;
  patch: (p: OnboardingDraft) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  stepIndex: 0,
  draft: { dietaryPreferences: [], allergies: [], goals: [], kitchenEquipment: [] },
  setStep: (i) => set({ stepIndex: i }),
  next: () => set((s) => ({ stepIndex: s.stepIndex + 1 })),
  back: () => set((s) => ({ stepIndex: Math.max(0, s.stepIndex - 1) })),
  patch: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  reset: () =>
    set({
      stepIndex: 0,
      draft: { dietaryPreferences: [], allergies: [], goals: [], kitchenEquipment: [] },
    }),
}));
