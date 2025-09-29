import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
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
  const { theme } = useTheme();
  const color = Colors[theme];

  const handleBookmarkPress = (e: any) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(ayah.numberInSurah);
    }
  };

  return (
    <TouchableOpacity
      key={ayah.numberInSurah}
      style={{
        backgroundColor: color.neutral,
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: "100%",
        borderWidth: 1,
        borderColor: color.border,
      }}
      onPress={() => onPress(ayah)}
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
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: `${color.primary}`,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#fff",
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
              fontFamily: FontFamily.bold,
              color: "#fff",
            }}
          >
            {ayah.numberInSurah}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontFamily: FontFamily.medium,
            lineHeight: 32,
            flex: 1,
            color: color.text,
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
  );
}
