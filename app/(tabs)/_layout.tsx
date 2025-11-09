import React from "react";
import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useTheme } from "@/context/ThemeContext";
import CustomTabBar from "@/components/CustomTabBar";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const { theme, colorScheme } = useTheme();
  const Colors = getColors(theme, colorScheme);

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: Colors[theme].background,
        },
        tabBarActiveTintColor: Colors[theme].primary,
        tabBarStyle: { height: 64 },

        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          shadowColor: Colors[theme].border,
          borderBottomColor: Colors[theme].border,
          backgroundColor: Colors[theme].background,
        },
        headerTitleStyle: {
          color: Colors[theme].darkText,
          fontFamily: FontFamily.regular,
          fontSize: 18,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.bold,
          fontSize: 10,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={
          {
            title: "الرئيسية",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome5 name="mosque" size={22} color={color} />
            ),

            newFeature: false,
          } as any
        }
      />
      <Tabs.Screen
        name="PrayerTimes"
        options={
          {
            title: "مواقيت الصلاة",
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialCommunityIcons name="clock" size={25} color={color} />
            ),

            newFeature: false,
          } as any
        }
      />
      <Tabs.Screen
        name="tasbeeh"
        options={
          {
            title: "التسابيح",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome5 name="hands" size={24} color={color} />
            ),

            newFeature: false,
          } as any
        }
      />

      <Tabs.Screen
        name="Settings"
        options={
          {
            title: "الإعدادات",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="cog" size={24} color={color} />
            ),
            newFeature: true,
          } as any
        }
      />
    </Tabs>
  );
}
