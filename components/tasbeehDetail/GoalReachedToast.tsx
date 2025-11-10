import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Animated, Easing } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface GoalReachedToastProps {
  visible: boolean;
  animValue: Animated.Value;
  color: any;
  completedColor: string;
}

export const GoalReachedToast: React.FC<GoalReachedToastProps> = ({
  visible,
  animValue,
  color,
  completedColor,
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
            backgroundColor: completedColor + "F0",
            shadowColor: completedColor,
          },
        ]}
      >
        <Text style={[styles.text, { color: color.white }]}>
          لقد وصلت للهدف اليومي!
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 135,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  toast: {
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    textAlign: "center",
    fontFamily: FontFamily.extraBold,
    fontSize: 18,
  },
});
