/**
 * Onboarding inputs and the derived user profile.
 * These mirror the `user_profiles` and `health_goals` tables in Supabase.
 */

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export type ActivityLevel =
  | 'sedentary' // little or no exercise
  | 'light' // 1-3 days/week
  | 'moderate' // 3-5 days/week
  | 'active' // 6-7 days/week
  | 'very_active'; // hard exercise / physical job

export type DietaryPreference =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'halal'
  | 'kosher'
  | 'keto'
  | 'paleo';

/** Self-rated, drives how the cooking coach explains steps. */
export type CookingSkillLevel = 'beginner' | 'home_cook' | 'confident' | 'advanced';

export type Goal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'learn_to_cook'
  | 'eat_healthier'
  | 'save_money';

export type KitchenEquipment =
  | 'stovetop'
  | 'oven'
  | 'microwave'
  | 'air_fryer'
  | 'blender'
  | 'food_processor'
  | 'slow_cooker'
  | 'instant_pot'
  | 'grill'
  | 'minimal'; // single pan, dorm-style

export type BudgetRange = 'tight' | 'moderate' | 'comfortable' | 'flexible';

/** Raw answers captured during onboarding, before AI derivation. */
export interface OnboardingInput {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dietaryPreferences: DietaryPreference[];
  allergies: string[];
  cookingSkillLevel: CookingSkillLevel;
  goals: Goal[];
  primaryGoal: Goal;
  cookingTimePerDayMin: number; // minutes available to cook per day
  budgetRange: BudgetRange;
  kitchenEquipment: KitchenEquipment[];
}

/** Macro split in grams per day. */
export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/**
 * The personalized profile produced after onboarding. Part of it is computed
 * locally (BMR/TDEE/macros) and part is enriched by the AI layer (summary,
 * focus areas, starting recipes).
 */
export interface NutritionProfile {
  bmr: number;
  tdee: number;
  targets: MacroTargets;
  /** Human-readable one-paragraph summary of the plan. AI-generated. */
  summary: string;
  /** 2-4 focus areas, e.g. "knife skills", "protein at breakfast". AI-generated. */
  focusAreas: string[];
  /** Suggested cooking track to start on. */
  startingSkillTrack: CookingSkillLevel;
}

export interface UserProfile extends OnboardingInput {
  id: string;
  userId: string;
  nutrition: NutritionProfile;
  createdAt: string;
  updatedAt: string;
}
