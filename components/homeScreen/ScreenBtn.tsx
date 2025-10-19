import { Text, Pressable, Animated, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { FontFamily } from "@/constants/FontFamily";

export default function ScreenBtn({
  color,
  Icon,
  title,
  onPress,
  newTab,
}: {
  color: any;
  Icon: any;
  title: string;
  onPress?: () => void;
  newTab?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      style={{
        flex: 1,
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={{
          position: "relative",
          borderRadius: 16,
          borderWidth: 0,
          minHeight: 120,
          backgroundColor: pressed ? color.primary : color.primary20,
          transform: [{ scale }],
        }}
        className="flex  p-3   border justify-center     items-center gap-1"
      >
        {newTab && (
          <View
            style={{
              position: "absolute",
              top: -10,
              left: -5,
              zIndex: 10,
              backgroundColor: color.focusColor,
              paddingHorizontal: 8,
              paddingVertical: 1,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: FontFamily.bold,
                color: "white",
              }}
            >
              جديد
            </Text>
          </View>
        )}
        <Icon
          color={pressed ? color.white : color.primary}
          width={55}
          height={55}
        />
        <Text
          style={{
            color: pressed ? color.white : color.primary,
            fontFamily: FontFamily.bold,
            fontSize: 16,
          }}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
