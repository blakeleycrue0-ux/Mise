/**
 * MockProvider — deterministic, offline responses so the app is fully runnable
 * with zero backend/keys (dev, demos, CI, Storybook). It implements the exact
 * same AIProvider contract as GatewayProvider, so swapping is a one-line change.
 */

import type {
  AIProvider,
  AIResult,
  FoodAnalysis,
  FridgeAnalysis,
  CoachStepRequest,
  CoachStepResponse,
  Ingredient,
  MealPlan,
  Recipe,
  UserProfile,
} from '@types';

function ok<T>(data: T, confidence = 0.6): AIResult<T> {
  return { ok: true, data, confidence, model: 'mock-1', latencyMs: 120 };
}

export class MockProvider implements AIProvider {
  readonly name = 'mock';

  async analyzeFood(): Promise<AIResult<FoodAnalysis>> {
    return ok<FoodAnalysis>({
      title: 'Chicken & rice bowl',
      ingredients: [
        { name: 'chicken breast', grams: 150 },
        { name: 'white rice', grams: 180 },
        { name: 'broccoli', grams: 80 },
      ],
      nutrition: { calories: 520, proteinG: 42, carbsG: 58, fatG: 12, confidence: 0.6 },
      healthierAlternatives: [
        'Swap white rice for brown rice for more fibre',
        'Add a squeeze of lemon instead of extra salt',
      ],
    });
  }

  async analyzeFridge(): Promise<AIResult<FridgeAnalysis>> {
    return ok<FridgeAnalysis>({
      ingredients: [
        { name: 'eggs' },
        { name: 'spinach' },
        { name: 'tomato' },
        { name: 'cheddar' },
        { name: 'onion' },
      ],
      suggestedRecipeTitles: [
        'Spinach & cheddar omelette',
        'Simple tomato & egg shakshuka',
      ],
    });
  }

  async generateMealPlan(profile: UserProfile): Promise<AIResult<MealPlan>> {
    const target = profile.nutrition.targets.calories;
    const day = (date: string) => ({
      date,
      meals: [
        {
          mealType: 'breakfast' as const,
          title: 'Greek yogurt with berries & oats',
          nutrition: { calories: Math.round(target * 0.25), proteinG: 25, carbsG: 45, fatG: 10, confidence: 0.5 },
        },
        {
          mealType: 'lunch' as const,
          title: 'Chicken, quinoa & roasted veg',
          nutrition: { calories: Math.round(target * 0.35), proteinG: 40, carbsG: 55, fatG: 15, confidence: 0.5 },
        },
        {
          mealType: 'dinner' as const,
          title: 'Baked salmon with greens',
          nutrition: { calories: Math.round(target * 0.4), proteinG: 38, carbsG: 35, fatG: 22, confidence: 0.5 },
        },
      ],
    });
    const start = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return day(d.toISOString().slice(0, 10));
    });
    return ok<MealPlan>({
      id: 'mock-plan',
      userId: profile.userId,
      startDate: start.toISOString().slice(0, 10),
      dailyTargetCalories: target,
      days,
    });
  }

  async generateRecipe(
    ingredients: Ingredient[],
    profile: UserProfile,
  ): Promise<AIResult<Recipe>> {
    return ok<Recipe>({
      id: 'mock-recipe',
      title: 'One-pan veg & egg scramble',
      description: 'A fast, forgiving dish that teaches heat control and seasoning.',
      difficulty: profile.cookingSkillLevel,
      servings: 1,
      totalMinutes: 15,
      ingredients: ingredients.length
        ? ingredients
        : [{ name: 'eggs', amount: '3' }, { name: 'spinach', amount: '1 handful' }],
      steps: [
        {
          index: 0,
          instruction: 'Warm the pan on medium heat and add a little oil.',
          technique: 'heat control',
          rationale: 'A moderate, even heat stops eggs from turning rubbery.',
          estimatedMinutes: 2,
        },
        {
          index: 1,
          instruction: 'Wilt the spinach, then pour in beaten eggs and stir gently.',
          technique: 'scrambling',
          rationale: 'Low-and-slow stirring keeps the curds soft.',
          estimatedMinutes: 5,
        },
      ],
      nutritionPerServing: { calories: 320, proteinG: 22, carbsG: 6, fatG: 23, confidence: 0.5 },
      techniquesTaught: ['heat control', 'scrambling'],
      equipmentRequired: ['stovetop'],
    });
  }

  async coachCookingStep(req: CoachStepRequest): Promise<AIResult<CoachStepResponse>> {
    return ok<CoachStepResponse>({
      guidance: `For "${req.stepInstruction}", take it slow and trust your senses — listen and smell as much as you watch the clock.`,
      rationale: 'Cooking by feel builds intuition that no timer can give you.',
      watchOut: 'Resist the urge to crank the heat to rush it.',
    });
  }
}
