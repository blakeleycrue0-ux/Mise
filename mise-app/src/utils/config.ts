/**
 * Centralized env access. Reads EXPO_PUBLIC_* vars (inlined at build time by
 * Expo) with app.json `extra` as a fallback. Missing AI/Supabase config is not
 * fatal — the app falls back to mock/offline behaviour so it always runs.
 */
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? '',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? '',
  aiGatewayUrl: process.env.EXPO_PUBLIC_AI_GATEWAY_URL ?? extra.aiGatewayUrl ?? '',
};

export const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);
export const hasAiGateway = Boolean(config.aiGatewayUrl);
