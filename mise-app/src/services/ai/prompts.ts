/**
 * Prompt builders kept separate from providers so prompts can be iterated on
 * (and version-controlled / A/B tested) without touching transport code.
 *
 * Each builder produces a `{ system, user }` pair plus the JSON schema the model
 * must conform to. The schema string is embedded into the prompt AND can be used
 * for response validation. No model output is ever trusted as free text.
 */

import type { CoachStepRequest, UserProfile } from '@types';
import type { Ingredient } from '@types';

const JSON_ONLY =
  'Respond with ONLY valid minified JSON matching the schema. No markdown, no prose, no code fences.';

export const SCHEMAS = {
  food: `{"title":string,"ingredients":[{"name":string,"grams":number?}],"nutrition":{"calories":number,"proteinG":number,"carbsG":number,"fatG":number,"confidence":number},"healthierAlternatives":string[]}`,
  fridge: `{"ingredients":[{"name":string}],"suggestedRecipeTitles":string[]}`,
  recipe: `{"title":string,"description":string,"difficulty":"beginner"|"home_cook"|"confident"|"advanced","servings":number,"totalMinutes":number,"ingredients":[{"name":string,"amount":string}],"steps":[{"index":number,"instruction":string,"technique":string?,"rationale":string?,"estimatedMinutes":number?}],"nutritionPerServing":{"calories":number,"proteinG":number,"carbsG":number,"fatG":number,"confidence":number},"techniquesTaught":string[],"equipmentRequired":string[]}`,
  coachStep: `{"guidance":string,"rationale":string,"watchOut":string?}`,
  mealPlan: `{"dailyTargetCalories":number,"days":[{"date":string,"meals":[{"mealType":"breakfast"|"lunch"|"dinner"|"snack","title":string,"nutrition":{"calories":number,"proteinG":number,"carbsG":number,"fatG":number,"confidence":number}}]}]}`,
} as const;

export function foodPrompt(): { system: string; user: string } {
  return {
    system:
      'You are Mise, a precise food vision and nutrition estimator. You favour realistic, conservative calorie estimates and always express uncertainty via the confidence field (0-1).',
    user: `Identify the meal in the image. Estimate ingredients and per-serving nutrition. Suggest 1-3 healthier swaps. ${JSON_ONLY} Schema: ${SCHEMAS.food}`,
  };
}

export function fridgePrompt(): { system: string; user: string } {
  return {
    system:
      'You are Mise, scanning a fridge/pantry photo to reduce food waste. Only list food you can clearly see.',
    user: `List visible food ingredients (max 14) and suggest up to 5 recipe titles makeable from them. ${JSON_ONLY} Schema: ${SCHEMAS.fridge}`,
  };
}

function profileBrief(p: UserProfile): string {
  return [
    `skill=${p.cookingSkillLevel}`,
    `goal=${p.primaryGoal}`,
    `diet=${p.dietaryPreferences.join('/') || 'omnivore'}`,
    `allergies=${p.allergies.join('/') || 'none'}`,
    `time=${p.cookingTimePerDayMin}min`,
    `budget=${p.budgetRange}`,
    `equipment=${p.kitchenEquipment.join('/') || 'basic'}`,
    `targetKcal=${p.nutrition.targets.calories}`,
  ].join(', ');
}

export function recipePrompt(
  ingredients: Ingredient[],
  p: UserProfile,
): { system: string; user: string } {
  return {
    system:
      'You are Mise, a cooking coach. You teach technique and explain the "why" behind steps. Match difficulty and equipment to the user. Respect allergies absolutely.',
    user: `User: ${profileBrief(p)}. Available ingredients: ${ingredients
      .map((i) => i.name)
      .join(', ')}. Generate one recipe that teaches at least one technique. ${JSON_ONLY} Schema: ${SCHEMAS.recipe}`,
  };
}

export function mealPlanPrompt(p: UserProfile): { system: string; user: string } {
  return {
    system:
      'You are Mise, an adaptive meal planner. Keep daily calories near target, respect diet/allergies/budget/time, and progress cooking difficulty gradually.',
    user: `User: ${profileBrief(p)}. Build a 7-day plan (breakfast, lunch, dinner). ${JSON_ONLY} Schema: ${SCHEMAS.mealPlan}`,
  };
}

export function coachStepPrompt(req: CoachStepRequest): {
  system: string;
  user: string;
} {
  return {
    system: `You are Mise, a patient cooking coach speaking to a ${req.skillLevel} cook. Explain clearly, teach the technique, give the reason. Be concise.`,
    user: `Recipe: "${req.recipeTitle}". Step: "${req.stepInstruction}".${
      req.question ? ` User asks: "${req.question}".` : ''
    } ${JSON_ONLY} Schema: ${SCHEMAS.coachStep}`,
  };
}
