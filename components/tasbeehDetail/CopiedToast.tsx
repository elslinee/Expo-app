import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Animated } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface CopiedToastProps {
  visible: boolean;
  animValue: Animated.Value;
  color: any;
}

export const CopiedToast: React.FC<CopiedToastProps> = ({
  visible,
  animValue,
  color,
}) => {
  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: color.primary + "F0",
            shadowColor: color.primary,
          },
        ]}
      >
        <Text style={[styles.text, { color: color.white }]}>تم النسخ ✓</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  toast: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: "#FFFFFF",
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
});
