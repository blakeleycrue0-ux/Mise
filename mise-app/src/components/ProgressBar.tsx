import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@utils/theme';

/** value: 0..1 */
export function ProgressBar({ value }: { value: number }) {
  const w = `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` as const;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: w }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: 24,
  },
  fill: { height: '100%', backgroundColor: colors.sage },
});
