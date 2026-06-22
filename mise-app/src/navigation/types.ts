import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/** Onboarding flow (pre-auth / setup). */
export type OnboardingStackParamList = {
  Welcome: undefined;
  Steps: undefined;
  Generating: undefined;
};

/** Main app tabs (post-onboarding). */
export type MainTabParamList = {
  Home: undefined;
  Coach: undefined;
  Planner: undefined;
  Companion: undefined;
};

/** Root switches between onboarding and the main app. */
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
