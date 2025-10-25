import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { toZonedTime, format } from "date-fns-tz";
import { addDays, isBefore } from "date-fns";
import usePushNotifications from "@/utils/usePushNotifications";
import type { PrayerTimesData } from "@/utils/prayerTimesService";

type PrayerKey = keyof PrayerTimesData["timings"];

const PRAYER_ORDER: PrayerKey[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

const PRAYER_TITLES: Record<PrayerKey, string> = {
  Fajr: "أذان صلاة الفجر",
  Sunrise: "أذان صلاة الشروق",
  Dhuhr: "أذان صلاة الظهر",
  Asr: "أذان صلاة العصر",
  Maghrib: "أذان صلاة المغرب",
  Isha: "أذان صلاة العشاء",
};

interface UsePrayerNotificationsOptions {
  enabled?: boolean;
  include?: Partial<Record<PrayerKey, boolean>>; // e.g., { Sunrise: false }
  titlePrefix?: string;
}

/**
 * Schedule local notifications for today's remaining prayers using API times.
 * Converts from API timezone (meta.timezone) to the device's local clock reliably.
 */
export default function usePrayerNotifications(
  prayerTimes: PrayerTimesData | null,
  options: UsePrayerNotificationsOptions = {}
) {
  // Ensure permissions/channel are set-up (returns token but we don't use it here)
  usePushNotifications();

  const lastIncludeRef = useRef<string>("");
  const lastTimingsRef = useRef<string>("");
  const isSchedulingRef = useRef(false);
  const { enabled = true, include = {}, titlePrefix } = options;

  useEffect(() => {
    if (!enabled || !prayerTimes?.timings || !prayerTimes?.meta?.timezone) {
      return;
    }

    const tz = prayerTimes.meta.timezone || "Africa/Cairo";
    const now = new Date();

    type IdMap = Partial<Record<PrayerKey, string>>;
    const IDS_KEY = "prayer_notification_ids_v1";

    const schedulePerPrayer = async () => {
      // Prevent concurrent executions
      if (isSchedulingRef.current) {
        return;
      }

      // Check if include map or timings have changed
      const currentInclude = JSON.stringify(include);
      const currentTimings = JSON.stringify({
        Fajr: prayerTimes.timings.Fajr,
        Sunrise: prayerTimes.timings.Sunrise,
        Dhuhr: prayerTimes.timings.Dhuhr,
        Asr: prayerTimes.timings.Asr,
        Maghrib: prayerTimes.timings.Maghrib,
        Isha: prayerTimes.timings.Isha,
      });

      // Only skip if both include map AND timings haven't changed
      if (
        lastIncludeRef.current === currentInclude &&
        lastTimingsRef.current === currentTimings
      ) {
        return;
      }

      isSchedulingRef.current = true;
      lastIncludeRef.current = currentInclude;
      lastTimingsRef.current = currentTimings;

      try {
        const todayInTZ = toZonedTime(now, tz);
        const yyyyMMdd = format(todayInTZ, "yyyy-MM-dd", { timeZone: tz });

        console.log("📅 جدولة الإشعارات للصلوات:", include);
        console.log(
          "🔍 تفاصيل إعدادات الإشعارات:",
          JSON.stringify(include, null, 2)
        );

        // Cancel ALL scheduled notifications first to prevent duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log("🗑️ تم إلغاء جميع الإشعارات السابقة");

        // Clear stored IDs
        try {
          await AsyncStorage.removeItem(IDS_KEY);
        } catch {}

        // If no prayers are enabled, don't schedule any notifications
        const hasEnabledPrayers = Object.values(include).some(
          (enabled) => enabled === true
        );
        if (!hasEnabledPrayers) {
          console.log("❌ لا توجد صلوات مفعلة - لن يتم جدولة أي إشعارات");
          return;
        }

        const nextStored: IdMap = {};

        for (const key of PRAYER_ORDER) {
          const included = include[key] === true; // Only schedule if explicitly true

          if (!included) {
            // Do not schedule for excluded prayer
            console.log(`❌ ${key}: الإشعار معطل - لن يتم جدولته`);
            continue;
          }

          const hhmm = prayerTimes.timings[key];
          if (!hhmm) {
            console.log(`⚠️ ${key}: لا يوجد وقت للصلاة`);
            continue;
          }

          const targetLocalString = `${yyyyMMdd}T${hhmm}:00`;
          const targetUtc = toZonedTime(targetLocalString, tz);
          const targetInstant = isBefore(targetUtc, now)
            ? addDays(targetUtc, 1)
            : targetUtc;

          const identifier = await Notifications.scheduleNotificationAsync({
            content: {
              title: titlePrefix
                ? `${titlePrefix} ${PRAYER_TITLES[key]}`
                : PRAYER_TITLES[key],
              body: `حان الآن ${PRAYER_TITLES[key]}`,
              sound: "default",
              data: {
                type: "prayer",
                screen: "PrayerTimes",
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: targetInstant.getHours(),
              minute: targetInstant.getMinutes(),
            },
          });
          nextStored[key] = identifier;
          console.log(
            `✅ ${key}: تم جدولة الإشعار بنجاح - الوقت: ${targetInstant.getHours()}:${String(targetInstant.getMinutes()).padStart(2, "0")} | ID: ${identifier}`
          );
        }

        // Persist latest identifiers map
        try {
          await AsyncStorage.setItem(IDS_KEY, JSON.stringify(nextStored));
        } catch {}

        console.log("✅ تم جدولة جميع الإشعارات بنجاح");
      } catch (err) {
        console.error("Failed scheduling prayer notifications:", err);
      } finally {
        isSchedulingRef.current = false;
      }
    };

    schedulePerPrayer();

    // Cleanup function when notifications are disabled
    return () => {
      if (!enabled) {
        Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
      }
    };
  }, [enabled, prayerTimes, include]);
}
