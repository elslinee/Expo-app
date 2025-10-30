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
  // Stable keys to map times and toggles
  const PRAYER_KEYS = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ] as const;

  const [prayers, setPrayers] = useState([
    {
      name: "الفجر",
      icon: ElfajrIcon,
      time: "00:00",
      time24: "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "الشروق",
      icon: ElshrokIcon,
      time: "00:00",
      time24: "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "الظهر",
      icon: EldohrIcon,
      time: "00:00",
      time24: "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "العصر",
      icon: El3srIcon,
      time: "00:00",
      time24: "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "المغرب",
      icon: ElmgrbIcon,
      time: "00:00",
      time24: "00:00",
      aldhan: true,
      notification: true,
    },
    {
      name: "العشاء",
      icon: El3shaIcon,
      time: "00:00",
      time24: "00:00",
      aldhan: true,
      notification: true,
    },
  ]);
  const toggleNotification = async (index: number) => {
    setPrayers((prevPrayers) => {
      const next = prevPrayers.map((prayer, i) =>
        i === index ? { ...prayer, notification: !prayer.notification } : prayer
      );

      // Save settings asynchronously (scheduling handled centrally)
      const saveSettings = async () => {
        try {
          const notificationSettings = next.map((p) => p.notification);
          await AsyncStorage.setItem(
            "notificationSettings",
            JSON.stringify(notificationSettings)
          );
          console.log("✅ تم حفظ إعدادات الإشعارات:", notificationSettings);
        } catch (e) {
          console.error("❌ فشل حفظ إعدادات الإشعارات:", e);
        }
      };

      saveSettings();
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

        // Check if any notifications are disabled and cancel them immediately
        if (savedNotificationSettings) {
          const parsedNotificationSettings = JSON.parse(
            savedNotificationSettings
          );
          const hasDisabledNotifications = parsedNotificationSettings.some(
            (enabled: boolean) => enabled === false
          );

          if (hasDisabledNotifications) {
            // Cancel all notifications to ensure disabled ones don't fire
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log("🗑️ تم إلغاء الإشعارات المعطلة عند بدء التطبيق");
          }
        }
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
          const key = PRAYER_KEYS[index] as keyof typeof prayerTimes.timings;
          const time24 = prayerTimes.timings[key] || "00:00";
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
  const includeMap = useMemo(() => {
    const map: any = {};
    PRAYER_KEYS.forEach((k, i) => {
      map[k] = prayers[i]?.notification ?? true;
    });
    return map;
  }, [prayers]);

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
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
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
                <TouchableOpacity onPress={() => toggleNotification(index)}>
                  <Ionicons
                    name={
                      prayer.notification
                        ? "notifications"
                        : "notifications-off"
                    }
                    size={24}
                    color={isNextPrayer ? color.background : `${color.primary}`}
                    style={{ opacity: prayer.notification ? 1 : 0.5 }}
                  />
                </TouchableOpacity>
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
