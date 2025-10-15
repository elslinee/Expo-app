// استيراد ملف JSON المحلي
import QuranData from "@/assets/json/Quran.json";

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

const getSurahByNumber = (number: number): Promise<ApiResponse> => {
  const surah = (QuranData as LocalSurah[]).find(
    (s: LocalSurah) => s.id === number
  );

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

const getAyah = (ayahNumber: number): Promise<any> => {
  // البحث عن الآية في جميع السور
  for (const surah of QuranData as LocalSurah[]) {
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
