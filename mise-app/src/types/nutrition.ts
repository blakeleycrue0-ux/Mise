/** Shared nutrition primitives used by scans, meals and meal plans. */

export interface Ingredient {
  name: string;
  /** Optional quantity in grams when known. */
  grams?: number;
  /** Free-text amount when grams unknown, e.g. "2 tbsp". */
  amount?: string;
}

export interface NutritionEstimate {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** 0-1 model confidence in the estimate. */
  confidence: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface LoggedMeal {
  id: string;
  userId: string;
  mealType: MealType;
  title: string;
  ingredients: Ingredient[];
  nutrition: NutritionEstimate;
  /** Set when this meal came from an AI food scan. */
  foodScanId?: string;
  loggedAt: string;
}
