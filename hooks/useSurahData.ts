import { useState, useEffect } from "react";
import { getSurahByNumber } from "@/utils/QuranApis";
import { SurahData } from "@/components/quranScreen/types";

export const useSurahData = (surahNumber: string | string[] | undefined) => {
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSurahByNumber(Number(surahNumber));
      setSurahData(response.data.data);
    } catch (err) {
      console.error("Error fetching surah data:", err);
      setError("فشل في تحميل السورة");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (surahNumber) {
      fetchSurahData();
    }
  }, [surahNumber]);

  return { surahData, loading, error, refetch: fetchSurahData };
};

