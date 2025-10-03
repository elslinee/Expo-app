import { Link, Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import Svg, { Path } from "react-native-svg";

// أيقونة 404
const NotFoundIcon = ({
  color,
  size = 120,
}: {
  color: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function NotFoundScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <>
      <Stack.Screen options={{ title: "غير موجود", headerShown: false }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: color.background,
        }}
      >
        {/* أيقونة */}
        <View
          style={{
            marginBottom: 32,
            padding: 24,
            borderRadius: 100,
            backgroundColor: color.bg20,
          }}
        >
          <NotFoundIcon color={color.primary} size={80} />
        </View>

        {/* العنوان */}
        <Text
          style={{
            fontSize: 32,
            fontFamily: FontFamily.bold,
            color: color.text,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          404
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontFamily: FontFamily.bold,
            color: color.darkText,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          الصفحة غير موجودة
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontFamily: FontFamily.regular,
            color: color.darkText,
            marginBottom: 32,
            textAlign: "center",
            lineHeight: 24,
            maxWidth: 300,
          }}
        >
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </Text>

        {/* زر العودة */}
        <Link href="/" asChild>
          <Pressable
            android_ripple={{ color: color.primary20 }}
            style={{
              backgroundColor: color.primary,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 14,
              minWidth: 200,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: color.white,
                fontSize: 16,
                fontFamily: FontFamily.bold,
              }}
            >
              العودة للرئيسية
            </Text>
          </Pressable>
        </Link>

        {/* نص إضافي */}
        <Text
          style={{
            fontSize: 13,
            fontFamily: FontFamily.regular,
            color: color.darkText,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          إذا كنت تعتقد أن هذا خطأ، يرجى المحاولة مرة أخرى
        </Text>
      </View>
    </>
  );
}
