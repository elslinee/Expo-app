import { View, ScrollView } from "react-native";
import HeroSection from "@/components/homeScreen/HeroSection";
import PrayerTimesComponent from "@/components/homeScreen/PrayerTimesComponent";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import ScreenBtn from "@/components/homeScreen/ScreenBtn";
import { QuranIcon } from "@/constants/Icons";
import { navigateToPage } from "@/utils/navigationUtils";

export default function HomeScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
      <HeroSection color={color} />
      <PrayerTimesComponent color={color} />
      <View
        style={{
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
      </View>
    </ScrollView>
  );
}
