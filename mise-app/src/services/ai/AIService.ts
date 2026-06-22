/**
 * AIService — the single public entry point for all AI in the app.
 *
 * Why a facade over the provider?
 *  - Swappable models: pass any AIProvider (Gateway, Mock, future on-device).
 *  - Observability: every call is written to ai_interactions_log.
 *  - Resilience: if the primary provider fails, fall back to a secondary
 *    (e.g. Mock) so the UI degrades gracefully instead of breaking.
 *
 * Screens/features must depend on AIService, never on a concrete provider.
 */

import type {
  AIProvider,
  AIResult,
  CoachStepRequest,
  CoachStepResponse,
  FoodAnalysis,
  FridgeAnalysis,
  Ingredient,
  MealPlan,
  Recipe,
  UserProfile,
} from '@types';
import type { AIModelKind } from '@types';

/** Sink for interaction logs — wired to Supabase in services/ai/index.ts. */
export interface AILogger {
  log(entry: {
    kind: AIModelKind;
    model: string;
    success: boolean;
    latencyMs?: number;
    requestSummary?: string;
  }): void;
}

const noopLogger: AILogger = { log: () => undefined };

export class AIService {
  constructor(
    private readonly primary: AIProvider,
    private readonly fallback?: AIProvider,
    private readonly logger: AILogger = noopLogger,
  ) {}

  private async run<T>(
    kind: AIModelKind,
    summary: string,
    fn: (p: AIProvider) => Promise<AIResult<T>>,
  ): Promise<AIResult<T>> {
    let result = await fn(this.primary);
    if (!result.ok && this.fallback) {
      result = await fn(this.fallback);
    }
    this.logger.log({
      kind,
      model: result.model,
      success: result.ok,
      latencyMs: result.latencyMs,
      requestSummary: summary,
    });
    return result;
  }

  analyzeFood(imageBase64: string, mediaType: string): Promise<AIResult<FoodAnalysis>> {
    return this.run('vision', 'analyzeFood', (p) =>
      p.analyzeFood(imageBase64, mediaType),
    );
  }

  analyzeFridge(imageBase64: string, mediaType: string): Promise<AIResult<FridgeAnalysis>> {
    return this.run('vision', 'analyzeFridge', (p) =>
      p.analyzeFridge(imageBase64, mediaType),
    );
  }

  generateMealPlan(profile: UserProfile): Promise<AIResult<MealPlan>> {
    return this.run('recipe', 'generateMealPlan', (p) => p.generateMealPlan(profile));
  }

  generateRecipe(
    ingredients: Ingredient[],
    profile: UserProfile,
  ): Promise<AIResult<Recipe>> {
    return this.run('recipe', 'generateRecipe', (p) =>
      p.generateRecipe(ingredients, profile),
    );
  }

  coachCookingStep(req: CoachStepRequest): Promise<AIResult<CoachStepResponse>> {
    return this.run('coach', `coachStep:${req.recipeTitle}`, (p) =>
      p.coachCookingStep(req),
    );
  }
}
