import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Screen, Button, ProgressBar, OptionCard } from '@components';
import { colors, radius, spacing } from '@utils/theme';
import { useOnboarding } from '@features/onboarding';
import type { OnboardingStackScreenProps } from '@/navigation/types';

export function OnboardingScreen({ navigation }: OnboardingStackScreenProps<'Steps'>) {
  const {
    step,
    stepIndex,
    isLast,
    canAdvance,
    progress,
    draft,
    next,
    back,
    setSingle,
    toggleMulti,
  } = useOnboarding();

  const onContinue = () => {
    if (isLast) {
      navigation.navigate('Generating');
    } else {
      next();
    }
  };

  const onBack = () => {
    if (stepIndex === 0) navigation.goBack();
    else back();
  };

  const selectedMulti = (draft[step.field] as string[] | undefined) ?? [];
  const selectedSingle = draft[step.field];

  return (
    <Screen>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backChevron}>‹</Text>
      </Pressable>

      <ProgressBar value={progress} />

      <View style={styles.body}>
        <Text style={styles.title}>{step.title}</Text>
        {step.subtitle && <Text style={styles.subtitle}>{step.subtitle}</Text>}

        <View style={styles.options}>
          {step.kind === 'number' ? (
            <View style={styles.numberRow}>
              <TextInput
                style={styles.numberInput}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.inkSoft}
                value={
                  typeof selectedSingle === 'number' ? String(selectedSingle) : ''
                }
                onChangeText={setSingle}
                maxLength={3}
              />
              {step.unit && <Text style={styles.unit}>{step.unit}</Text>}
            </View>
          ) : (
            step.options?.map((opt) => (
              <OptionCard
                key={opt.id}
                label={opt.label}
                selected={
                  step.kind === 'multi'
                    ? selectedMulti.includes(opt.id)
                    : String(selectedSingle) === opt.id
                }
                onPress={() =>
                  step.kind === 'multi' ? toggleMulti(opt.id) : setSingle(opt.id)
                }
              />
            ))
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label={isLast ? 'BUILD MY PLAN' : 'CONTINUE'}
          onPress={onContinue}
          disabled={!canAdvance}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backChevron: { color: colors.white, fontSize: 26, lineHeight: 28, marginTop: -2 },
  body: { flex: 1 },
  title: { color: colors.white, fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { color: colors.textDim, fontSize: 15, marginTop: 6, marginBottom: 22 },
  options: { marginTop: spacing.md },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  numberInput: {
    flex: 1,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
  },
  unit: { color: colors.textDim, fontSize: 18 },
  footer: { paddingBottom: spacing.lg },
});
