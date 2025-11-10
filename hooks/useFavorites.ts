import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SurahData } from "@/components/quranScreen/types";

export const useFavorites = (surahNumber: string | string[] | undefined) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const loadFavorites = async () => {
    try {
      const detailedFavorites = await AsyncStorage.getItem(
        "quran_favorites_detailed"
      );
      if (detailedFavorites) {
        const detailedData = JSON.parse(detailedFavorites);
        const currentSurahNumber = Number(surahNumber);

        const surahFavorites = detailedData
          .filter((item: any) => item.surahNumber === currentSurahNumber)
          .map((item: any) => item.ayahNumber);

        setFavorites(surahFavorites);
      } else {
        const storedFavorites = await AsyncStorage.getItem("quran_favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(
        "quran_favorites",
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const saveFavoriteWithSurahInfo = async (
    ayahNumber: number,
    surahNumber: number,
    surahName: string,
    ayahText: string
  ) => {
    try {
      const existingFavorites = await AsyncStorage.getItem(
        "quran_favorites_detailed"
      );
      let detailedFavorites = existingFavorites
        ? JSON.parse(existingFavorites)
        : [];

      const exists = detailedFavorites.find(
        (fav: any) =>
          fav.ayahNumber === ayahNumber && fav.surahNumber === surahNumber
      );

      if (!exists) {
        detailedFavorites.push({
          ayahNumber,
          surahNumber,
          surahName,
          text: ayahText,
          timestamp: new Date().toISOString(),
        });

        await AsyncStorage.setItem(
          "quran_favorites_detailed",
          JSON.stringify(detailedFavorites)
        );
      }
    } catch (error) {
      console.error("Error saving detailed favorites:", error);
    }
  };

  const toggleFavorite = async (
    ayahNumber: number,
    surahData: SurahData | null
  ) => {
    const newFavorites = favorites.includes(ayahNumber)
      ? favorites.filter((num) => num !== ayahNumber)
      : [...favorites, ayahNumber];

    setFavorites(newFavorites);
    await saveFavorites(newFavorites);

    if (!favorites.includes(ayahNumber) && surahData) {
      const ayah = surahData.ayahs.find((a) => a.numberInSurah === ayahNumber);
      if (ayah) {
        const cleanText =
          ayahNumber === 1
            ? ayah.text
                .replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ ", "")
                .trim()
            : ayah.text;

        await saveFavoriteWithSurahInfo(
          ayahNumber,
          surahData.number,
          surahData.name,
          cleanText
        );
      }
    }
  };

  useEffect(() => {
    if (surahNumber) {
      loadFavorites();
    }
  }, [surahNumber]);

  return { favorites, toggleFavorite };
};

