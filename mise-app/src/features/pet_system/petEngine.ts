/**
 * PetState Engine (spec §8).
 *
 * Pure, deterministic function: signals in -> PetState out. No side effects, no
 * randomness, no emoji — `animationState` names map to animation clips in
 * src/assets/pet. Keeping this pure makes the motivation system testable and
 * lets us tune thresholds without touching UI.
 *
 * Inputs (PetSignals):
 *   - consistencyStreakDays   how long the user has shown up
 *   - caloriesAdherence       0-1, how close to target
 *   - cookingSessionsThisWeek hands-on cooking activity (weighted highest:
 *                             cooking education is the product's core value)
 *   - engagementDaysThisWeek  app opens this week (0-7)
 *
 * Outputs (PetState): level, xp, mood, animationState, rewards.
 */
import type {
  PetAnimationState,
  PetMood,
  PetReward,
  PetSignals,
  PetState,
} from '@types';

const XP_PER_LEVEL = 100;

/** Weighted 0-100 wellbeing score. Cooking is weighted highest by design. */
export function wellbeingScore(s: PetSignals): number {
  const streak = Math.min(s.consistencyStreakDays / 14, 1); // caps at 2 weeks
  const cooking = Math.min(s.cookingSessionsThisWeek / 5, 1); // caps at 5/wk
  const engagement = Math.min(s.engagementDaysThisWeek / 7, 1);
  const adherence = Math.max(0, Math.min(s.caloriesAdherence, 1));

  const score =
    cooking * 0.4 + streak * 0.25 + adherence * 0.2 + engagement * 0.15;
  return Math.round(score * 100);
}

function moodFor(score: number): PetMood {
  if (score >= 80) return 'excited';
  if (score >= 55) return 'happy';
  if (score >= 30) return 'neutral';
  return 'disappointed';
}

function animationFor(mood: PetMood, leveledUp: boolean): PetAnimationState {
  if (leveledUp) return 'level_up';
  switch (mood) {
    case 'excited':
      return 'celebrate';
    case 'happy':
      return 'idle_happy';
    case 'neutral':
      return 'idle_neutral';
    case 'disappointed':
      return 'sulk';
  }
}

/**
 * Evaluate the next pet state given current persisted level/xp and fresh signals.
 * XP earned scales with the wellbeing score; crossing XP_PER_LEVEL levels up.
 */
export function evaluatePet(
  signals: PetSignals,
  current: Pick<PetState, 'level' | 'xp'> = { level: 1, xp: 0 },
): PetState {
  const score = wellbeingScore(signals);
  const mood = moodFor(score);

  // XP gain: a good week (score 100) grants ~40 XP; a poor week grants little.
  const xpGain = Math.round((score / 100) * 40);
  let level = current.level;
  let xp = current.xp + xpGain;
  let leveledUp = false;
  while (xp >= XP_PER_LEVEL) {
    xp -= XP_PER_LEVEL;
    level += 1;
    leveledUp = true;
  }

  const rewards = computeRewards(signals, leveledUp, level);

  return {
    level,
    xp,
    mood,
    animationState: animationFor(mood, leveledUp),
    rewards,
    evaluatedAt: new Date().toISOString(),
  };
}

/** Reward triggers surfaced once in the UI then cleared from state. */
function computeRewards(
  s: PetSignals,
  leveledUp: boolean,
  level: number,
): PetReward[] {
  const rewards: PetReward[] = [];
  if (leveledUp) {
    rewards.push({
      type: 'level_up',
      title: `Level ${level}!`,
      description: 'Your companion grew alongside your cooking.',
    });
  }
  if ([3, 7, 14, 30].includes(s.consistencyStreakDays)) {
    rewards.push({
      type: 'streak_milestone',
      title: `${s.consistencyStreakDays}-day streak`,
      description: 'Consistency is the whole game. Keep going.',
    });
  }
  if (s.caloriesAdherence >= 0.9) {
    rewards.push({
      type: 'goal_hit',
      title: 'On target',
      description: 'You hit your nutrition goal this week.',
    });
  }
  return rewards;
}
