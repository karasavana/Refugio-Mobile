import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { palette } from '@/constants/refugio';
import Ionicons from '@expo/vector-icons/Ionicons';

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
          fontWeight: '700',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home-outline" color={color} />,
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
          tabBarIcon: ({ focused }) => (
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
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={29} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
