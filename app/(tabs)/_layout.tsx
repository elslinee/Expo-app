import React from "react";
import { Link, Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { Colors } from "@/constants/Colors";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { FontFamily } from "@/constants/FontFamily";
import { useTheme } from "@/context/ThemeContext";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: Colors[theme].background,
        },
        tabBarActiveTintColor: Colors[theme].primary,
        tabBarStyle: {
          height: 80,
          shadowColor: Colors[theme].border,
          borderWidth: 1,
          borderColor: Colors[theme].border,
          backgroundColor: Colors[theme].background,
        },

        headerShown: useClientOnlyValue(false, true),
        headerTitleAlign: "center",
        headerStyle: {
          shadowColor: Colors[theme].border,
          borderBottomColor: Colors[theme].border,
          backgroundColor: Colors[theme].background,
        },
        headerTitleStyle: {
          color: Colors[theme].text,
          fontFamily: FontFamily.regular,
          fontSize: 16,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.bold,
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="mosque" size={24} color={color} />
          ),
          headerRight: () => "",
        }}
      />
      <Tabs.Screen
        name="PrayerTimes"
        options={{
          title: "مواقيت الصلاة",
          tabBarIcon: ({ color }) => <TabBarIcon name="clock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
