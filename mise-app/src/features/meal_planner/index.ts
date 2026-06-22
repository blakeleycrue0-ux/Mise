/**
 * Meal Planner module (built on request).
 *
 * Planned surface:
 *   - generatePlan(profile): wraps ai.generateMealPlan, persists to `meal_plans`
 *   - recalcMacros(profile, progress): dynamic macro recalculation as weight/
 *     goal changes (uses @services/nutrition).
 *   - swapMeal(planId, day, mealType): regenerate a single meal in place.
 *
 * Depends on: @services/ai, @services/nutrition, @types MealPlan.
 */
export {};
