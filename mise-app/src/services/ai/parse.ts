/**
 * Defensive JSON extraction. Models occasionally wrap JSON in fences or add a
 * stray sentence; we strip those and parse. If parsing fails the caller turns
 * it into a failed AIResult rather than crashing the UI.
 */
export function parseModelJson<T>(raw: string): T | null {
  if (!raw) return null;
  let text = raw.trim();
  // Strip code fences if present.
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  // Grab the first balanced {...} or [...] block.
  const firstBrace = text.search(/[{[]/);
  if (firstBrace > 0) text = text.slice(firstBrace);
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
