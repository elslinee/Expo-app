import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ThemeModeSelector } from "./ThemeModeSelector";
import { FontFamily } from "@/constants/FontFamily";

interface ThemeToggleItemProps {
  color: any;
}

export const ThemeToggleItem: React.FC<ThemeToggleItemProps> = ({ color }) => {
  const { themeMode, theme, setThemeMode } = useTheme();

  return (
    <View style={styles.container}>

      <View style={styles.selectorContainer}>
        <ThemeModeSelector
          currentMode={themeMode}
          theme={theme}
          onSelect={setThemeMode}
          color={color}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: FontFamily.bold,

  },
  description: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },
  selectorContainer: {
   
  },
});
