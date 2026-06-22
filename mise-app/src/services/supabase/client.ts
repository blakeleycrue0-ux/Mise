/**
 * Supabase client. Uses SecureStore for session persistence on device.
 * When Supabase isn't configured (no env), `supabase` is null and callers fall
 * back to local-only behaviour so the app still runs end-to-end in dev.
 */
import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { config, hasSupabase } from '@utils/config';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
