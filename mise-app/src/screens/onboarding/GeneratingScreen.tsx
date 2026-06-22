import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen, Button } from '@components';
import { colors, spacing } from '@utils/theme';
import { useOnboarding } from '@features/onboarding';
import { kcal, grams } from '@utils/format';
import type { NutritionProfile } from '@types';
import type { OnboardingStackScreenProps } from '@/navigation/types';

export function GeneratingScreen({ navigation }: OnboardingStackScreenProps<'Generating'>) {
  const { finalize, reset } = useOnboarding();
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const p = await finalize();
        if (active) setProfile(p.nutrition);
      } catch (e) {
        if (active) setError(String(e));
      }
    })();
    return () => {
      active = false;
    };
    // finalize is stable enough for a one-shot effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.sub}>{error}</Text>
        </View>
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.sage} size="large" />
          <Text style={styles.title}>Building your plan…</Text>
          <Text style={styles.sub}>Personalizing your cooking track and targets.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Your plan is ready</Text>
      <Text style={styles.summary}>{profile.summary}</Text>

      <View style={styles.macroRow}>
        <Macro label="Daily" value={kcal(profile.targets.calories)} />
        <Macro label="Protein" value={grams(profile.targets.proteinG)} />
        <Macro label="Carbs" value={grams(profile.targets.carbsG)} />
        <Macro label="Fat" value={grams(profile.targets.fatG)} />
      </View>

      <Text style={styles.section}>We'll focus on</Text>
      {profile.focusAreas.map((f) => (
        <View key={f} style={styles.focus}>
          <Text style={styles.focusText}>{f}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Button
          label="MEET YOUR KITCHEN"
          onPress={() => {
            reset();
            navigation.getParent()?.navigate('Main');
          }}
        />
      </View>
    </Screen>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macro}>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  title: { color: colors.white, fontSize: 27, fontWeight: '800' },
  sub: { color: colors.textDim, fontSize: 15, textAlign: 'center' },
  summary: { color: colors.textDim, fontSize: 15, lineHeight: 22 },
  macroRow: { flexDirection: 'row', gap: spacing.sm },
  macro: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  macroValue: { color: colors.white, fontSize: 15, fontWeight: '700' },
  macroLabel: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  section: { color: colors.white, fontSize: 18, fontWeight: '700', marginTop: spacing.sm },
  focus: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  focusText: { color: colors.white, fontSize: 15 },
  footer: { marginTop: spacing.md, paddingBottom: spacing.lg },
});
