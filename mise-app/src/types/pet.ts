/**
 * Virtual pet (dog) companion types.
 * The pet is animation-driven — no emoji. `animationState` maps to an
 * animation asset/clip in src/assets/pet.
 */

export type PetMood = 'excited' | 'happy' | 'neutral' | 'disappointed';

/**
 * Discrete animation clips the renderer knows how to play. Kept separate from
 * mood so visuals can be tuned without changing engine logic.
 */
export type PetAnimationState =
  | 'idle_happy'
  | 'idle_neutral'
  | 'sulk'
  | 'celebrate'
  | 'level_up'
  | 'eating'
  | 'cooking';

/** Inputs the PetState engine consumes to derive a mood/level. */
export interface PetSignals {
  /** Consecutive days the user logged or cooked something. */
  consistencyStreakDays: number;
  /** 0-1: how close calorie intake was to target over the trailing window. */
  caloriesAdherence: number;
  /** Count of cooking sessions completed in the trailing window. */
  cookingSessionsThisWeek: number;
  /** Days the user opened the app in the trailing week (0-7). */
  engagementDaysThisWeek: number;
}

/** Output of the PetState engine — persisted to `pet_states`. */
export interface PetState {
  level: number;
  /** 0-100 progress to the next level. */
  xp: number;
  mood: PetMood;
  animationState: PetAnimationState;
  /** Reward events triggered this evaluation, surfaced once in the UI. */
  rewards: PetReward[];
  evaluatedAt: string;
}

export type PetRewardType =
  | 'streak_milestone'
  | 'level_up'
  | 'new_technique'
  | 'goal_hit';

export interface PetReward {
  type: PetRewardType;
  title: string;
  description: string;
}
