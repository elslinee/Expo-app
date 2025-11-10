import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Animated } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { TasbeehItem } from "./types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CounterCircleProps {
  item: TasbeehItem;
  progress: number;
  progressAnim: Animated.Value;
  size: number;
  strokeWidth: number;
  color: string;
  completedColor: string;
  darkTextColor: string;
}

export const CounterCircle: React.FC<CounterCircleProps> = ({
  item,
  progress,
  progressAnim,
  size,
  strokeWidth,
  color,
  completedColor,
  darkTextColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  // Create animated strokeDashoffset that smoothly follows progressAnim
  const strokeDashoffset = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
        extrapolate: "clamp",
      }),
    [progressAnim, circumference]
  );

  return (
    <View
      style={{
        position: "relative",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background circle */}
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={"transparent"}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>
      {/* Animated progress circle */}
      <Animated.View style={{ position: "absolute" }}>
        <Svg width={size} height={size}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progress >= 1 ? completedColor : color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </Animated.View>
      {/* Text content */}
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          style={[
            styles.count,
            {
              color: progress >= 1 ? completedColor : color,
              fontSize: size === 150 ? 50 : 64,
              lineHeight: size === 150 ? 50 : 64,
            },
          ]}
        >
          {item.count}
        </Text>
        <Text
          style={[
            styles.goal,
            {
              fontSize: size === 150 ? 12 : 14,
              color: darkTextColor,
            },
          ]}
        >
          {item.dailyGoal}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  count: {
    fontFamily: FontFamily.black,
  },
  goal: {
    marginTop: 6,
    opacity: 0.9,
    fontFamily: FontFamily.medium,
  },
});
