// constants/Colors.ts
export const primaryLight = "#8C5C38";
export const primaryDark = "#A27B5C";

export const Colors = {
  light: {
    primary: primaryLight,
    text: "#1A1A1A",
    white: "#FFFFFF",
    background: "#FFFFFF",
    grey: "#ECECEC",
    tint: primaryLight,
    tabIconDefault: "#808080",
    tabIconSelected: primaryLight,
    border: "#dddddd",
  },
  dark: {
    primary: primaryDark,
    text: "#F5F5F5",
    background: "#0D0D0D",
    grey: "#1A1A1A",
    tint: primaryDark,
    tabIconDefault: "#999999",
    tabIconSelected: primaryDark,
    border: "#333333",
  },
};

export type ThemeMode = keyof typeof Colors;
