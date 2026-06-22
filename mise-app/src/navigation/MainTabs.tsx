import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/screens/HomeScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';
import { colors } from '@utils/theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Tab labels stand in for icons until the icon set lands. */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.ground },
        headerTintColor: colors.white,
        tabBarStyle: { backgroundColor: colors.oliveDeep, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.sage,
        tabBarInactiveTintColor: colors.inkSoft,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Coach">
        {() => (
          <PlaceholderScreen
            title="Cooking Coach"
            blurb="Step-by-step guided recipes that teach technique and the why behind every meal. The core module — built on request."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Planner">
        {() => (
          <PlaceholderScreen
            title="Meal Planner"
            blurb="Adaptive daily and weekly plans that recalculate macros as you progress."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Companion">
        {() => (
          <PlaceholderScreen
            title="Your Companion"
            blurb="An animated dog that evolves with your cooking and eating habits. Powered by the PetState engine."
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
