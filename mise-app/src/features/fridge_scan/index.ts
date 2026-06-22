/**
 * Fridge Scanner module (built last, per the staged plan).
 *
 * Planned surface:
 *   - useFridgeScanner(): camera capture -> analyzeFridgePhoto
 *   - saveItems(ingredients): upsert into `fridge_items` (source = 'scan')
 *   - cookFromFridge(): feeds detected items into ai.generateRecipe to reduce
 *     food waste.
 *
 * Mirrors the existing web prototype (netlify/functions/scan.mjs).
 * Depends on: @services/vision, @services/ai, expo-camera, @types FridgeAnalysis.
 */
export {};
