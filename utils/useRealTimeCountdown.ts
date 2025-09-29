import { useState, useEffect } from "react";
import getNextPrayerTime from "./getNextPrayerTime";
import { PrayerTimesData } from "./prayerTimesService";

interface RealTimeCountdownResult {
  nextPrayer: string;
  nextPrayerTime: string;
  timeRemaining: string;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  totalSecondsRemaining: number;
  isPrayerTime: boolean;
}

/**
 * Hook that provides real-time countdown to the next prayer
 * Updates every second for precise countdown
 * @param prayerTimes - Prayer times data
 * @param updateInterval - Update interval in milliseconds (default: 1000ms for 1 second)
 * @returns Real-time countdown data
 */
export const useRealTimeCountdown = (
  prayerTimes: PrayerTimesData | null,
  updateInterval: number = 1000
): RealTimeCountdownResult | null => {
  const [countdownData, setCountdownData] =
    useState<RealTimeCountdownResult | null>(null);

  useEffect(() => {
    if (!prayerTimes?.timings) {
      setCountdownData(null);
      return;
    }

    // Calculate initial countdown
    const calculateCountdown = () => {
      const now = new Date();
      const currentSeconds =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      // Get next prayer data
      const nextPrayerData = getNextPrayerTime(prayerTimes.timings);

      if (!nextPrayerData) {
        setCountdownData(null);
        return;
      }

      // Get next prayer time in seconds
      const [hours, minutes] = nextPrayerData.nextPrayerTime.split(":");
      const prayerSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;

      let timeDiff = prayerSeconds - currentSeconds;

      // If prayer time has passed today, add 24 hours
      if (timeDiff <= 0) {
        timeDiff += 24 * 3600;
      }

      const hoursRemaining = Math.floor(timeDiff / 3600);
      const minutesRemaining = Math.floor((timeDiff % 3600) / 60);
      const secondsRemaining = timeDiff % 60;

      const isPrayerTime = timeDiff <= 60; // Less than 1 minute remaining

      setCountdownData({
        nextPrayer: nextPrayerData.nextPrayer,
        nextPrayerTime: nextPrayerData.nextPrayerTime,
        timeRemaining: `${hoursRemaining.toString().padStart(2, "0")}:${minutesRemaining.toString().padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}`,
        hoursRemaining,
        minutesRemaining,
        secondsRemaining,
        totalSecondsRemaining: timeDiff,
        isPrayerTime,
      });
    };

    // Calculate immediately
    calculateCountdown();

    // Update every second (or specified interval)
    const interval = setInterval(calculateCountdown, updateInterval);

    return () => clearInterval(interval);
  }, [prayerTimes, updateInterval]);

  return countdownData;
};
