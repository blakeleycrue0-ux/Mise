import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  OnboardingScreen,
  GeneratingScreen,
} from '@/screens/onboarding';
import { MainTabs } from './MainTabs';
import { colors } from '@utils/theme';
import type { OnboardingStackParamList, RootStackParamList } from './types';

const Root = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="Steps" component={OnboardingScreen} />
      <OnboardingStack.Screen name="Generating" component={GeneratingScreen} />
    </OnboardingStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Root.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ground },
      }}
    >
      <Root.Screen name="Onboarding" component={OnboardingNavigator} />
      <Root.Screen name="Main" component={MainTabs} />
    </Root.Navigator>
  );
}
