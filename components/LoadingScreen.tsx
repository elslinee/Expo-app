import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import AppLogo from "@/components/AppLogo";

interface LoadingScreenProps {
  message?: string;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
}

export default function LoadingScreen({
  message = "جاري التحميل...",
  showIcon = true,
  customIcon,
}: LoadingScreenProps) {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo scale and fade in animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color.background,
      }}
    >
      <View style={{ alignItems: "center", padding: 40 }}>
        {/* Logo */}
        {showIcon && (
          <Animated.View
            style={{
              marginBottom: 20,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {customIcon ? (
              customIcon
            ) : (
              <AppLogo
                size={120}
                primaryColor={color.primary}
                secondaryColor={color.focusColor}
                backgroundColor="transparent"
              />
            )}
          </Animated.View>
        )}

        {/* Rotating Circle Loader */}
        <Animated.View
          style={{
            width: 40,
            height: 40,
            borderRadius: 25,
            borderWidth: 3,
            borderTopColor: color.primary,
            borderRightColor: color.primary,
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
            marginBottom: 12,
            transform: [{ rotate }],
          }}
        />

        {/* Loading Message */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: FontFamily.bold,
            textAlign: "center",
            marginBottom: 8,
            color: color.darkText,
          }}
        >
          {message}
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: FontFamily.regular,
            textAlign: "center",
            color: color.darkText,
          }}
        >
          يرجى الانتظار...
        </Text>
      </View>
    </View>
  );
}
