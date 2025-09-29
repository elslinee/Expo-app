import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface LoadingScreenProps {
  message?: string;
  showIcon?: boolean;
  iconName?: string;
  iconSize?: number;
  customIcon?: React.ReactNode;
}

export default function LoadingScreen({
  message = "جاري التحميل...",
  showIcon = true,
  iconName = "quran",
  iconSize = 48,
  customIcon,
}: LoadingScreenProps) {
  const { theme } = useTheme();
  const color = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.content}>
        {/* Icon */}
        {showIcon && (
          <View style={styles.iconContainer}>
            {customIcon ? (
              customIcon
            ) : (
              <FontAwesome5
                name={iconName}
                size={iconSize}
                color={color.primary}
                style={styles.icon}
              />
            )}
          </View>
        )}

        {/* Loading Indicator */}
        <ActivityIndicator
          size="large"
          color={color.primary}
          style={styles.spinner}
        />

        {/* Loading Message */}
        <Text style={[styles.message, { color: color.text }]}>{message}</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: color.text }]}>
          يرجى الانتظار...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 40,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.8,
  },
  icon: {
    opacity: 0.7,
  },
  spinner: {
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontFamily: FontFamily.medium,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    opacity: 0.7,
  },
});
