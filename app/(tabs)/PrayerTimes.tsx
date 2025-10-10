import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { View, ScrollView } from "react-native";
import DateAndLocation from "@/components/homeScreen/DateAndLocation";
import ClockComponent from "@/components/PrayerTimesScreen/ClockComponent";
import CountdownTimer from "@/components/PrayerTimesScreen/CountdownTimer";
import AladhanVoice from "@/components/PrayerTimesScreen/AladhanVoice";

export default function PrayerTimes() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: color.background }}
    >
      <CountdownTimer color={color} />
      <AladhanVoice color={color} />
    </ScrollView>
  );
}
