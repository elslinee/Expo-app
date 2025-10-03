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
import { FontFamily } from "@/constants/FontFamily";

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
    <View className="px-6 mt-4">
      <View
        style={{
          backgroundColor: `${color.primary}1A`,
          borderRadius: 16,
          padding: 8,
          overflow: "hidden",
        }}
        className="flex-row  "
      >
        {prayers.map((prayer, index) => {
          const isCurrentTime = isCurrentPrayerTime(
            prayer.time24,
            index,
            prayerTimes?.timings || {}
          );
          return (
            <View
              key={index}
              style={{
                backgroundColor: isCurrentTime ? color.primary : "transparent",
                borderRadius: 16,
                padding: 8,
                flex: 1,
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: 10,
                  fontFamily: FontFamily.medium,
                  color: isCurrentTime ? "white" : color.text20,
                }}
                numberOfLines={1}
              >
                {prayer.name}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: FontFamily.bold,
                  color: isCurrentTime ? "white" : color.darkText,
                }}
                numberOfLines={1}
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
