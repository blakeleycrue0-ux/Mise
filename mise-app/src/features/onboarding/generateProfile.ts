/**
 * Turns completed onboarding answers into a saved, personalized UserProfile.
 *
 * Split of responsibility:
 *  1. Numeric core (BMR/TDEE/macros) is computed locally and deterministically.
 *  2. The narrative (summary, focus areas) is *enriched* by the AI layer when
 *     available, but a sensible local default is always produced so onboarding
 *     never blocks on the network.
 *  3. The result is persisted to Supabase (user_profiles + health_goals) when
 *     configured; otherwise it lives in local state for the dev experience.
 */
import type {
  CookingSkillLevel,
  NutritionProfile,
  OnboardingInput,
  UserProfile,
} from '@types';
import { deriveNutritionCore } from '@services/nutrition';
import { supabase } from '@services/supabase';
import { titleCase } from '@utils/format';

function localSummary(input: OnboardingInput, track: CookingSkillLevel): string {
  const goal = titleCase(input.primaryGoal).toLowerCase();
  const diet =
    input.dietaryPreferences.filter((d) => d !== 'omnivore').map(titleCase).join(', ') ||
    'no restrictions';
  return `A ${track} cooking track built around your goal to ${goal}, with ${input.cookingTimePerDayMin} minutes a day and ${diet}. We'll teach technique first and let the numbers follow.`;
}

function localFocusAreas(input: OnboardingInput): string[] {
  const areas: string[] = [];
  if (input.cookingSkillLevel === 'beginner') areas.push('Kitchen fundamentals & knife skills');
  if (input.primaryGoal === 'muscle_gain') areas.push('Hitting protein at every meal');
  if (input.primaryGoal === 'fat_loss') areas.push('Big-volume, lower-calorie cooking');
  if (input.primaryGoal === 'save_money') areas.push('Batch cooking & using up leftovers');
  if (input.budgetRange === 'tight') areas.push('Cheap, high-impact pantry staples');
  if (areas.length === 0) areas.push('Building a repertoire of reliable weeknight meals');
  return areas.slice(0, 4);
}

/** Picks the starting coach track — never start a true beginner too high. */
function startingTrack(skill: CookingSkillLevel): CookingSkillLevel {
  return skill;
}

export function buildNutritionProfile(input: OnboardingInput): NutritionProfile {
  const core = deriveNutritionCore(input);
  const track = startingTrack(input.cookingSkillLevel);
  return {
    bmr: core.bmr,
    tdee: core.tdee,
    targets: core.targets,
    summary: localSummary(input, track),
    focusAreas: localFocusAreas(input),
    startingSkillTrack: track,
  };
}

export async function generateAndSaveProfile(
  userId: string,
  input: OnboardingInput,
): Promise<UserProfile> {
  const nutrition = buildNutritionProfile(input);
  const now = new Date().toISOString();

  const profile: UserProfile = {
    ...input,
    id: `${userId}-profile`,
    userId,
    nutrition,
    createdAt: now,
    updatedAt: now,
  };

  // Persist when Supabase is configured. Local-only otherwise (dev).
  if (supabase) {
    await supabase.from('user_profiles').upsert({
      user_id: userId,
      age: input.age,
      gender: input.gender,
      height_cm: input.heightCm,
      weight_kg: input.weightKg,
      activity_level: input.activityLevel,
      dietary_preferences: input.dietaryPreferences,
      allergies: input.allergies,
      cooking_skill_level: input.cookingSkillLevel,
      cooking_time_per_day_min: input.cookingTimePerDayMin,
      budget_range: input.budgetRange,
      kitchen_equipment: input.kitchenEquipment,
      bmr: nutrition.bmr,
      tdee: nutrition.tdee,
      target_calories: nutrition.targets.calories,
      target_protein_g: nutrition.targets.proteinG,
      target_carbs_g: nutrition.targets.carbsG,
      target_fat_g: nutrition.targets.fatG,
      ai_summary: nutrition.summary,
    });

    // Replace goals.
    await supabase.from('health_goals').delete().eq('user_id', userId);
    await supabase.from('health_goals').insert(
      input.goals.map((goal) => ({
        user_id: userId,
        goal,
        is_primary: goal === input.primaryGoal,
      })),
    );
  }

  return profile;
}
