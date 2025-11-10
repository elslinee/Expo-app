import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Animated, Easing } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { FontAwesome5 } from "@expo/vector-icons";

interface ActionButtonProps {
  progress: number;
  size: number;
  color: any;
  completedColor: string;
  onPress: () => void;
  pulseAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  progress,
  size,
  color,
  completedColor,
  onPress,
  pulseAnim,
  scaleAnim,
}) => {
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.6],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0],
  });

  return (
    <Pressable onPress={onPress} style={{ alignSelf: "center" }}>
      <View style={{ width: size, height: size }}>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: size / 2,
            backgroundColor: progress >= 1 ? completedColor : color.primary,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
        />

        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: progress >= 1 ? completedColor : color.primary,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: scaleAnim }],
            gap: 8,
          }}
        >
          {progress >= 1 ? (
            <>
              <FontAwesome5 name="redo" size={24} color={color.white} />
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: color.white,
                    fontSize: 16,
                  },
                ]}
              >
                اعاده البدا
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  color: color.white,
                  fontSize: 20,
                },
              ]}
            >
              سبِّح
            </Text>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: FontFamily.black,
    textAlign: "center",
  },
});
