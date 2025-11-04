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
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { captureRef } from "react-native-view-shot";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import GoBack from "@/components/GoBack";
import AppLogo from "@/components/AppLogo";
import Svg, { Circle } from "react-native-svg";
import { useAudioPlayer } from "expo-audio";
import { FontAwesome5 } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
  totalCount?: number;
  lastUsedDate?: string;
  history?: { date: string; count: number }[];
};

const STORAGE_KEY = "TASBEEH_LIST_V2";
const SOUND_ENABLED_KEY = "tasbeeh_sound_enabled";

export default function TasbeehDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colorScheme } = useTheme();
  const themeColors = getColors(theme, colorScheme)[theme];
  const [item, setItem] = useState<TasbeehItem | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [showResetModal, setShowResetModal] = useState(false);
  const [showGoalReached, setShowGoalReached] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const goalToastAnim = useRef(new Animated.Value(0)).current;
  const copiedAnim = useRef(new Animated.Value(0)).current;
  const counterViewRef = useRef<View>(null);
  const buttonViewRef = useRef<View>(null);
  const completedDailyGoalColor = themeColors.focusColor;

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);
  const tapSoundPlayer = useAudioPlayer(require("@/assets/audios/click.mp3"));
  // Get screen dimensions for responsive design
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const isSmallScreen = screenWidth < 300 || screenHeight < 800;

  // Calculate progress
  const progress = useMemo(() => {
    if (!item || item.dailyGoal <= 0) return 0;
    return Math.min(item.count / item.dailyGoal, 1);
  }, [item]);

  // Load saved sound preference on mount
  useEffect(() => {
    const loadSoundPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
        if (saved !== null) {
          const enabled = saved === "true";
          setSoundEnabled(enabled);
          soundEnabledRef.current = enabled;
        }
      } catch (error) {
        // Use default value if loading fails
      }
    };
    loadSoundPreference();
  }, []);

  // Toggle sound on/off - instant update
  const toggleSound = useCallback(() => {
    // Update ref first for instant response
    soundEnabledRef.current = !soundEnabledRef.current;
    const newValue = soundEnabledRef.current;

    // Update state for UI (non-blocking)
    setSoundEnabled(newValue);

    // Save to AsyncStorage (non-blocking)
    AsyncStorage.setItem(SOUND_ENABLED_KEY, String(newValue)).catch(() => {
      // Silently fail if save fails
    });

    // Test sound immediately if turning on
    if (newValue && tapSoundPlayer) {
      try {
        tapSoundPlayer.seekTo(0);
        tapSoundPlayer.play();
      } catch (error) {
        // Silently fail
      }
    }
  }, [tapSoundPlayer]);

  // Play tap sound function - optimized for fast clicks
  // Uses ref to get the latest value instantly
  const playTapSound = useCallback(() => {
    if (!tapSoundPlayer || !soundEnabledRef.current) return;

    try {
      // Reset to beginning immediately for instant response
      tapSoundPlayer.seekTo(0);
      // Play immediately without blocking
      tapSoundPlayer.play();
    } catch (error) {
      // Silently fail if audio is not available
    }
  }, [tapSoundPlayer]);

  useEffect(() => {
    const load = async () => {
      // Try to migrate from V1 if needed
      const oldData = await AsyncStorage.getItem("TASBEEH_LIST_V1");
      if (oldData && !(await AsyncStorage.getItem(STORAGE_KEY))) {
        try {
          const oldItems: TasbeehItem[] = JSON.parse(oldData);
          const migratedItems = oldItems.map((item) => ({
            ...item,
            totalCount: item.count || 0,
            lastUsedDate: new Date().toISOString().split("T")[0],
            history:
              item.count > 0
                ? [
                    {
                      date: new Date().toISOString().split("T")[0],
                      count: item.count,
                    },
                  ]
                : [],
          }));
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(migratedItems)
          );
        } catch {}
      }

      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      try {
        const list: TasbeehItem[] = JSON.parse(saved) || [];
        let found = list.find((it) => it.id === id);

        if (found) {
          // Reset daily count if it's a new day
          const today = new Date().toISOString().split("T")[0];
          if (found.lastUsedDate && found.lastUsedDate !== today) {
            found = { ...found, count: 0 };
            // Update storage
            const updatedList = list.map((it) => (it.id === id ? found : it));
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(updatedList)
            );
          }

          setItem(found);
          const initialProgress =
            found.dailyGoal > 0
              ? Math.min(found.count / found.dailyGoal, 1)
              : 0;
          progressAnim.setValue(initialProgress);
        }
      } catch {}
    };
    load();
  }, [id, progressAnim]);

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

  // const playSound = useCallback(async () => {
  //   try {
  //     if (soundRef.current) {
  //       // إيقاف الصوت السابق إذا كان يعمل ثم تشغيل من البداية
  //       await soundRef.current.stopAsync();
  //       await soundRef.current.setPositionAsync(0);
  //       await soundRef.current.playAsync();
  //     }
  //   } catch (error) {
  //     console.error("Error playing sound:", error);
  //   }
  // }, []);

  const increment = useCallback(() => {
    if (!item) return;

    // Play sound immediately (non-blocking, fire and forget)
    playTapSound();

    playPressAnimation();

    const today = new Date().toISOString().split("T")[0];
    const currentTotalCount = (item.totalCount || 0) + 1;
    const history = item.history || [];

    // Update or add today's entry in history
    const todayIndex = history.findIndex((h) => h.date === today);
    let updatedHistory;
    if (todayIndex >= 0) {
      updatedHistory = history.map((h, i) =>
        i === todayIndex ? { ...h, count: h.count + 1 } : h
      );
    } else {
      updatedHistory = [...history, { date: today, count: 1 }];
    }

    const next = {
      ...item,
      count: item.count + 1,
      totalCount: currentTotalCount,
      lastUsedDate: today,
      history: updatedHistory,
    };
    const newProgress =
      item.dailyGoal > 0 ? Math.min(next.count / item.dailyGoal, 1) : 0;

    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Check if goal reached - show toast notification
    if (next.count === item.dailyGoal && item.dailyGoal > 0) {
      setShowGoalReached(true);
      Animated.sequence([
        Animated.timing(goalToastAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.delay(2000),
        Animated.timing(goalToastAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => {
        setShowGoalReached(false);
        goalToastAnim.setValue(0);
      });
    }

    setItem(next);
    persist(next);
  }, [
    item,
    persist,
    playPressAnimation,
    progressAnim,
    goalToastAnim,
    playTapSound,
  ]);

  const reset = useCallback(() => {
    if (!item) return;
    setShowResetModal(true);
  }, [item]);

  const confirmReset = useCallback(() => {
    if (!item) return;
    const next = { ...item, count: 0 };

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    setItem(next);
    persist(next);
    setShowResetModal(false);
  }, [item, persist, progressAnim]);

  const cancelReset = useCallback(() => {
    setShowResetModal(false);
  }, []);

  const shareCounter = useCallback(async () => {
    if (!item || !counterViewRef.current) return;

    try {
      // Wait a bit to ensure the view is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Capture the counter view as base64 data URI
      const dataUri = await captureRef(counterViewRef.current, {
        format: "png",
        quality: 1,
        result: "data-uri",
      });

      // Extract base64 data
      const base64Data = dataUri.split(",")[1];

      // Create a file path in cache directory
      const fileName = `tasbeeh_${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Write the base64 data to file
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Share the file with proper MIME type
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "مشاركة صورة التسبيح",
          UTI: "public.png", // iOS only
        });
      } else {
        // Fallback: copy to clipboard
        await Clipboard.setStringAsync(item.name);
      }
    } catch (error) {
      console.error("Error sharing counter:", error);
      // Fallback: copy to clipboard on error
      try {
        await Clipboard.setStringAsync(item.name);
      } catch (e) {
        console.error("Error copying to clipboard:", e);
      }
    }
  }, [item]);

  const copyToClipboard = useCallback(async () => {
    if (!item) return;
    await Clipboard.setStringAsync(item.name);
    setShowCopied(true);
    Animated.sequence([
      Animated.timing(copiedAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.delay(1500),
      Animated.timing(copiedAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      setShowCopied(false);
      copiedAnim.setValue(0);
    });
  }, [item, copiedAnim]);

  const counterCardStyle = useMemo<ViewStyle>(
    () => ({
      width: "100%",
      minHeight: 140,
      borderRadius: 18,
      borderWidth: 0,
      backgroundColor: themeColors.bg20,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
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
            android_ripple={{ color: themeColors.primary20 }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: themeColors.bg20,
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "center",
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
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
        paddingTop: 65,
      }}
    >
      <GoBack
        style={{
          position: "absolute",
          left: 20,
          top: 70,
          zIndex: 10,
        }}
      />
      <View
        style={{
          justifyContent: "space-between",
          flex: 1,
          padding: 20,
          backgroundColor: themeColors.background,
        }}
      >
        <View
          style={{
            alignItems: "center",
            gap: 16,
            paddingTop: 40,
          }}
        >
          <View style={counterCardStyle}>
            {(() => {
              const size = isSmallScreen ? 150 : 200;
              const strokeWidth = isSmallScreen ? 12 : 16;
              const radius = (size - strokeWidth) / 2;
              const circumference = 2 * Math.PI * radius;

              return (
                <View
                  style={{
                    gap: isSmallScreen ? 18 : 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pressable
                    onLongPress={copyToClipboard}
                    style={{
                      maxHeight: 200,
                      width: "100%",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: themeColors.text,
                        fontFamily: FontFamily.black,
                        fontSize: isSmallScreen ? 17 : 20,
                        textAlign: "center",
                      }}
                      numberOfLines={isSmallScreen ? 3 : 4}
                      adjustsFontSizeToFit={true}
                      minimumFontScale={0.3}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                  <View
                    style={{
                      position: "relative",
                      width: size,
                      height: size,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Svg
                      width={size}
                      height={size}
                      style={{ position: "absolute" }}
                    >
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={"transparent"}
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                    </Svg>
                    <Animated.View style={{ position: "absolute" }}>
                      <Svg width={size} height={size}>
                        {/* Animated Progress Circle */}
                        <AnimatedCircle
                          cx={size / 2}
                          cy={size / 2}
                          r={radius}
                          stroke={
                            progress >= 1
                              ? completedDailyGoalColor
                              : themeColors.primary
                          }
                          strokeWidth={strokeWidth}
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [circumference, 0],
                          })}
                          strokeLinecap="round"
                          transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                      </Svg>
                    </Animated.View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text
                        style={{
                          color:
                            progress >= 1
                              ? completedDailyGoalColor
                              : themeColors.primary,
                          fontFamily: FontFamily.black,
                          fontSize: isSmallScreen ? 50 : 64,
                          lineHeight: isSmallScreen ? 50 : 64,
                        }}
                      >
                        {item.count}
                      </Text>
                      <Text
                        style={{
                          marginTop: 6,
                          opacity: 0.9,
                          color: themeColors.darkText,
                          fontFamily: FontFamily.medium,
                          fontSize: isSmallScreen ? 12 : 14,
                        }}
                      >
                        {item.dailyGoal}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <TouchableOpacity
                      onPress={shareCounter}
                      style={[
                        {
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                        },
                      ]}
                    >
                      <FontAwesome5
                        name={"share-alt"}
                        size={18}
                        color={
                          progress >= 1
                            ? completedDailyGoalColor
                            : themeColors.primary
                        }
                      />
                    </TouchableOpacity>
                    <Pressable
                      onPress={reset}
                      style={{ width: "60%" }}
                      android_ripple={{ color: themeColors.primary20 }}
                    >
                      <View
                        style={{
                          height: isSmallScreen ? 40 : 48,
                          borderRadius: 99,
                          backgroundColor:
                            progress >= 1
                              ? completedDailyGoalColor
                              : themeColors.primary,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: themeColors.background,
                            fontFamily: FontFamily.bold,
                            fontSize: isSmallScreen ? 12 : 15,
                          }}
                        >
                          تصفير
                        </Text>
                      </View>
                    </Pressable>
                    <TouchableOpacity
                      onPress={toggleSound}
                      style={[
                        {
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                        },
                      ]}
                    >
                      <FontAwesome5
                        name={soundEnabled ? "volume-up" : "volume-mute"}
                        size={18}
                        color={
                          progress >= 1
                            ? completedDailyGoalColor
                            : themeColors.primary
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Hidden View for screenshot with logo - only visible when capturing */}
        <View
          ref={counterViewRef}
          collapsable={false}
          style={{
            position: "absolute",
            left: -9999,
            top: -9999,
            opacity: 0,
            pointerEvents: "none",
            gap: isSmallScreen ? 18 : 32,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: themeColors.bg20,
            borderRadius: 18,
            paddingVertical: 24,
            paddingHorizontal: 20,
          }}
        >
          {item &&
            (() => {
              const size = isSmallScreen ? 150 : 200;
              const strokeWidth = isSmallScreen ? 12 : 16;
              const radius = (size - strokeWidth) / 2;
              const circumference = 2 * Math.PI * radius;
              const currentProgress =
                item.dailyGoal > 0
                  ? Math.min(item.count / item.dailyGoal, 1)
                  : 0;

              return (
                <>
                  <Text
                    style={{
                      color: themeColors.text,
                      fontFamily: FontFamily.black,
                      fontSize: isSmallScreen ? 17 : 20,
                      textAlign: "center",
                    }}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.3}
                  >
                    {item.name}
                  </Text>
                  {/* App Logo for shared image */}
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 12,
                    }}
                  >
                    <AppLogo
                      size={60}
                      primaryColor={themeColors.primary}
                      secondaryColor={completedDailyGoalColor}
                      backgroundColor="transparent"
                    />
                  </View>
                </>
              );
            })()}
        </View>

        <View style={{ gap: 12, paddingBottom: 16, paddingTop: 16 }}>
          {(() => {
            const bottomButtonSize = isSmallScreen ? 150 : 170;
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
                onPress={progress >= 1 ? confirmReset : increment}
                style={{ alignSelf: "center" }}
              >
                <View
                  ref={buttonViewRef}
                  collapsable={false}
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
                      backgroundColor:
                        progress >= 1
                          ? completedDailyGoalColor
                          : themeColors.primary,
                      opacity: pulseOpacity,
                      transform: [{ scale: pulseScale }],
                    }}
                  />

                  <Animated.View
                    style={{
                      width: bottomButtonSize,
                      height: bottomButtonSize,
                      borderRadius: bottomButtonSize / 2,
                      backgroundColor:
                        progress >= 1
                          ? completedDailyGoalColor
                          : themeColors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      transform: [{ scale: scaleAnim }],
                      gap: 8,
                    }}
                  >
                    {progress >= 1 ? (
                      <>
                        <FontAwesome5
                          name="redo"
                          size={24}
                          color={themeColors.white}
                        />
                        <Text
                          style={{
                            color: themeColors.white,
                            fontFamily: FontFamily.black,
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          اعاده البدا
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={{
                          color: themeColors.white,
                          fontFamily: FontFamily.black,
                          fontSize: 20,
                        }}
                      >
                        سبِّح
                      </Text>
                    )}
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
            backgroundColor: themeColors.background + "99",
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
                color: themeColors.darkText,
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
                android_ripple={{ color: themeColors.primary20 }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: themeColors.primary,
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
                android_ripple={{ color: themeColors.primary20 }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 14,
                    borderWidth: 0,
                    backgroundColor: themeColors.bg20,
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

      {/* Copied Animation */}
      {showCopied && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 120,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            opacity: copiedAnim,
            transform: [
              {
                translateY: copiedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.primary + "F0",
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 12,
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: themeColors.white,
                fontFamily: FontFamily.bold,
                fontSize: 14,
              }}
            >
              تم النسخ ✓
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Goal Reached Toast */}
      {showGoalReached && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 135,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            opacity: goalToastAnim,
            transform: [
              {
                translateY: goalToastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <View
            style={{
              backgroundColor: completedDailyGoalColor + "F0",
              marginHorizontal: 20,
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 12,
              shadowColor: completedDailyGoalColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: themeColors.white,
                fontFamily: FontFamily.extraBold,
                fontSize: 18,
              }}
            >
              ما شاء الله - وصلت للهدف اليومي!
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
