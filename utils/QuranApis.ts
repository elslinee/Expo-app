// استيراد ملف JSON المحلي - Lazy loading
let QuranData: LocalSurah[] | null = null;

// تعريف الأنواع
interface LocalAyah {
  id: number;
  ar: string;
  en: string;
  filename?: string;
  path?: string;
  dir?: string;
  size?: number;
}

interface LocalSurah {
  id: number;
  name: string;
  name_en: string;
  name_translation: string;
  words?: number;
  letters?: number;
  type: string;
  type_en: string;
  ar: string;
  en: string;
  array: LocalAyah[];
}

interface ApiAyah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface ApiSurahData {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: ApiAyah[];
}

interface ApiResponse {
  data: {
    data: ApiSurahData;
  };
}

// دالة لتحويل البيانات المحلية إلى تنسيق API
const convertLocalToApiFormat = (localSurah: LocalSurah): ApiSurahData => {
  return {
    number: localSurah.id,
    name: localSurah.name,
    englishName: localSurah.name_en,
    numberOfAyahs: localSurah.array.length,
    revelationType: localSurah.type_en === "meccan" ? "Meccan" : "Medinan",
    ayahs: localSurah.array.map((ayah) => ({
      numberInSurah: ayah.id,
      text: ayah.ar,
      translation: ayah.en,
    })),
  };
};

const getAllQuran = (): Promise<ApiResponse> => {
  // نظرًا لأن البيانات المحلية، نقوم بإرجاع Promise مباشرة
  return Promise.resolve({
    data: {
      data: QuranData as unknown as ApiSurahData,
    },
  });
};

// دالة لتحميل البيانات عند الحاجة فقط مع تحسين الأداء
const loadQuranData = async (): Promise<LocalSurah[]> => {
  if (QuranData === null) {
    try {
      // تحميل تدريجي مع تحسين الأداء
      const { default: data } = await import("@/assets/json/Quran.json");
      QuranData = data as LocalSurah[];

      // تحسين الذاكرة - تحميل البيانات الأساسية فقط
      console.log("Quran data loaded successfully");
    } catch (error) {
      console.error("Error loading Quran data:", error);
      return [];
    }
  }
  return QuranData;
};

const getSurahByNumber = async (number: number): Promise<ApiResponse> => {
  const quranData = await loadQuranData();
  const surah = quranData.find((s: LocalSurah) => s.id === number);

  if (!surah) {
    return Promise.reject(new Error(`السورة رقم ${number} غير موجودة`));
  }

  const convertedSurah = convertLocalToApiFormat(surah);

  return Promise.resolve({
    data: {
      data: convertedSurah,
    },
  });
};

const getAyah = async (ayahNumber: number): Promise<any> => {
  const quranData = await loadQuranData();
  // البحث عن الآية في جميع السور
  for (const surah of quranData) {
    const ayah = surah.array.find((a) => a.id === ayahNumber);
    if (ayah) {
      return Promise.resolve({
        data: {
          data: {
            number: ayah.id,
            text: ayah.ar,
            translation: ayah.en,
            surah: {
              number: surah.id,
              name: surah.name,
              englishName: surah.name_en,
            },
          },
        },
      });
    }
  }

  return Promise.reject(new Error(`الآية رقم ${ayahNumber} غير موجودة`));
};

export { getAllQuran, getSurahByNumber, getAyah };
