import React from "react";
import { View, Text, Pressable } from "react-native";
import ToggleTheme from "@/components/ToggleTheme";
import { useRouter } from "expo-router";
import { navigateToPage } from "@/utils/navigationUtils";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export default function Settings() {
  const router = useRouter();
  const { theme } = useTheme();
  const color = Colors[theme];

  return (
    <View className="flex-1 p-4">
      <View className="mb-6">
        <ToggleTheme />
      </View>

      <Pressable
        onPress={() => navigateToPage("/about")}
        style={{
          backgroundColor: color.background,
          borderColor: color.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: color.text,
            fontFamily: FontFamily.medium,
            fontSize: 16,
          }}
        >
          حول التطبيق
        </Text>
      </Pressable>
    </View>
  );
}
