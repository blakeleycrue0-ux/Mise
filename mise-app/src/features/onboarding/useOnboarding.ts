/**
 * Orchestrates the onboarding flow: reads/writes the draft, validates the
 * current step, and finalizes into a saved profile.
 */
import { useCallback } from 'react';
import { useOnboardingStore, type OnboardingDraft } from '@state/onboardingStore';
import { useUserStore } from '@state/userStore';
import { STEPS, TOTAL_STEPS, type Step } from './steps';
import { generateAndSaveProfile } from './generateProfile';
import type { Goal, OnboardingInput } from '@types';

function isAnswered(step: Step, draft: OnboardingDraft): boolean {
  const v = draft[step.field];
  if (!step.required) return true;
  if (step.kind === 'multi') return Array.isArray(v) && v.length > 0;
  if (step.kind === 'number') return typeof v === 'number' && !Number.isNaN(v);
  return v !== undefined && v !== null;
}

export function useOnboarding() {
  const { stepIndex, draft, next, back, patch, setStep, reset } = useOnboardingStore();
  const setProfile = useUserStore((s) => s.setProfile);
  const userId = useUserStore((s) => s.userId);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === TOTAL_STEPS - 1;
  const canAdvance = isAnswered(step, draft);
  const progress = (stepIndex + 1) / TOTAL_STEPS;

  const setSingle = useCallback(
    (value: string) => {
      // Numeric fields stored as numbers even when chosen from options.
      const numeric = step.kind === 'number' || step.field === 'cookingTimePerDayMin';
      patch({ [step.field]: numeric ? Number(value) : value } as OnboardingDraft);
    },
    [patch, step],
  );

  const toggleMulti = useCallback(
    (value: string) => {
      const current = (draft[step.field] as string[] | undefined) ?? [];
      const nextVals = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];
      patch({ [step.field]: nextVals } as OnboardingDraft);
    },
    [draft, patch, step.field],
  );

  /** Builds the final input, deriving `goals` from the chosen primary goal. */
  const finalize = useCallback(async () => {
    const primary = draft.primaryGoal as Goal;
    const input: OnboardingInput = {
      age: draft.age!,
      gender: draft.gender!,
      heightCm: draft.heightCm!,
      weightKg: draft.weightKg!,
      activityLevel: draft.activityLevel!,
      dietaryPreferences: draft.dietaryPreferences ?? [],
      allergies: draft.allergies ?? [],
      cookingSkillLevel: draft.cookingSkillLevel!,
      goals: draft.goals?.length ? draft.goals : [primary],
      primaryGoal: primary,
      cookingTimePerDayMin: draft.cookingTimePerDayMin ?? 30,
      budgetRange: draft.budgetRange ?? 'moderate',
      kitchenEquipment: draft.kitchenEquipment ?? [],
    };
    const profile = await generateAndSaveProfile(userId ?? 'local-dev-user', input);
    setProfile(profile);
    return profile;
  }, [draft, setProfile, userId]);

  return {
    step,
    stepIndex,
    isLast,
    canAdvance,
    progress,
    draft,
    next,
    back,
    setStep,
    reset,
    setSingle,
    toggleMulti,
    finalize,
  };
}
