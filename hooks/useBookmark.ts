import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useBookmark = (surahNumber: string | string[] | undefined) => {
  const [bookmark, setBookmark] = useState<number | null>(null);

  const loadBookmark = async () => {
    try {
      const currentSurahNumber = Number(surahNumber);
      const storedBookmark = await AsyncStorage.getItem(
        `bookmark_surah_${currentSurahNumber}`
      );
      if (storedBookmark) {
        const bookmarkData = JSON.parse(storedBookmark);
        setBookmark(bookmarkData.ayahNumber);
      }
    } catch (error) {
      console.error("Error loading bookmark:", error);
    }
  };

  const saveBookmark = async (ayahNumber: number) => {
    try {
      const currentSurahNumber = Number(surahNumber);
      const bookmarkData = {
        surahNumber: currentSurahNumber,
        ayahNumber: ayahNumber,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        `bookmark_surah_${currentSurahNumber}`,
        JSON.stringify(bookmarkData)
      );
      setBookmark(ayahNumber);
    } catch (error) {
      console.error("Error saving bookmark:", error);
    }
  };

  const removeBookmark = async () => {
    try {
      const currentSurahNumber = Number(surahNumber);
      await AsyncStorage.removeItem(`bookmark_surah_${currentSurahNumber}`);
      setBookmark(null);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const toggleBookmark = async (ayahNumber: number) => {
    if (bookmark === ayahNumber) {
      await removeBookmark();
    } else {
      await saveBookmark(ayahNumber);
    }
  };

  useEffect(() => {
    if (surahNumber) {
      loadBookmark();
    }
  }, [surahNumber]);

  return { bookmark, toggleBookmark };
};

