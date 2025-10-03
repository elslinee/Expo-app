import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Share,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface FavoriteAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

interface AyahModalProps {
  visible: boolean;
  onClose: () => void;
  ayah: Ayah | FavoriteAyah | null;
  surahName?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRemoveFromFavorites?: () => void;
  showRemoveButton?: boolean;
}

export default function AyahModal({
  visible,
  onClose,
  ayah,
  surahName,
  isFavorite = false,
  onToggleFavorite,
  onRemoveFromFavorites,
  showRemoveButton = false,
}: AyahModalProps) {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  const handleShare = async () => {
    if (!ayah) return;

    try {
      const ayahInfo = getAyahInfo();
      const message = `${ayah.text}\n\n${ayahInfo.surahName} - الآية ${ayahInfo.ayahNumber}`;

      await Share.share({
        message,
        title: `آية من القرآن الكريم`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const getAyahInfo = () => {
    if (!ayah) return { surahName: "", ayahNumber: 0 };

    if ("surahName" in ayah) {
      // FavoriteAyah type
      return {
        surahName: ayah.surahName,
        ayahNumber: ayah.ayahNumber,
      };
    } else {
      // Ayah type
      return {
        surahName: surahName || "",
        ayahNumber: ayah.numberInSurah,
      };
    }
  };

  const ayahInfo = getAyahInfo();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",

          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: color.background,
            borderRadius: 16,
            padding: 20,
            margin: 20,
            minWidth: "85%",
            maxWidth: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* Ayah Text */}
          <Text
            style={{
              fontSize: 20,
              letterSpacing: 5,
              marginBottom: 16,
              color: color.text,
              fontFamily: FontFamily.quran,
            }}
          >
            {ayah?.text}
          </Text>

          {/* Surah and Ayah Info */}
          <Text
            style={{
              fontSize: 14,
              fontFamily: FontFamily.medium,
              textAlign: "center",
              marginBottom: 20,
              color: color.text,
              opacity: 0.7,
            }}
          >
            {surahName
              ? ` ${surahName} - الآية ${ayahInfo.ayahNumber}`
              : ` ${ayahInfo.surahName} - الآية ${ayahInfo.ayahNumber}`}
          </Text>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Share Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: color.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                width: "50%",

                justifyContent: "center",
              }}
              onPress={() => {
                handleShare();
                onClose();
              }}
            >
              <FontAwesome5 name="share" size={13} color={color.white} />
              <Text
                style={{
                  color: color.white,
                  fontFamily: FontFamily.medium,
                  marginLeft: 8,
                  fontSize: 11,
                }}
              >
                مشاركة
              </Text>
            </TouchableOpacity>

            {/* Favorite/Remove Button */}
            {showRemoveButton ? (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#ff4444",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  width: "50%",

                  justifyContent: "center",
                }}
                onPress={() => {
                  if (onRemoveFromFavorites) {
                    onRemoveFromFavorites();
                  }
                  onClose();
                }}
              >
                <FontAwesome5
                  name="heart-broken"
                  size={13}
                  color={color.white}
                />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: FontFamily.medium,
                    marginLeft: 8,
                    fontSize: 11,
                  }}
                >
                  إزالة
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isFavorite ? color.primary : color.primary20,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  width: "50%",
                  marginHorizontal: 4,
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (onToggleFavorite) {
                    onToggleFavorite();
                  }
                }}
              >
                <FontAwesome6
                  name={isFavorite ? "heart-circle-check" : "heart"}
                  size={13}
                  color={isFavorite ? color.white : color.text}
                />
                <Text
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    color: isFavorite ? color.white : color.text,
                    fontFamily: FontFamily.medium,
                    marginLeft: 8,
                    fontSize: 11,
                  }}
                >
                  {isFavorite ? "مفضلة" : "إضافة للمفضلة"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
