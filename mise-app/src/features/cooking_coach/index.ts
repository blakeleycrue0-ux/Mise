/**
 * Cooking Coach — THE core module (built on request).
 *
 * Planned surface:
 *   - useCookingSession(recipe): drives step-by-step guided cooking
 *   - coachStep(step, skillLevel): calls ai.coachCookingStep for re-explanation
 *   - progression: beginner -> advanced track, technique unlocks written to
 *     `cooking_progress`, awarding skill_xp that feeds the PetState engine.
 *
 * Depends on: @services/ai (coachCookingStep), @types Recipe/RecipeStep,
 *             @features/pet_system (xp), supabase cooking_progress table.
 */
export {};
