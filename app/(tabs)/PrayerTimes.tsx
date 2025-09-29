import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import DateAndLocation from "@/components/homeScreen/DateAndLocation";
import ClockComponent from "@/components/PrayerTimesScreen/ClockComponent";
import AladhanVoice from "@/components/PrayerTimesScreen/AladhanVoice";

export default function PrayerTimes() {
  const { theme } = useTheme();
  const color = Colors[theme];
  return (
    <View className="flex-1">
      <DateAndLocation color={color} inHomeScreen={false} />
      <ClockComponent color={color} />
      <AladhanVoice color={color} />
    </View>
  );
}
