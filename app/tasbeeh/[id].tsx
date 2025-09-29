import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  Pressable,
  ViewStyle,
  Animated,
  Easing,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
};

const STORAGE_KEY = "TASBEEH_LIST_V1";

export default function TasbeehDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = Colors[theme];
  const [item, setItem] = useState<TasbeehItem | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      try {
        const list: TasbeehItem[] = JSON.parse(saved) || [];
        const found = list.find((it) => it.id === id);
        if (found) setItem(found);
      } catch {}
    };
    load();
  }, [id]);

  const persist = useCallback(async (updated: TasbeehItem) => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    let list: TasbeehItem[] = [];
    try {
      list = saved ? JSON.parse(saved) : [];
    } catch {}
    const next = list.map((it) => (it.id === updated.id ? updated : it));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const playPressAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 140,
      }),
    ]).start();
  }, [scaleAnim]);

  const increment = useCallback(() => {
    if (!item) return;
    playPressAnimation();
    const next = { ...item, count: item.count + 1 };
    setItem(next);
    persist(next);
  }, [item, persist, playPressAnimation]);

  const reset = useCallback(() => {
    if (!item) return;
    setShowResetModal(true);
  }, [item]);

  const confirmReset = useCallback(() => {
    if (!item) return;
    const next = { ...item, count: 0 };
    setItem(next);
    persist(next);
    setShowResetModal(false);
  }, [item, persist]);

  const cancelReset = useCallback(() => {
    setShowResetModal(false);
  }, []);

  const counterCardStyle = useMemo<ViewStyle>(
    () => ({
      width: "100%",
      minHeight: 140,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.neutral,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    }),
    [themeColors]
  );

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  if (!item) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: themeColors.background,
        }}
      >
        <View style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
          <Pressable
            onPress={reset}
            android_ripple={{ color: themeColors.border }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: themeColors.background,
                borderWidth: 1,
                borderColor: themeColors.border,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: themeColors.black,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  color: themeColors.text,
                  fontFamily: FontFamily.bold,
                  fontSize: 16,
                }}
              >
                ↺
              </Text>
            </View>
          </Pressable>
        </View>
        <Text style={{ color: themeColors.text, fontFamily: FontFamily.bold }}>
          التسبيح غير موجود
        </Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: themeColors.background,
        }}
      >
        <View style={{ alignItems: "center", gap: 16, paddingTop: 46 }}>
          <Text
            style={{
              color: themeColors.text,
              fontFamily: FontFamily.black,
              fontSize: 24,
            }}
          >
            {item.name}
          </Text>

          <View style={counterCardStyle}>
            <Text
              style={{
                color: themeColors.primary,
                fontFamily: FontFamily.black,
                fontSize: 72,
              }}
            >
              {item.count}
            </Text>
            <Text
              style={{
                marginTop: 6,
                color: themeColors.grey,
                fontFamily: FontFamily.medium,
                fontSize: 14,
              }}
            >
              العدّاد
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Pressable
              onPress={reset}
              style={{ flex: 1 }}
              android_ripple={{ color: themeColors.border }}
            >
              <View
                style={{
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: themeColors.black,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: themeColors.white,
                    fontFamily: FontFamily.bold,
                    fontSize: 15,
                  }}
                >
                  تصفير
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ gap: 12, paddingBottom: 16 }}>
          {(() => {
            const bottomButtonSize = 180;
            const pulseScale = pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.6],
            });
            const pulseOpacity = pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.22, 0],
            });
            return (
              <Pressable
                onPress={increment}
                android_ripple={{ color: themeColors.border, radius: 100 }}
                style={{ alignSelf: "center" }}
              >
                <View
                  style={{ width: bottomButtonSize, height: bottomButtonSize }}
                >
                  <Animated.View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: bottomButtonSize / 2,
                      backgroundColor: themeColors.primary,
                      opacity: pulseOpacity,
                      transform: [{ scale: pulseScale }],
                    }}
                  />

                  <Animated.View
                    style={{
                      width: bottomButtonSize,
                      height: bottomButtonSize,
                      borderRadius: bottomButtonSize / 2,
                      backgroundColor: themeColors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      transform: [{ scale: scaleAnim }],
                      shadowColor: themeColors.black,
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.18,
                      shadowRadius: 22,
                      elevation: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: themeColors.white,
                        fontFamily: FontFamily.black,
                        fontSize: 20,
                      }}
                    >
                      سبِّح
                    </Text>
                  </Animated.View>
                </View>
              </Pressable>
            );
          })()}
        </View>
      </View>
      {showResetModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 18,
              backgroundColor: themeColors.background,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: themeColors.text,
                fontFamily: FontFamily.black,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              تأكيد التصفير
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: themeColors.grey,
                fontFamily: FontFamily.medium,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              هل تريد تصفير العداد؟ لا يمكن التراجع عن هذا الإجراء.
            </Text>
            <View
              style={{
                marginTop: 16,
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Pressable
                onPress={confirmReset}
                style={{ flex: 1 }}
                android_ripple={{ color: themeColors.border }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: themeColors.black,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.white,
                      fontFamily: FontFamily.bold,
                      fontSize: 15,
                    }}
                  >
                    تأكيد
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={cancelReset}
                style={{ flex: 1 }}
                android_ripple={{ color: themeColors.border }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.text,
                      fontFamily: FontFamily.bold,
                      fontSize: 15,
                    }}
                  >
                    إلغاء
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
