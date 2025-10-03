import { View, ScrollView } from "react-native";
import HeroSection from "@/components/homeScreen/HeroSection";
import PrayerTimesComponent from "@/components/homeScreen/PrayerTimesComponent";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import ScreenBtn from "@/components/homeScreen/ScreenBtn";
import { QuranIcon, TasbeehIcon } from "@/constants/Icons";
import { useRouter } from "expo-router";
import { navigateToPage } from "@/utils/navigationUtils";

export default function HomeScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
      <HeroSection color={color} />
      <PrayerTimesComponent color={color} />
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          paddingHorizontal: 16,
          marginTop: 24,
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
          title="التسبيح"
          Icon={TasbeehIcon}
          onPress={() => router.push("/tasbeeh")}
        />
      </View>
    </ScrollView>
  );
}
