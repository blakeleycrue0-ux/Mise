/**
 * Food Scanner module (built last, per the staged plan).
 *
 * Planned surface:
 *   - useFoodScanner(): camera capture -> base64 -> analyzeMealPhoto
 *   - confirmAndLog(analysis, mealType): writes food_scans + meals_logged
 *   - low-confidence flow: prompt the user to confirm/edit before logging.
 *
 * Depends on: @services/vision, expo-camera, @types FoodAnalysis/LoggedMeal.
 */
export {};
