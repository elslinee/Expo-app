import { View, ScrollView, Text } from "react-native";
import HeroSection from "@/components/homeScreen/HeroSection";
import PrayerTimesComponent from "@/components/homeScreen/PrayerTimesComponent";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import ScreenBtn from "@/components/homeScreen/ScreenBtn";
import { QuranIcon, AzkarIcon, BookIcon } from "@/constants/Icons";
import { navigateToPage } from "@/utils/navigationUtils";
import ChangelogModal from "@/components/ChangelogModal";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export default function HomeScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const CHANGELOG_KEY = "app_changelog_shown_v4"; // bump suffix on new releases

  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
      <HeroSection color={color} />
      <PrayerTimesComponent color={color} />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 24,
          marginBottom: 24,
          gap: 12,
        }}
      >
        <View
          style={{
            flexDirection: "column",

            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <ScreenBtn
              style={{ flex: 1 }}
              color={color}
              title="القرآن الكريم"
              Icon={QuranIcon}
              onPress={() => navigateToPage("/quran")}
            />
            <ScreenBtn
              style={{ flex: 1 }}
              color={color}
              title="الأذكار"
              Icon={AzkarIcon}
              onPress={() => navigateToPage("/azkar")}
              newTab={true}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <ScreenBtn
              style={{
                flex: 1,

                pointerEvents: "none",
              }}
              iconWidth={45}
              iconHeight={45}
              color={color}
              title="المكتبة"
              Icon={BookIcon}
              onPress={() => ""}
              soon={true}
            />
            <ScreenBtn
              style={{
                flex: 1,
                opacity: 0,
                pointerEvents: "none",
              }}
              iconWidth={45}
              iconHeight={45}
              color={color}
              title="المكتبة"
              Icon={BookIcon}
              onPress={() => ""}
            />
          </View>
        </View>
      </View>

      {/* First-run changelog modal */}
      <ChangelogModal
        changelogKey={CHANGELOG_KEY}
        version="الإصدار 0.6 بيتا"
        title="آخر التغييرات"
        changes={[
          "إضافة ميزة التسابيح المكتملة",
          "إعادة تعيين تلقائي للعدادات كل يوم",
          "تحسين حجم النصوص والأزرار للشاشات المختلفة",
          "إصلاح موضع شريط التقدم ومشاكل العرض",
        ]}
        color={color}
      />
    </ScrollView>
  );
}
