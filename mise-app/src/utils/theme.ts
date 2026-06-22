/**
 * Mise design tokens — ported from the web prototype (index.html) so the native
 * app stays visually consistent: deep navy ground, flame-blue accent, calm sage.
 * Premium, friendly, not childish. No emoji in the product UI.
 */
export const colors = {
  ink: '#14213D',
  inkSoft: '#5B6B85',
  paper: '#F4F6FA',
  oliveDeep: '#0F1830',
  sage: '#8FA8C9',
  flame: '#1B3B8C',
  flameSoft: '#3E63B5',
  ground: '#0B1226', // app background
  surface: 'rgba(255,255,255,0.06)',
  surfaceSel: 'rgba(62,99,181,0.42)',
  border: 'rgba(255,255,255,0.16)',
  borderStrong: 'rgba(143,168,201,0.95)',
  white: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.6)',
} as const;

export const fonts = {
  // These map to fonts loaded via expo-font in a later pass; system fallbacks
  // keep the app rendering today.
  display: 'System',
  body: 'System',
  mono: 'System',
} as const;

export const radius = { sm: 12, md: 16, lg: 18, pill: 100 } as const;
export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 } as const;
