import { useEffect, useRef } from "react";
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
  Fajr: "موعد صلاة الفجر",
  Sunrise: "موعد الشروق",
  Dhuhr: "موعد صلاة الظهر",
  Asr: "موعد صلاة العصر",
  Maghrib: "موعد صلاة المغرب",
  Isha: "موعد صلاة العشاء",
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

  const scheduledOnceRef = useRef(false);
  const { enabled = true, include = {}, titlePrefix } = options;

  useEffect(() => {
    if (!enabled || !prayerTimes?.timings || !prayerTimes?.meta?.timezone) {
      return;
    }

    // Debounce initial mount re-runs
    if (
      scheduledOnceRef.current &&
      !titlePrefix &&
      Object.keys(include).length === 0
    ) {
      return;
    }

    const tz = prayerTimes.meta.timezone || "Africa/Cairo";
    const now = new Date();

    const schedule = async () => {
      try {
        // Clear previously scheduled notifications to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        const todayInTZ = toZonedTime(now, tz);
        const yyyyMMdd = format(todayInTZ, "yyyy-MM-dd", { timeZone: tz });

        const ids: string[] = [];

        for (const key of PRAYER_ORDER) {
          if (include[key] === false) continue; // skip if explicitly disabled

          const hhmm = prayerTimes.timings[key];
          if (!hhmm) continue;

          // Construct an ISO-like string in the API timezone then convert to UTC instant
          const targetLocalString = `${yyyyMMdd}T${hhmm}:00`;
          const targetUtc = toZonedTime(targetLocalString, tz);

          // If time already passed, schedule for tomorrow
          const targetInstant = isBefore(targetUtc, now)
            ? addDays(targetUtc, 1)
            : targetUtc;

          const identifier = await Notifications.scheduleNotificationAsync({
            content: {
              title: titlePrefix
                ? `${titlePrefix} ${PRAYER_TITLES[key]}`
                : PRAYER_TITLES[key],
              body: `الآن ${key}`,
              sound: "default",
            },
            // Passing a Date schedules at that exact instant
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: targetInstant.getHours(),
              minute: targetInstant.getMinutes(),
            },
          });
          ids.push(identifier);
        }

        scheduledOnceRef.current = true;
        return ids;
      } catch (err) {
        console.error("Failed scheduling prayer notifications:", err);
      }
    };

    schedule();
  }, [
    enabled,
    prayerTimes?.timings,
    prayerTimes?.meta?.timezone,
    titlePrefix,
    JSON.stringify(options.include),
  ]);
}
