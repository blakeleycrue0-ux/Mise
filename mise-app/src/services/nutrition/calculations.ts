/**
 * Local, deterministic nutrition math. Kept out of the AI layer on purpose:
 * BMR/TDEE/macros are well-defined formulas and should never be hallucinated.
 * The AI layer only adds the *narrative* (summary, focus areas) on top of these.
 */

import type {
  ActivityLevel,
  Gender,
  Goal,
  MacroTargets,
  OnboardingInput,
} from '@types';

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** Mifflin-St Jeor BMR. */
export function calcBmr(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  // +5 for male, -161 for female; neutral midpoint for non-binary / unspecified.
  const sexOffset =
    gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return Math.round(base + sexOffset);
}

export function calcTdee(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activity]);
}

/**
 * Adjust calories for the primary goal, then split macros.
 * Deliberately gentle: this app prioritises cooking education over aggressive
 * deficits, so fat loss is a modest -15% rather than a crash deficit.
 */
export function calcMacroTargets(tdee: number, primaryGoal: Goal): MacroTargets {
  const calorieAdjust: Partial<Record<Goal, number>> = {
    fat_loss: -0.15,
    muscle_gain: 0.1,
  };
  const calories = Math.round(tdee * (1 + (calorieAdjust[primaryGoal] ?? 0)));

  // Protein leads (muscle goals push the share higher), fat ~27%, rest carbs.
  const proteinShare = primaryGoal === 'muscle_gain' ? 0.35 : 0.3;
  const proteinG = Math.round((calories * proteinShare) / 4);
  const fatG = Math.round((calories * 0.27) / 9);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));

  return { calories, proteinG, carbsG, fatG };
}

/** One-shot helper: onboarding inputs -> full numeric nutrition core. */
export function deriveNutritionCore(input: OnboardingInput): {
  bmr: number;
  tdee: number;
  targets: MacroTargets;
} {
  const bmr = calcBmr(input.gender, input.weightKg, input.heightCm, input.age);
  const tdee = calcTdee(bmr, input.activityLevel);
  const targets = calcMacroTargets(tdee, input.primaryGoal);
  return { bmr, tdee, targets };
}
