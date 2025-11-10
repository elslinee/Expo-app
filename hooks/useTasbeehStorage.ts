import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TasbeehItem, STORAGE_KEY } from "@/components/tasbeehScreen/types";
import { getTodayDate } from "@/components/tasbeehScreen/utils";

export const useTasbeehStorage = () => {
  const [items, setItems] = useState<TasbeehItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  const itemsRef = useRef<string>("");

  // Migration from V1 to V2
  const migrateFromV1 = useCallback(async () => {
    try {
      const oldData = await AsyncStorage.getItem("TASBEEH_LIST_V1");
      if (oldData && !(await AsyncStorage.getItem(STORAGE_KEY))) {
        const oldItems: TasbeehItem[] = JSON.parse(oldData);
        const migratedItems = oldItems.map((item) => ({
          ...item,
          totalCount: item.count || 0,
          lastUsedDate: getTodayDate(),
          history:
            item.count > 0
              ? [
                  {
                    date: getTodayDate(),
                    count: item.count,
                  },
                ]
              : [],
        }));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migratedItems));
        await AsyncStorage.removeItem("TASBEEH_LIST_V1");
      }
    } catch {
      // ignore migration errors
    }
  }, []);

  // Load items from storage
  const loadItems = useCallback(async () => {
    try {
      await migrateFromV1();
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: TasbeehItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          itemsRef.current = saved;
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
      setHasHydrated(true);
    }
  }, [migrateFromV1]);

  // Reload items from storage (without changing loading state)
  const reloadItems = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: TasbeehItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const itemsString = JSON.stringify(parsed);
          // Only update if actually different
          if (itemsRef.current !== itemsString) {
            setItems(parsed);
            itemsRef.current = itemsString;
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save items to storage
  const saveItems = useCallback(
    async (newItems: TasbeehItem[]) => {
      if (!hasHydrated) return;
      const itemsString = JSON.stringify(newItems);
      // Only save if items actually changed
      if (itemsRef.current === itemsString) return;

      try {
        await AsyncStorage.setItem(STORAGE_KEY, itemsString);
        itemsRef.current = itemsString;
      } catch {
        // ignore
      }
    },
    [hasHydrated]
  );

  // Reset daily counts for new day
  const resetDailyCounts = useCallback(async () => {
    try {
      const today = getTodayDate();
      let updatedItems: TasbeehItem[] = [];
      setItems((currentItems) => {
        updatedItems = currentItems.map((item) => {
          if (item.lastUsedDate && item.lastUsedDate !== today) {
            return { ...item, count: 0, lastUsedDate: today };
          }
          return item;
        });
        return updatedItems;
      });
      // Save after state update
      if (hasHydrated) {
        // Use setTimeout to ensure state is updated
        setTimeout(async () => {
          const itemsString = JSON.stringify(updatedItems);
          if (itemsRef.current !== itemsString) {
            await AsyncStorage.setItem(STORAGE_KEY, itemsString).catch(() => {});
            itemsRef.current = itemsString;
          }
        }, 0);
      }
      return updatedItems;
    } catch {
      return [];
    }
  }, [hasHydrated]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Save items when they change (but only after hydration)
  useEffect(() => {
    if (hasHydrated) {
      const save = async () => {
        await saveItems(items);
      };
      save();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, hasHydrated]); // saveItems intentionally excluded to avoid loop

  return {
    items,
    setItems,
    isLoading,
    hasHydrated,
    resetDailyCounts,
    reloadItems,
  };
};

