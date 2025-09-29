import { quranClient } from "./axiosClient";

const getAllQuran = () => {
  return quranClient.get("/surah");
};
const getSurahByNumber = (number: number) => {
  return quranClient.get(`/surah/${number}`);
};
const getAyah = (ayah: number) => {
  return quranClient.get(`/ayah/${ayah}`);
};

export { getAllQuran, getSurahByNumber, getAyah };
