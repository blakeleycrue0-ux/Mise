import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Screen, Button } from '@components';
import { colors, radius, spacing } from '@utils/theme';
import { signUp } from '@services/supabase';
import { useUserStore } from '@state/userStore';
import type { OnboardingStackScreenProps } from '@/navigation/types';

export function WelcomeScreen({ navigation }: OnboardingStackScreenProps<'Welcome'>) {
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStart = async () => {
    setLoading(true);
    setError(null);
    const { userId, error: e } = await signUp(email.trim(), password);
    setLoading(false);
    if (e) {
      setError(e);
      return;
    }
    setUser(userId);
    navigation.navigate('Steps');
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.brand}>MISE</Text>
        <Text style={styles.tagline}>Your cooking coach, in your pocket.</Text>
        <Text style={styles.sub}>
          Learn to cook, eat better, and grow your companion along the way.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.inkSoft}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.inkSoft}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.footer}>
        <Button label="LET'S GET YOU SET UP" onPress={onStart} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: 'center', gap: spacing.sm },
  brand: { color: colors.white, fontSize: 40, fontWeight: '800', letterSpacing: 2 },
  tagline: { color: colors.white, fontSize: 22, fontWeight: '700' },
  sub: { color: colors.textDim, fontSize: 15, lineHeight: 22 },
  form: { gap: spacing.sm, marginBottom: spacing.lg },
  input: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  error: { color: '#FF9A9A', fontSize: 13 },
  footer: { paddingBottom: spacing.lg },
});
