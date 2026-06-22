import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, radius } from '@utils/theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ label, onPress, disabled, loading }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.btn,
        inactive && styles.inactive,
        pressed && !inactive && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: colors.flame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  inactive: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.97 }] },
});
