export type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
  totalCount?: number;
  lastUsedDate?: string;
  history?: { date: string; count: number }[];
};

export const STORAGE_KEY = "TASBEEH_LIST_V2";
export const SOUND_ENABLED_KEY = "tasbeeh_sound_enabled";
