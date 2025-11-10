import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TasbeehItem,
  TasbeehStats,
  STATS_KEY,
} from "@/components/tasbeehScreen/types";
import { calculateConsecutiveDays } from "@/components/tasbeehScreen/utils";

export const useTasbeehStats = (items: TasbeehItem[]) => {
  const [stats, setStats] = useState<TasbeehStats>({
    totalTasbeeh: 0,
    consecutiveDays: 0,
    lastActiveDate: "",
  });
  const itemsRef = useRef<string>("");

  const calculateStats = useCallback(
    (itemsToCalculate: TasbeehItem[]): TasbeehStats => {
      const totalTasbeeh = itemsToCalculate.reduce(
        (sum, item) => sum + (item.totalCount || 0),
        0
      );
      const consecutiveDays = calculateConsecutiveDays(itemsToCalculate);
      const lastActiveDate =
        itemsToCalculate
          .map((item) => item.lastUsedDate || "")
          .filter(Boolean)
          .sort()
          .reverse()[0] || "";

      return { totalTasbeeh, consecutiveDays, lastActiveDate };
    },
    []
  );

  const updateStats = useCallback(
    (itemsToCalculate: TasbeehItem[]) => {
      const newStats = calculateStats(itemsToCalculate);
      setStats(newStats);
      // Save to storage
      AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats)).catch(() => {});
    },
    [calculateStats]
  );

  useEffect(() => {
    // Load saved stats only once
    AsyncStorage.getItem(STATS_KEY)
      .then((savedStats) => {
        if (savedStats) {
          const parsedStats: TasbeehStats = JSON.parse(savedStats);
          setStats((prev) => ({ ...prev, ...parsedStats }));
        }
      })
      .catch(() => {});
  }, []); // Only run once on mount

  useEffect(() => {
    // Only update stats if items actually changed
    const itemsString = JSON.stringify(items);
    if (itemsRef.current !== itemsString) {
      itemsRef.current = itemsString;
      const newStats = calculateStats(items);
      setStats(newStats);
      // Save to storage
      AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats)).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]); // Only depend on items, calculateStats is stable

  return { stats, updateStats };
};
