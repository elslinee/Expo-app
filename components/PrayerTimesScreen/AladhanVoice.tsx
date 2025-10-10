import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { format, toZonedTime } from "date-fns-tz";
import { addHours } from "date-fns";

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePrayerTimes } from "@/context/PrayerTimesContext";
import {
  AladhanVoiceOnIcon,
  AladhanVoiceOffIcon,
  ElfajrIcon,
  ElshrokIcon,
  EldohrIcon,
  El3srIcon,
  ElmgrbIcon,
  El3shaIcon,
} from "@/constants/Icons";
import { formatTo12Hour } from "@/utils/formatTo12Hour";
import getNextPrayerTime from "@/utils/getNextPrayerTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import usePrayerNotifications from "@/utils/usePrayerNotifications";

export default function AladhanVoice({ color }: { color: any }) {
  const { prayerTimes } = usePrayerTimes();

  const [prayers, setPrayers] = useState([
    {
      name: "الفجر",
      icon: ElfajrIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Fajr || "") || "00:00",
      time24: prayerTimes?.timings?.Fajr || "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "الشروق",
      icon: ElshrokIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Sunrise || "") || "00:00",
      time24: prayerTimes?.timings?.Sunrise || "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "الظهر",
      icon: EldohrIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Dhuhr || "") || "00:00",
      time24: prayerTimes?.timings?.Dhuhr || "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "العصر",
      icon: El3srIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Asr || "") || "00:00",
      time24: prayerTimes?.timings?.Asr || "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "المغرب",
      icon: ElmgrbIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Maghrib || "") || "00:00",
      time24: prayerTimes?.timings?.Maghrib || "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "العشاء",
      icon: El3shaIcon,
      time: formatTo12Hour(prayerTimes?.timings?.Isha || "") || "00:00",
      time24: prayerTimes?.timings?.Isha || "00:00",
      aldhan: true,
      notification: true,
    },
  ]);
  const toggleNotification = (index: number) => {
    setPrayers((prevPrayers) => {
      const next = prevPrayers.map((prayer, i) =>
        i === index ? { ...prayer, notification: !prayer.notification } : prayer
      );
      try {
        AsyncStorage.setItem(
          "notificationSettings",
          JSON.stringify(next.map((p) => p.notification))
        );
      } catch (e) {
        console.warn("Failed to persist notificationSettings", e);
      }
      return next;
    });
  };
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedAdhanSettings = await AsyncStorage.getItem("adhanSettings");
        const savedNotificationSettings = await AsyncStorage.getItem(
          "notificationSettings"
        );

        setPrayers((prevPrayers) =>
          prevPrayers.map((prayer, index) => {
            let updatedPrayer = { ...prayer };

            if (savedAdhanSettings) {
              const parsedAdhanSettings = JSON.parse(savedAdhanSettings);
              updatedPrayer.aldhan =
                parsedAdhanSettings[index] !== undefined
                  ? parsedAdhanSettings[index]
                  : prayer.aldhan;
            }

            if (savedNotificationSettings) {
              const parsedNotificationSettings = JSON.parse(
                savedNotificationSettings
              );
              updatedPrayer.notification =
                parsedNotificationSettings[index] !== undefined
                  ? parsedNotificationSettings[index]
                  : prayer.notification;
            }

            return updatedPrayer;
          })
        );
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (prayerTimes?.timings) {
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer, index) => {
          const prayerKeys = [
            "Fajr",
            "Sunrise",
            "Dhuhr",
            "Asr",
            "Maghrib",
            "Isha",
          ];
          const time24 =
            prayerTimes.timings[
              prayerKeys[index] as keyof typeof prayerTimes.timings
            ] || "00:00";
          return {
            ...prayer,
            time: formatTo12Hour(time24) || "00:00",
            time24: time24,
          };
        })
      );
    }
  }, [prayerTimes?.timings]);

  // Map UI toggles to hook include map per prayer
  const includeMap = useMemo(
    () => ({
      Fajr: prayers[0]?.notification ?? true,
      Sunrise: prayers[1]?.notification ?? true,
      Dhuhr: prayers[2]?.notification ?? true,
      Asr: prayers[3]?.notification ?? true,
      Maghrib: prayers[4]?.notification ?? true,
      Isha: prayers[5]?.notification ?? true,
    }),
    [prayers]
  );

  // Schedule notifications according to toggles
  usePrayerNotifications(prayerTimes, { enabled: true, include: includeMap });

  // Get next prayer info
  const nextPrayerInfo = prayerTimes?.timings
    ? getNextPrayerTime(prayerTimes.timings)
    : null;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20  }}
    >
      <View
        style={{ gap: 24, paddingHorizontal: 16 }}
        className="flex flex-col"
      >
        {prayers.map((prayer, index) => {
          // Check if this prayer is the next prayer
          const isNextPrayer = nextPrayerInfo?.nextPrayer === prayer.name;

          return (
            <View
              style={{
                borderRadius: 16,
                backgroundColor: isNextPrayer ? `${color.primary}` : color.bg20,
              }}
              key={index}
              className="flex  relative p-4 flex-row items-center justify-between"
            >
              {isNextPrayer && (
                <View
                  style={{
                    position: "absolute",
                    top: -16,
                    left: 0,
                    backgroundColor: color.primary20,
                    padding: 4,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9.5,
                      color: color.darkText,
                      lineHeight: 16,
                    }}
                    className=" font-bold px-2 "
                  >
                    الصلاة التالية
                  </Text>
                </View>
              )}
              <View style={{ gap: 20 }} className="flex flex-row items-center">
                <prayer.icon
                  width={24}
                  height={24}
                  color={isNextPrayer ? color.white : `${color.black}`}
                />
                <Text
                  style={{
                    color: isNextPrayer ? color.background : `${color.black}`,
                  }}
                  className={`text-lg font-bold`}
                >
                  {prayer.name}
                </Text>
              </View>
              <View style={{ gap: 20 }} className="flex flex-row items-center">
                {/* {prayer.aldhan ? (
                  <TouchableOpacity onPress={() => changeAldhan(index)}>
                    <AladhanVoiceOnIcon
                      width={21}
                      height={21}
                      color={isNextPrayer ? color.primary : `${color.grey}`}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => changeAldhan(index)}>
                    <AladhanVoiceOffIcon
                      width={21}
                      height={21}
                      color={isNextPrayer ? color.primary : `${color.grey}`}
                    />
                  </TouchableOpacity>
                )} */}
                {prayer.notification ? (
                  <TouchableOpacity
                    onPress={() => {
                      toggleNotification(index);
                    }}
                  >
                    <Ionicons
                      name="notifications"
                      size={24}
                      color={
                        isNextPrayer ? color.background : `${color.primary}`
                      }
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => toggleNotification(index)}>
                    <Ionicons
                      name="notifications-off"
                      size={24}
                      color={
                        isNextPrayer
                          ? `${color.background}88`
                          : `${color.primary}88`
                      }
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={{
                    width: 50,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: isNextPrayer ? color.background : `${color.black}`,
                  }}
                  numberOfLines={1}
                  className={`overflow-hidden !text-nowrap text-ellipsis text-sm font-bold`}
                >
                  {prayer.time}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
