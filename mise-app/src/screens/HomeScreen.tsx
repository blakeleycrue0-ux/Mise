import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@components';
import { colors, spacing, radius } from '@utils/theme';
import { useUserStore } from '@state/userStore';
import { usePetStore } from '@state/petStore';
import { kcal } from '@utils/format';

/**
 * Home dashboard. Pulls together today's targets and the companion's mood.
 * The scanning / coach / planner modules plug in here as they're built.
 */
export function HomeScreen() {
  const profile = useUserStore((s) => s.profile);
  const pet = usePetStore((s) => s.pet);

  return (
    <Screen scroll>
      <Text style={styles.greeting}>Today</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Your companion</Text>
        <Text style={styles.petMood}>
          Level {pet.level} · {pet.mood}
        </Text>
        <Text style={styles.cardSub}>
          Cook and log meals to keep them happy.
        </Text>
      </View>

      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Daily target</Text>
          <Text style={styles.bigNumber}>{kcal(profile.nutrition.targets.calories)}</Text>
          <Text style={styles.cardSub}>
            P {profile.nutrition.targets.proteinG}g · C {profile.nutrition.targets.carbsG}g ·
            F {profile.nutrition.targets.fatG}g
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Next up</Text>
        <Text style={styles.cardSub}>
          Your cooking coach, meal planner and scanner appear here as each module
          is built.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { color: colors.white, fontSize: 30, fontWeight: '800' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 4,
  },
  cardLabel: { color: colors.sage, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  petMood: { color: colors.white, fontSize: 22, fontWeight: '700', textTransform: 'capitalize' },
  bigNumber: { color: colors.white, fontSize: 32, fontWeight: '800' },
  cardSub: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
});
