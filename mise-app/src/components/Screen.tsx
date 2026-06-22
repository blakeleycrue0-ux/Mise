import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@utils/theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
}

/** App-wide page wrapper: dark ground, safe area, consistent padding. */
export function Screen({ children, scroll }: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Body
        style={styles.body}
        contentContainerStyle={scroll ? styles.scrollContent : undefined}
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  body: { flex: 1, paddingHorizontal: spacing.lg },
  scrollContent: { paddingVertical: spacing.lg, gap: spacing.md },
});
