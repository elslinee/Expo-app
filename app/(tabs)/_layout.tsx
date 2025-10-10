import React from "react";
import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useTheme } from "@/context/ThemeContext";
import CustomTabBar from "@/components/CustomTabBar";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

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
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="mosque" size={22} color={color} />
          ),
          headerRight: () => "",
        }}
      />
      <Tabs.Screen
        name="PrayerTimes"
        options={{
          title: "مواقيت الصلاة",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clock" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasbeeh"
        options={{
          title: "التسابيح",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="hands" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
