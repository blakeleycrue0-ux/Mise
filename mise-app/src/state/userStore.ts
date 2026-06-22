/** Authenticated user + their saved profile. */
import { create } from 'zustand';
import type { UserProfile } from '@types';

interface UserState {
  userId: string | null;
  profile: UserProfile | null;
  hydrated: boolean;
  setUser: (userId: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setHydrated: (v: boolean) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  profile: null,
  hydrated: false,
  setUser: (userId) => set({ userId }),
  setProfile: (profile) => set({ profile }),
  setHydrated: (hydrated) => set({ hydrated }),
  signOut: () => set({ userId: null, profile: null }),
}));
