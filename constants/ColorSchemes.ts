// constants/ColorSchemes.ts
export type ColorSchemeType = "warm" | "ocean" | "nature";

export interface ColorPalette {
  primary: string;
  primary20: string;
  text20: string;
  bg20: string;
  darkText: string;
  focusColor: string;
}

export interface ColorScheme {
  name: string;
  nameAr: string;
  light: ColorPalette;
  dark: ColorPalette;
}

// نمط 1: الدافئ (البني الحالي)
const warmScheme: ColorScheme = {
  name: "warm",
  nameAr: "دافئ",
  light: {
    primary: "#8C5C38",
    primary20: "#E6DBD3",
    text20: "#AC9B8F",
    bg20: "#F2EBE7",
    darkText: "#614028",
    focusColor: "#A27B5C",
  },
  dark: {
    primary: "#A27B5C",
    primary20: "#382D23",
    text20: "#897669",
    bg20: "#2A231C",
    darkText: "#E5D9D0",
    focusColor: "#8C5C38",
  },
};

// نمط 2: المحيط (الأزرق)
const oceanScheme: ColorScheme = {
  name: "ocean",
  nameAr: "محيطي",
  light: {
    primary: "#2E7D96",
    primary20: "#D1E7ED",
    text20: "#7EAAB8",
    bg20: "#E8F4F8",
    darkText: "#1A4D5E",
    focusColor: "#4A9BB5",
  },
  dark: {
    primary: "#4A9BB5",
    primary20: "#1A3440",
    text20: "#5E8694",
    bg20: "#1C2C35",
    darkText: "#C8E1EA",
    focusColor: "#2E7D96",
  },
};

// نمط 3: الطبيعة (الأخضر)
const natureScheme: ColorScheme = {
  name: "nature",
  nameAr: "طبيعي",
  light: {
    primary: "#4A7C59",
    primary20: "#D4E7D9",
    text20: "#88B094",
    bg20: "#E8F3EB",
    darkText: "#2D5A3D",
    focusColor: "#5E9D6D",
  },
  dark: {
    primary: "#5E9D6D",
    primary20: "#1F3328",
    text20: "#668F74",
    bg20: "#1E2F25",
    darkText: "#C5E5CD",
    focusColor: "#4A7C59",
  },
};

export const ColorSchemes: Record<ColorSchemeType, ColorScheme> = {
  warm: warmScheme,
  ocean: oceanScheme,
  nature: natureScheme,
};

export const ColorSchemesList: ColorSchemeType[] = ["warm", "ocean", "nature"];
