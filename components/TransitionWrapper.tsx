import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";

interface TransitionWrapperProps {
  children: React.ReactNode;
}

export default function TransitionWrapper({
  children,
}: TransitionWrapperProps) {
  const { theme } = useTheme();

  // خلفية فورية تطابق الـ theme
  const backgroundColor = getColors(theme, "warm").background;

  return (
    <View style={[styles.container, { backgroundColor }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
  },
});
