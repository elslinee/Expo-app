import { View, Text } from "react-native";
import React from "react";
import { ClockIcon } from "@/constants/Icons";
import { usePrayerTimes } from "@/context/PrayerTimesContext";
import { useRealTimeCountdown } from "@/utils/useRealTimeCountdown";

export default function ClockComponent({ color }: { color: any }) {
  const { prayerTimes } = usePrayerTimes();
  const timeData = useRealTimeCountdown(prayerTimes);

  const isPrayerTime = timeData?.isPrayerTime;

  if (!timeData && !prayerTimes) {
    return (
      <View className="px-6 pt-5 pb-6  flex justify-center items-center">
        <ClockIcon
          color={color.primary}
          color1={`${color.white}`}
          color2={`${color.white}83`}
          color3={color.black}
          width={129}
          height={129}
        />
        <View className="flex pt-5 flex-col items-center">
          <Text className="text-xs font-medium text-gray-500">
            جاري تحميل أوقات الصلاة...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className=" px-6 pb-4 pt-5 flex justify-center items-center">
      <ClockIcon
        color={isPrayerTime ? "#10B981" : color.primary}
        color1={`${color.white}`}
        color2={`${color.white}83`}
        color3={color.black}
        width={129}
        height={129}
      />
      <View className="flex pt-5 flex-col items-center gap-2">
        <View className="flex flex-row items-center gap-4">
          <View className="flex flex-col items-center">
            <Text style={{ color: color.text }} className="text-xs font-medium">
              {" "}
              الوقت المتبقي
            </Text>
            <Text
              style={{ color: isPrayerTime ? "#10B981" : color.primary }}
              className="text-xs font-bold"
            >
              لصلاة {timeData?.nextPrayer || "غير متوفر"}
            </Text>
          </View>
          <Text
            style={{ color: isPrayerTime ? "#10B981" : color.primary }}
            className="text-lg font-bold"
          >
            {timeData?.timeRemaining || "00:00:00"}
          </Text>
        </View>

        {isPrayerTime && (
          <View className="bg-green-100 px-3 py-1 rounded-full mt-1">
            <Text className="text-green-800 text-xs font-bold">
              حان وقت الصلاة! 🕌
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
