// constants/Colors.ts
import { ColorSchemes, ColorSchemeType } from "./ColorSchemes";

export const getColors = (
  theme: "light" | "dark",
  colorScheme: ColorSchemeType = "warm"
) => {
  const scheme = ColorSchemes[colorScheme];
  const palette = theme === "light" ? scheme.light : scheme.dark;

  return {
    light: {
      primary: palette.primary,
      text: "#1A1A1A",
      white: "#FFFFFF",
      black: "#1A1A1A",
      background: "#FDFBFA",
      primary20: palette.primary20,
      grey: "#9F9F9D",
      neutral: "#f5f5f5",
      tint: palette.primary,
      tabIconDefault: palette.text20,
      tabIconSelected: "#FDFBFA",
      border: "#f5f5f5",
      focusColor: palette.focusColor,
      text20: palette.text20,
      darkText: palette.darkText,
      bg20: palette.bg20,
    },
    dark: {
      primary: palette.primary,
      text: "#F5F5F5",
      white: "#1A1A1A",
      black: "#FFFFFF",
      background: "#1D1915",
      primary20: palette.primary20,
      grey: "#9F9F9D",
      neutral: "#1a1a1a",
      tint: palette.primary,
      tabIconDefault: palette.text20,
      tabIconSelected: "#1D1915",
      border: "#5555",
      focusColor: palette.focusColor,
      text20: palette.text20,
      darkText: palette.darkText,
      bg20: palette.bg20,
    },
  };
};

// للتوافق مع الكود القديم
export const Colors = getColors("dark", "warm");

export type ThemeMode = keyof typeof Colors;
