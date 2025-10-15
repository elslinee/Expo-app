import React, { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontFamily } from "@/constants/FontFamily";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface AyahItemProps {
  ayah: Ayah;
  onPress: (ayah: Ayah) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (ayahNumber: number) => void;
}

export default function AyahItem({
  ayah,
  onPress,
  isBookmarked = false,
  onToggleBookmark,
}: AyahItemProps) {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const [showCopied, setShowCopied] = useState(false);
  const copiedAnim = useRef(new Animated.Value(0)).current;

  const toArabicDigits = (value: number | string) => {
    const str = String(value);
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/[0-9]/g, (d) => arabicDigits[Number(d)]);
  };

  const handleBookmarkPress = (e: any) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(ayah.numberInSurah);
    }
  };

  const copyToClipboard = useCallback(async () => {
    const textToCopy = ayah.translation
      ? `${ayah.text}\n\n${ayah.translation}`
      : ayah.text;

    await Clipboard.setStringAsync(textToCopy);
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
  }, [ayah, copiedAnim]);

  return (
    <View style={{ position: "relative", marginBottom: 8 }}>
      <TouchableOpacity
        key={ayah.numberInSurah}
        style={{
          backgroundColor: color.bg20,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 16,
          width: "100%",
          borderWidth: 0,
        }}
        onPress={() => onPress(ayah)}
        onLongPress={copyToClipboard}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              display: "flex",

              padding: 2,
              borderRadius: 99,

              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0,
              marginRight: 4,
            }}
          >
            <Text
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,

                fontFamily: FontFamily.bold,
                color: color.primary,
              }}
            >
              ﴿ {toArabicDigits(ayah.numberInSurah)} ﴾
            </Text>
          </View>

          <Text
            style={{
              fontSize: 19,
              fontFamily: FontFamily.quran,
              flex: 1,
              color: color.darkText,
            }}
          >
            {ayah.text}
          </Text>

          {onToggleBookmark && (
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 99,
                backgroundColor: isBookmarked ? color.primary : "transparent",
                borderWidth: 1,
                borderColor: isBookmarked ? color.primary : color.border,
                marginLeft: 8,
              }}
              onPress={handleBookmarkPress}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name="bookmark"
                size={14}
                color={isBookmarked ? color.white : color.text}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Copied Notification */}
      {showCopied && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -10,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            opacity: copiedAnim,
            transform: [
              {
                translateY: copiedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: color.primary + "F0",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              shadowColor: color.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: color.white,
                fontFamily: FontFamily.bold,
                fontSize: 12,
              }}
            >
              تم النسخ ✓
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
