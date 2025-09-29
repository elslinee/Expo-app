import { View, Text } from "react-native";
import React, { useState } from "react";

import {
  ElfajrIcon,
  ElshrokIcon,
  EldohrIcon,
  El3srIcon,
  ElmgrbIcon,
  El3shaIcon,
} from "@/constants/Icons";
import { usePrayerTimes } from "@/context/PrayerTimesContext";
import { formatTo12Hour } from "@/utils/formatTo12Hour";
import { isCurrentPrayerTime } from "@/utils/isCurrentPrayerTime";

export default function PrayerTimesComponent({ color }: { color: any }) {
  const { prayerTimes, loading } = usePrayerTimes();

  const prayers = [
    {
      name: "الفجر",
      icon: ElfajrIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Fajr || "") || "00:00",
      time24: prayerTimes?.timings?.Fajr || "00:00",
    },
    {
      name: "الشروق",
      icon: ElshrokIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Sunrise || "") || "00:00",
      time24: prayerTimes?.timings?.Sunrise || "00:00",
    },
    {
      name: "الظهر",
      icon: EldohrIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Dhuhr || "") || "00:00",
      time24: prayerTimes?.timings?.Dhuhr || "00:00",
    },
    {
      name: "العصر",
      icon: El3srIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Asr || "") || "00:00",
      time24: prayerTimes?.timings?.Asr || "00:00",
    },
    {
      name: "المغرب",
      icon: ElmgrbIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Maghrib || "") || "00:00",
      time24: prayerTimes?.timings?.Maghrib || "00:00",
    },
    {
      name: "العشاء",
      icon: El3shaIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Isha || "") || "00:00",
      time24: prayerTimes?.timings?.Isha || "00:00",
    },
  ];
  return (
    <View
      style={{ backgroundColor: `${color.primary}33` }}
      className="mt-3 h-[88px] "
    >
      <View className="flex h-full p-2  flex-row justify-around gap-2 items-center">
        {prayers.map((prayer, index) => {
          const isCurrentTime = isCurrentPrayerTime(
            prayer.time24,
            index,
            prayerTimes?.timings || {}
          );
          return (
            <View
              style={{
                backgroundColor: isCurrentTime ? color.primary : "transparent",
                borderRadius: 4,
              }}
              key={index}
              className={`flex flex-1 justify-center  h-full flex-col items-center `}
            >
              <prayer.icon
                width={18}
                height={18}
                color={isCurrentTime ? color.white : color.primary}
              />
              <Text
                className="font-light text-sm"
                style={{
                  color: isCurrentTime ? color.white : color.primary,
                }}
              >
                {prayer.name}
              </Text>
              <Text
                className="font-light text-[9px]"
                style={{
                  color: isCurrentTime ? color.white : color.primary,
                }}
              >
                {prayer.time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
