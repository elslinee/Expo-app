import { Text, Pressable, Animated } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

export default function ScreenBtn({
  color,
  Icon,
  title,
  onPress,
}: {
  color: any;
  Icon: any;
  title: string;
  onPress?: () => void;
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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={{
          borderRadius: 6,
          borderColor: color.primary,
          backgroundColor: pressed ? color.primary : color.background,
          transform: [{ scale }],
        }}
        className="flex p-3 min-w-[100px]  border justify-center     items-center gap-1"
      >
        <Icon
          color={pressed ? color.white : color.primary}
          width={55}
          height={55}
        />
        <Text
          style={{ color: pressed ? color.white : color.primary }}
          className=" font-bold text-sm   "
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
