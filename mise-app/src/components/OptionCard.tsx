import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, radius } from '@utils/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Single-line selectable option used throughout onboarding. */
export function OptionCard({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      {selected && <View style={styles.tick} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 11,
  },
  selected: { borderColor: colors.borderStrong, backgroundColor: colors.surfaceSel },
  pressed: { transform: [{ scale: 0.98 }] },
  label: { flex: 1, color: colors.white, fontWeight: '600', fontSize: 16 },
  tick: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.sage,
  },
});
