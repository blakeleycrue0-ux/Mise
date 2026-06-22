/**
 * Vision service — thin domain wrapper over the AI layer for image features.
 * Keeps screens from depending on AIService directly and is the natural place
 * to add image preprocessing (resize/compress) before upload later.
 */
import { ai } from '@services/ai';
import type { AIResult, FoodAnalysis, FridgeAnalysis } from '@types';

export function analyzeMealPhoto(
  base64: string,
  mediaType = 'image/jpeg',
): Promise<AIResult<FoodAnalysis>> {
  return ai.analyzeFood(base64, mediaType);
}

export function analyzeFridgePhoto(
  base64: string,
  mediaType = 'image/jpeg',
): Promise<AIResult<FridgeAnalysis>> {
  return ai.analyzeFridge(base64, mediaType);
}
