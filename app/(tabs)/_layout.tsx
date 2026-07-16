// Bottom navigation layout - notifications tab removed to eliminate redundancy
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import {
    borderRadius,
    palette,
    shadow,
    spacing,
    typography,
} from "@/constants/refugio";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.green,
        tabBarInactiveTintColor: palette.gray400,
        tabBarStyle: {
          backgroundColor: palette.white,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          ...shadow.md,
        },
        tabBarItemStyle: {
          borderRadius: borderRadius.xl,
          marginHorizontal: 2,
          paddingTop: spacing.xs,
        },
        tabBarLabelStyle: {
          ...typography.labelSmall,
          fontWeight: "600",
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: "Pets",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "paw" : "paw-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "",
          tabBarIcon: () => (
            <Ionicons
              size={28}
              name="add"
              color={palette.white}
              style={{
                backgroundColor: palette.green,
                borderRadius: borderRadius.full,
                height: 56,
                lineHeight: 56,
                marginBottom: spacing.md,
                overflow: "hidden",
                ...shadow.md,
                textAlign: "center",
                width: 56,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: "Visits",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Me",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
