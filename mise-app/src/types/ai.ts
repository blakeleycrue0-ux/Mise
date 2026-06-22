/**
 * Contracts for the AI service layer. Every model call returns STRUCTURED JSON
 * matching these shapes — never free text the app has to parse loosely.
 *
 * `AIResult<T>` wraps every response so the UI can handle low-confidence or
 * failed inferences uniformly regardless of which underlying model produced it.
 */

import type { Ingredient, NutritionEstimate } from './nutrition';
import type { Recipe, MealPlan } from './recipe';
import type { CookingSkillLevel, UserProfile } from './profile';

export type AIModelKind = 'vision' | 'nutrition' | 'recipe' | 'coach';

export interface AIResult<T> {
  ok: boolean;
  data: T | null;
  /** 0-1 overall confidence; UI may ask the user to confirm when low. */
  confidence: number;
  /** Which provider/model produced this, for logging + A/B swaps. */
  model: string;
  /** Present when ok === false. */
  error?: string;
  /** Latency in ms, recorded into ai_interactions_log. */
  latencyMs?: number;
}

/** analyzeFood(image) result. */
export interface FoodAnalysis {
  title: string;
  ingredients: Ingredient[];
  nutrition: NutritionEstimate;
  /** Healthier swaps the coach can suggest. */
  healthierAlternatives: string[];
}

/** analyzeFridge(image) result. */
export interface FridgeAnalysis {
  ingredients: Ingredient[];
  /** Ids/titles of recipes the user could make right now. */
  suggestedRecipeTitles: string[];
}

export interface CoachStepResponse {
  /** Re-explained step pitched at the user's skill level. */
  guidance: string;
  /** The "why" behind this step. */
  rationale: string;
  /** Common mistake to avoid at this step. */
  watchOut?: string;
}

/** Inputs to coachCookingStep. */
export interface CoachStepRequest {
  recipeTitle: string;
  stepInstruction: string;
  skillLevel: CookingSkillLevel;
  /** Optional free-text question the user typed. */
  question?: string;
}

/** The provider-agnostic interface every AI backend must implement. */
export interface AIProvider {
  readonly name: string;
  analyzeFood(imageBase64: string, mediaType: string): Promise<AIResult<FoodAnalysis>>;
  analyzeFridge(imageBase64: string, mediaType: string): Promise<AIResult<FridgeAnalysis>>;
  generateMealPlan(profile: UserProfile): Promise<AIResult<MealPlan>>;
  generateRecipe(ingredients: Ingredient[], profile: UserProfile): Promise<AIResult<Recipe>>;
  coachCookingStep(req: CoachStepRequest): Promise<AIResult<CoachStepResponse>>;
}
