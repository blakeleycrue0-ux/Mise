/** Current virtual pet state, driven by the PetState engine. */
import { create } from 'zustand';
import type { PetState } from '@types';

const initial: PetState = {
  level: 1,
  xp: 0,
  mood: 'neutral',
  animationState: 'idle_neutral',
  rewards: [],
  evaluatedAt: new Date().toISOString(),
};

interface PetStoreState {
  pet: PetState;
  setPet: (pet: PetState) => void;
  /** Clear one-shot rewards after they've been shown. */
  clearRewards: () => void;
}

export const usePetStore = create<PetStoreState>((set) => ({
  pet: initial,
  setPet: (pet) => set({ pet }),
  clearRewards: () => set((s) => ({ pet: { ...s.pet, rewards: [] } })),
}));
