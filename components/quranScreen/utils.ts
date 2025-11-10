export const toArabicDigits = (value: number | string): string => {
  const str = String(value);
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[0-9]/g, (d) => arabicDigits[Number(d)]);
};
