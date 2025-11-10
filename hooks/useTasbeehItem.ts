import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TasbeehItem, STORAGE_KEY } from "@/components/tasbeehDetail/types";

export const useTasbeehItem = (id: string) => {
  const [item, setItem] = useState<TasbeehItem | null>(null);

  const persist = useCallback(async (updated: TasbeehItem) => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    let list: TasbeehItem[] = [];
    try {
      list = saved ? JSON.parse(saved) : [];
    } catch {}
    const next = list.map((it) => (it.id === updated.id ? updated : it));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    const load = async () => {
      // Try to migrate from V1 if needed
      const oldData = await AsyncStorage.getItem("TASBEEH_LIST_V1");
      if (oldData && !(await AsyncStorage.getItem(STORAGE_KEY))) {
        try {
          const oldItems: TasbeehItem[] = JSON.parse(oldData);
          const migratedItems = oldItems.map((item) => ({
            ...item,
            totalCount: item.count || 0,
            lastUsedDate: new Date().toISOString().split("T")[0],
            history:
              item.count > 0
                ? [
                    {
                      date: new Date().toISOString().split("T")[0],
                      count: item.count,
                    },
                  ]
                : [],
          }));
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(migratedItems)
          );
        } catch {}
      }

      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      try {
        const list: TasbeehItem[] = JSON.parse(saved) || [];
        let found = list.find((it) => it.id === id);

        if (found) {
          // Reset daily count if it's a new day
          const today = new Date().toISOString().split("T")[0];
          if (found.lastUsedDate && found.lastUsedDate !== today) {
            found = { ...found, count: 0 };
            // Update storage
            const updatedList = list.map((it) => (it.id === id ? found : it));
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(updatedList)
            );
          }

          setItem(found);
        }
      } catch {}
    };
    load();
  }, [id]);

  return { item, setItem, persist };
};
