/**
 * Hand-written row types that mirror supabase/schema.sql.
 * In a real project these can be replaced with `supabase gen types typescript`.
 * Column names are snake_case to match Postgres.
 */

export interface UserRow {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfileRow {
  id: string;
  user_id: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  dietary_preferences: string[];
  allergies: string[];
  cooking_skill_level: string;
  cooking_time_per_day_min: number;
  budget_range: string;
  kitchen_equipment: string[];
  bmr: number | null;
  tdee: number | null;
  target_calories: number | null;
  target_protein_g: number | null;
  target_carbs_g: number | null;
  target_fat_g: number | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthGoalRow {
  id: string;
  user_id: string;
  goal: string;
  is_primary: boolean;
  created_at: string;
}

export interface FoodScanRow {
  id: string;
  user_id: string;
  image_path: string | null;
  detected_ingredients: unknown; // jsonb
  nutrition_estimate: unknown; // jsonb
  model: string | null;
  confidence: number | null;
  created_at: string;
}

export interface PetStateRow {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  mood: string;
  animation_state: string;
  evaluated_at: string;
}

export interface AIInteractionRow {
  id: string;
  user_id: string;
  kind: string; // vision | nutrition | recipe | coach
  model: string;
  request_summary: string | null;
  success: boolean;
  latency_ms: number | null;
  created_at: string;
}
