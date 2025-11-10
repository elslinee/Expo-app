export type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
  totalCount?: number;
  lastUsedDate?: string;
  history?: { date: string; count: number }[];
};

export type TasbeehStats = {
  totalTasbeeh: number;
  consecutiveDays: number;
  lastActiveDate: string;
};

export const STORAGE_KEY = "TASBEEH_LIST_V2";
export const STATS_KEY = "TASBEEH_STATS_V1";

