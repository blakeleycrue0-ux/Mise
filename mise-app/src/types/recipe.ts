import type { Ingredient, NutritionEstimate } from './nutrition';
import type { CookingSkillLevel } from './profile';

/** A single guided step in the cooking coach. */
export interface RecipeStep {
  index: number;
  /** Short imperative instruction, e.g. "Dice the onion finely". */
  instruction: string;
  /** Optional technique taught here, e.g. "dicing", "deglazing". */
  technique?: string;
  /** The "why" — short nutrition or technique rationale shown on demand. */
  rationale?: string;
  estimatedMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: CookingSkillLevel;
  servings: number;
  totalMinutes: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutritionPerServing: NutritionEstimate;
  /** Techniques the user will practice/learn by cooking this. */
  techniquesTaught: string[];
  /** Equipment required, matched against the user's kitchen. */
  equipmentRequired: string[];
}

export type MealPlanDay = {
  date: string; // ISO date
  meals: Array<{
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeId?: string;
    title: string;
    nutrition: NutritionEstimate;
  }>;
};

export interface MealPlan {
  id: string;
  userId: string;
  startDate: string;
  days: MealPlanDay[];
  /** Recomputed macro targets this plan was built against. */
  dailyTargetCalories: number;
}
