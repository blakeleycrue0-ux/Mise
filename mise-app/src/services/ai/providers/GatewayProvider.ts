/**
 * GatewayProvider — talks to a SERVER-SIDE AI gateway (Supabase Edge Function
 * or Netlify function), never to a model vendor directly. The gateway holds the
 * provider key and decides which concrete model to run for each `kind`. This is
 * what makes models swappable without shipping an app update.
 *
 * Contract with the gateway (POST {EXPO_PUBLIC_AI_GATEWAY_URL}):
 *   request:  { kind, system, user, image?, mediaType? }
 *   response: { text: string, model: string }   // text = the model's raw output
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
import {
  coachStepPrompt,
  foodPrompt,
  fridgePrompt,
  mealPlanPrompt,
  recipePrompt,
} from '../prompts';
import { parseModelJson } from '../parse';

type GatewayKind = 'vision' | 'nutrition' | 'recipe' | 'coach';

interface GatewayRequest {
  kind: GatewayKind;
  system: string;
  user: string;
  image?: string;
  mediaType?: string;
}

export class GatewayProvider implements AIProvider {
  readonly name = 'gateway';

  constructor(private readonly gatewayUrl: string) {}

  private async call<T>(
    body: GatewayRequest,
  ): Promise<AIResult<T>> {
    const started = Date.now();
    try {
      const res = await fetch(this.gatewayUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { text?: string; model?: string };
      const data = parseModelJson<T>(json.text ?? '');
      const latencyMs = Date.now() - started;
      if (!data) {
        return {
          ok: false,
          data: null,
          confidence: 0,
          model: json.model ?? 'unknown',
          error: 'Could not parse structured response',
          latencyMs,
        };
      }
      // Pull a confidence field if the schema carried one; else assume 0.7.
      const maybeNutrition = (data as unknown as {
        nutrition?: { confidence?: number };
      }).nutrition;
      const confidence =
        typeof maybeNutrition?.confidence === 'number'
          ? maybeNutrition.confidence
          : 0.7;
      return {
        ok: true,
        data,
        confidence,
        model: json.model ?? 'unknown',
        latencyMs,
      };
    } catch (e) {
      return {
        ok: false,
        data: null,
        confidence: 0,
        model: 'unknown',
        error: String(e),
        latencyMs: Date.now() - started,
      };
    }
  }

  analyzeFood(imageBase64: string, mediaType: string) {
    const p = foodPrompt();
    return this.call<FoodAnalysis>({
      kind: 'vision',
      system: p.system,
      user: p.user,
      image: imageBase64,
      mediaType,
    });
  }

  analyzeFridge(imageBase64: string, mediaType: string) {
    const p = fridgePrompt();
    return this.call<FridgeAnalysis>({
      kind: 'vision',
      system: p.system,
      user: p.user,
      image: imageBase64,
      mediaType,
    });
  }

  generateMealPlan(profile: UserProfile) {
    const p = mealPlanPrompt(profile);
    return this.call<MealPlan>({ kind: 'recipe', system: p.system, user: p.user });
  }

  generateRecipe(ingredients: Ingredient[], profile: UserProfile) {
    const p = recipePrompt(ingredients, profile);
    return this.call<Recipe>({ kind: 'recipe', system: p.system, user: p.user });
  }

  coachCookingStep(req: CoachStepRequest) {
    const p = coachStepPrompt(req);
    return this.call<CoachStepResponse>({
      kind: 'coach',
      system: p.system,
      user: p.user,
    });
  }
}
