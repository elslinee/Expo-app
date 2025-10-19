import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { FontFamily } from "@/constants/FontFamily";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TabItem({
  index,
  label,
  options,
  isFocused,
  onPress,
  onLongPress,
  reportLayout,
  selectedIndex,
  colorTheme,
  newTab,
  newFeature,
}: {
  index: number;
  label: string | undefined;
  options: any;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  reportLayout: (idx: number, x: number, width: number) => void;
  selectedIndex: Animated.SharedValue<number>;
  colorTheme: any;
  newTab?: boolean;
  newFeature?: boolean;
}) {
  const liftStyle = useAnimatedStyle(() => {
    const focused = selectedIndex.value === index;
    return {
      transform: [
        {
          translateY: withSpring(focused ? -4 : 0, {
            damping: 16,
            stiffness: 180,
            mass: 0.3,
            velocity: 0,
            overshootClamping: false,
          }),
        },
      ],
    };
  });

  const bubbleStyle = useAnimatedStyle(() => {
    const focused = selectedIndex.value === index;
    return {
      transform: [
        {
          scale: withTiming(focused ? 1 : 0, {
            duration: 320,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          }),
        },
      ],
      opacity: withTiming(focused ? 1 : 0, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      activeOpacity={0.8}
      onLayout={(e) =>
        reportLayout(index, e.nativeEvent.layout.x, e.nativeEvent.layout.width)
      }
    >
      <Animated.View
        style={[
          liftStyle,
          {
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {newFeature && (
          <View
            style={{
              position: "absolute",
              top: 4,
              left: -0,
              zIndex: 10,
              backgroundColor: isFocused ? "transparent" : colorTheme.primary,

              borderRadius: 999,
              width: 13,
              height: 13,
            }}
          ></View>
        )}
        {newTab && (
          <View
            style={{
              position: "absolute",
              top: -14,
              right: 20,
              zIndex: 10,
              backgroundColor: colorTheme.focusColor,
              paddingHorizontal: 6,
              paddingVertical: 1,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: FontFamily.bold,
                color: "white",
              }}
            >
              جديد
            </Text>
          </View>
        )}
        <View
          style={{
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 72,
                height: 43,
                borderRadius: 9999,
                backgroundColor: isFocused
                  ? `${colorTheme.primary}`
                  : "transparent",
              },
              bubbleStyle,
            ]}
          />
          {typeof options.tabBarIcon === "function"
            ? options.tabBarIcon({
                focused: isFocused,
                color: isFocused
                  ? colorTheme.tabIconSelected
                  : colorTheme.tabIconDefault,
                size: 24,
              })
            : null}
        </View>
      </Animated.View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          marginTop: 4,
          fontFamily: isFocused ? FontFamily.bold : FontFamily.bold,
          fontSize: 11,
          lineHeight: 14,
          color: isFocused ? colorTheme.primary : colorTheme.tabIconDefault,
          textAlign: "center",
        }}
      >
        {label as string}
      </Text>
    </TouchableOpacity>
  );
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme, colorScheme } = useTheme();
  const colorTheme = getColors(theme, colorScheme)[theme];

  const [positions, setPositions] = useState<number[]>([]);
  const [widths, setWidths] = useState<number[]>([]);
  const [hiddenFeatures, setHiddenFeatures] = useState<Set<string>>(new Set());
  const containerWidth = useSharedValue(0);
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);
  const selectedIndex = useSharedValue(state.index);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
    // item sizes measured per tab
  };

  // Load hidden features from storage
  const loadHiddenFeatures = async () => {
    try {
      const stored = await AsyncStorage.getItem("hiddenNewFeatures");
      if (stored) {
        const hiddenArray = JSON.parse(stored);
        setHiddenFeatures(new Set(hiddenArray));
      }
    } catch (error) {
      console.error("Error loading hidden features:", error);
    }
  };

  // Save hidden features to storage
  const saveHiddenFeatures = async (routeName: string) => {
    try {
      const newHiddenFeatures = new Set(hiddenFeatures);
      newHiddenFeatures.add(routeName);
      setHiddenFeatures(newHiddenFeatures);

      const hiddenArray = Array.from(newHiddenFeatures);
      await AsyncStorage.setItem(
        "hiddenNewFeatures",
        JSON.stringify(hiddenArray)
      );
    } catch (error) {
      console.error("Error saving hidden features:", error);
    }
  };

  // Load hidden features on mount
  useEffect(() => {
    loadHiddenFeatures();
  }, []);

  useEffect(() => {
    selectedIndex.value = state.index;
    const targetX = positions[state.index];
    const targetW = widths[state.index];
    if (typeof targetX === "number" && typeof targetW === "number") {
      indicatorX.value = withTiming(targetX, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
      indicatorW.value = withTiming(targetW, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [state.index, positions, widths]);

  const reportLayout = (idx: number, x: number, width: number) => {
    setPositions((prev) => {
      const next = prev.slice();
      next[idx] = x;
      return next;
    });
    setWidths((prev) => {
      const next = prev.slice();
      next[idx] = width;
      return next;
    });

    if (idx === state.index) {
      indicatorX.value = withTiming(x, { duration: 0 });
      indicatorW.value = withTiming(width, { duration: 0 });
    }
  };

  return (
    <View
      onLayout={onContainerLayout}
      style={{
        backgroundColor: colorTheme.text,
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 80,
          width: "100%",
          backgroundColor: colorTheme.background,
          borderWidth: 0,
          overflow: "visible",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 25,
          paddingBottom: 16,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;
          const newTab = (options as any).newTab || false;
          const newFeature = (options as any).newFeature || false;
          const shouldShowNewFeature =
            newFeature && !hiddenFeatures.has(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              // Hide the newFeature indicator when user clicks on the tab
              if (newFeature) {
                saveHiddenFeatures(route.name);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              index={index}
              label={label as string}
              options={options}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              reportLayout={reportLayout}
              selectedIndex={selectedIndex}
              colorTheme={colorTheme}
              newTab={newTab}
              newFeature={shouldShowNewFeature}
            />
          );
        })}
      </View>
    </View>
  );
}
