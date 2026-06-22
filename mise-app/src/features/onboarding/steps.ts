/**
 * Declarative onboarding definition. The screen renders whatever is in this
 * array, so adding/reordering questions never touches UI code — keeps the deep
 * onboarding scalable. Each step maps to one field on OnboardingInput.
 */
import type { OnboardingDraft } from '@state/onboardingStore';

export type StepKind = 'single' | 'multi' | 'number';

export interface Option {
  id: string;
  label: string;
}

export interface Step {
  /** Key on OnboardingInput this step writes. */
  field: keyof OnboardingDraft;
  kind: StepKind;
  title: string;
  subtitle?: string;
  options?: Option[];
  /** For number inputs. */
  unit?: string;
  min?: number;
  max?: number;
  /** Whether an answer is required to advance. */
  required?: boolean;
}

export const STEPS: Step[] = [
  {
    field: 'age',
    kind: 'number',
    title: 'How old are you?',
    subtitle: 'Used to tune your energy needs.',
    unit: 'years',
    min: 13,
    max: 120,
    required: true,
  },
  {
    field: 'gender',
    kind: 'single',
    title: 'What best describes you?',
    options: [
      { id: 'female', label: 'Female' },
      { id: 'male', label: 'Male' },
      { id: 'non_binary', label: 'Non-binary' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
    required: true,
  },
  {
    field: 'heightCm',
    kind: 'number',
    title: 'Your height',
    unit: 'cm',
    min: 80,
    max: 260,
    required: true,
  },
  {
    field: 'weightKg',
    kind: 'number',
    title: 'Your weight',
    unit: 'kg',
    min: 25,
    max: 400,
    required: true,
  },
  {
    field: 'activityLevel',
    kind: 'single',
    title: 'How active are you?',
    subtitle: 'Outside of cooking, day to day.',
    options: [
      { id: 'sedentary', label: 'Mostly sitting' },
      { id: 'light', label: 'Lightly active (1–3 days/wk)' },
      { id: 'moderate', label: 'Moderately active (3–5 days/wk)' },
      { id: 'active', label: 'Very active (6–7 days/wk)' },
      { id: 'very_active', label: 'Athlete / physical job' },
    ],
    required: true,
  },
  {
    field: 'dietaryPreferences',
    kind: 'multi',
    title: 'How do you eat?',
    subtitle: 'Pick any that apply.',
    options: [
      { id: 'omnivore', label: 'Everything' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'pescatarian', label: 'Pescatarian' },
      { id: 'halal', label: 'Halal' },
      { id: 'kosher', label: 'Kosher' },
      { id: 'keto', label: 'Keto' },
      { id: 'paleo', label: 'Paleo' },
    ],
  },
  {
    field: 'allergies',
    kind: 'multi',
    title: 'Any allergies or intolerances?',
    subtitle: 'We will never suggest these.',
    options: [
      { id: 'peanuts', label: 'Peanuts' },
      { id: 'tree_nuts', label: 'Tree nuts' },
      { id: 'dairy', label: 'Dairy' },
      { id: 'gluten', label: 'Gluten' },
      { id: 'eggs', label: 'Eggs' },
      { id: 'shellfish', label: 'Shellfish' },
      { id: 'soy', label: 'Soy' },
    ],
  },
  {
    field: 'cookingSkillLevel',
    kind: 'single',
    title: 'How confident are you in the kitchen?',
    subtitle: 'This shapes how the coach teaches you.',
    options: [
      { id: 'beginner', label: 'Beginner — teach me the basics' },
      { id: 'home_cook', label: 'Home cook — I get by' },
      { id: 'confident', label: 'Confident — push me' },
      { id: 'advanced', label: 'Advanced — challenge me' },
    ],
    required: true,
  },
  {
    field: 'primaryGoal',
    kind: 'single',
    title: 'What matters most right now?',
    subtitle: 'Your main goal. You can change this later.',
    options: [
      { id: 'learn_to_cook', label: 'Learn to cook' },
      { id: 'eat_healthier', label: 'Eat healthier' },
      { id: 'fat_loss', label: 'Lose fat' },
      { id: 'muscle_gain', label: 'Build muscle' },
      { id: 'maintenance', label: 'Maintain' },
      { id: 'save_money', label: 'Save money' },
    ],
    required: true,
  },
  {
    field: 'cookingTimePerDayMin',
    kind: 'single',
    title: 'How much time to cook each day?',
    options: [
      { id: '15', label: 'Up to 15 min' },
      { id: '30', label: 'About 30 min' },
      { id: '45', label: 'About 45 min' },
      { id: '60', label: 'An hour or more' },
    ],
    required: true,
  },
  {
    field: 'budgetRange',
    kind: 'single',
    title: "What's your food budget like?",
    options: [
      { id: 'tight', label: 'Tight — keep it cheap' },
      { id: 'moderate', label: 'Moderate' },
      { id: 'comfortable', label: 'Comfortable' },
      { id: 'flexible', label: 'Flexible' },
    ],
    required: true,
  },
  {
    field: 'kitchenEquipment',
    kind: 'multi',
    title: 'What can you cook with?',
    subtitle: 'Pick the equipment you have.',
    options: [
      { id: 'stovetop', label: 'Stovetop' },
      { id: 'oven', label: 'Oven' },
      { id: 'microwave', label: 'Microwave' },
      { id: 'air_fryer', label: 'Air fryer' },
      { id: 'blender', label: 'Blender' },
      { id: 'slow_cooker', label: 'Slow cooker' },
      { id: 'instant_pot', label: 'Instant Pot' },
      { id: 'grill', label: 'Grill' },
    ],
  },
];

export const TOTAL_STEPS = STEPS.length;
