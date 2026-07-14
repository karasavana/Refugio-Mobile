import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { palette } from '@/constants/refugio';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.green,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: palette.white,
          borderTopColor: palette.line,
          height: 88,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '800',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={29} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="paw-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: '',
          tabBarIcon: () => (
            <Ionicons
              size={42}
              name="add"
              color={palette.white}
              style={{
                backgroundColor: palette.green,
                borderRadius: 36,
                height: 72,
                lineHeight: 72,
                marginBottom: 26,
                overflow: 'hidden',
                shadowColor: palette.greenDark,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 1,
                shadowRadius: 0,
                textAlign: 'center',
                width: 72,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color }) => <Ionicons size={29} name="calendar-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => <Ionicons size={29} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
