import moment from "moment-hijri";

export interface HijriDate {
  day: number;
  month: string;
  year: number;
  dayName: string;
  formatted: string;
}

export const getHijriDate = (date: Date = new Date()): HijriDate => {
  const hijriMoment = moment(date).format("iYYYY-iMM-iDD");
  const [year, month, day] = hijriMoment.split("-").map(Number);

  const hijriMonths = [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الثاني",
    "جمادى الأولى",
    "جمادى الثانية",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة",
  ];

  const dayNames = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const dayName = dayNames[date.getDay()];
  const monthName = hijriMonths[month - 1];

  return {
    day,
    month: monthName,
    year,
    dayName,
    formatted: `${dayName}، ${day} ${monthName} ${year} هـ`,
  };
};

export const getHijriDateString = (date: Date = new Date()): string => {
  return getHijriDate(date).formatted;
};
