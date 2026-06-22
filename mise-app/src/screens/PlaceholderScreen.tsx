import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@components';
import { colors, spacing } from '@utils/theme';

/**
 * Generic "coming next" screen for modules that are scaffolded but built on
 * request (cooking coach, meal planner, companion, scanners).
 */
export function PlaceholderScreen({ title, blurb }: { title: string; blurb: string }) {
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.blurb}>{blurb}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  title: { color: colors.white, fontSize: 26, fontWeight: '800' },
  blurb: { color: colors.textDim, fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
