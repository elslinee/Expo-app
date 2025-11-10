import { TasbeehItem } from "./types";

export const normalizeArabicNumbers = (text: string): string => {
  return text
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[^0-9]/g, "");
};

export const parseGoal = (goal: string): number => {
  const normalized = normalizeArabicNumbers(goal);
  return parseInt(normalized, 10);
};

export const calculateConsecutiveDays = (items: TasbeehItem[]): number => {
  const today = new Date().toISOString().split("T")[0];
  const uniqueDates = new Set<string>();

  items.forEach((item) => {
    if (item.history && Array.isArray(item.history)) {
      item.history.forEach((h) => uniqueDates.add(h.date));
    }
  });

  const sortedDates = Array.from(uniqueDates).sort().reverse();
  if (sortedDates.length === 0) return 0;

  let consecutive = 0;
  let currentDate = new Date(today);

  for (const dateStr of sortedDates) {
    const checkDate = currentDate.toISOString().split("T")[0];
    if (dateStr === checkDate) {
      consecutive++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return consecutive;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

