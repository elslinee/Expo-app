export interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}
