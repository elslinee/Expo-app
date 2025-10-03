import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import ToggleTheme from "@/components/ToggleTheme";
import { useRouter } from "expo-router";
import { navigateToPage } from "@/utils/navigationUtils";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import GoBack from "@/components/GoBack";
import Svg, { Path } from "react-native-svg";
import {
  ColorSchemes,
  ColorSchemesList,
  ColorSchemeType,
} from "@/constants/ColorSchemes";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// أيقونة معلومات
const InfoIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// أيقونة السهم
const ArrowIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function Settings() {
  const router = useRouter();
  const { theme, colorScheme, setColorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <ScrollView
      style={{ flex: 1, paddingTop: 0, backgroundColor: color.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* قسم المظهر */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: FontFamily.bold,
            marginBottom: 12,
            paddingRight: 4,
            color: color.darkText,
          }}
        >
          المظهر
        </Text>

        <View
          style={{
            borderRadius: 16,
            borderWidth: 0,
            padding: 16,
            marginBottom: 8,

            backgroundColor: color.bg20,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ToggleTheme />
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={{ marginRight: 12, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: FontFamily.bold,
                    marginBottom: 4,
                    color: color.text,
                  }}
                >
                  الوضع الداكن
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: FontFamily.regular,
                    color: color.darkText,
                  }}
                >
                  تبديل بين الوضع الفاتح والداكن
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* قسم نمط الألوان */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: FontFamily.bold,
            marginBottom: 12,
            paddingRight: 4,
            color: color.darkText,
          }}
        >
          نمط الألوان
        </Text>

        <View
          style={{
            borderRadius: 16,
            borderWidth: 0,
            padding: 16,
            marginBottom: 8,
            backgroundColor: color.bg20,
          }}
        >
          {ColorSchemesList.map((scheme: ColorSchemeType) => {
            const schemeInfo = ColorSchemes[scheme];
            const isSelected = colorScheme === scheme;
            const schemeColors = getColors(theme, scheme)[theme];

            return (
              <Pressable
                key={scheme}
                onPress={() => setColorScheme(scheme)}
                android_ripple={{ color: color.primary20 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: scheme !== "nature" ? 1 : 0,
                  borderBottomColor: `${color.text}10`,
                }}
              >
                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: isSelected
                        ? FontFamily.bold
                        : FontFamily.medium,
                      color: isSelected ? color.text : color.darkText,
                    }}
                  >
                    {schemeInfo.nameAr}
                  </Text>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: schemeColors.primary,
                      marginRight: 12,
                      borderWidth: isSelected ? 3 : 2,
                      borderColor: isSelected
                        ? schemeColors.primary
                        : color.text + "30",
                    }}
                  />
                </View>
                {isSelected && (
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 99,
                      backgroundColor: schemeColors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesome5 name="check" size={16} color="white" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* قسم حول التطبيق */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: FontFamily.bold,
            marginBottom: 12,
            paddingRight: 4,
            color: color.darkText,
          }}
        >
          عام
        </Text>

        <Pressable
          onPress={() => navigateToPage("/about")}
          android_ripple={{ color: color.primary20 }}
          style={{
            borderRadius: 16,
            borderWidth: 0,
            padding: 16,
            marginBottom: 8,

            backgroundColor: color.bg20,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                flex: 1,
              }}
            >
              <InfoIcon color={color.primary} size={26} />
              <View style={{ marginRight: 12, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: FontFamily.bold,
                    marginBottom: 4,
                    color: color.text,
                  }}
                >
                  حول التطبيق
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: FontFamily.regular,
                    color: color.darkText,
                  }}
                >
                  معلومات عن تطبيق عين
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>

      {/* معلومات الإصدار */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 32,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: FontFamily.medium,
            marginBottom: 4,
            color: color.darkText,
          }}
        >
          الإصدار 1.0.0
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: FontFamily.regular,
            color: color.darkText,
          }}
        >
          جميع الحقوق محفوظة © 2025
        </Text>
      </View>
    </ScrollView>
  );
}
