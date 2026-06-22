/** Thin auth helpers over the Supabase client. */
import { supabase } from './client';

export async function signUp(email: string, password: string) {
  if (!supabase) return { userId: 'local-dev-user', error: null as string | null };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { userId: data.user?.id ?? null, error: error?.message ?? null };
}

export async function signIn(email: string, password: string) {
  if (!supabase) return { userId: 'local-dev-user', error: null as string | null };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { userId: data.user?.id ?? null, error: error?.message ?? null };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return 'local-dev-user';
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
