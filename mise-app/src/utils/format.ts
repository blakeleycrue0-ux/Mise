/** Small presentation helpers. */

export const kcal = (n: number): string => `${Math.round(n)} kcal`;
export const grams = (n: number): string => `${Math.round(n)}g`;

export function titleCase(s: string): string {
  return s
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Clamp a 0-1 value and render as a percentage. */
export const pct = (v: number): string => `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`;
