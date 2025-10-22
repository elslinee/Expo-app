import { View, ScrollView, Text } from "react-native";
import HeroSection from "@/components/homeScreen/HeroSection";
import PrayerTimesComponent from "@/components/homeScreen/PrayerTimesComponent";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import ScreenBtn from "@/components/homeScreen/ScreenBtn";
import { QuranIcon, AzkarIcon } from "@/constants/Icons";
import { navigateToPage } from "@/utils/navigationUtils";
import ChangelogModal from "@/components/ChangelogModal";

export default function HomeScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const CHANGELOG_KEY = "app_changelog_shown_v3"; // bump suffix on new releases

  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
      <HeroSection color={color} />
      <PrayerTimesComponent color={color} />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 24,
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
            color={color}
            title="القرآن الكريم"
            Icon={QuranIcon}
            onPress={() => navigateToPage("/quran")}
          />
          <ScreenBtn
            color={color}
            title="الأذكار"
            Icon={AzkarIcon}
            onPress={() => navigateToPage("/azkar")}
            newTab={true}
          />
        </View>
      </View>

      {/* First-run changelog modal */}
      <ChangelogModal
        changelogKey={CHANGELOG_KEY}
        version="الإصدار 0.5 بيتا"
        title="آخر التغييرات"
        changes={[
          "اضافة خاصية تغيير حجم الخط للقرآن",
          "إضافة نظام عداد الأذكار مع حفظ التقدم",
          "تحسين نظام التحميل التدريجي للقرآن",
          "تحسين الأداء العام للتطبيق",
        ]}
        color={color}
      />
    </ScrollView>
  );
}
