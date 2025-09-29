// constants/Colors.ts
export const primaryLight = "#8C5C38";
export const primaryDark = "#A27B5C";

export const Colors = {
  light: {
    primary: primaryLight,
    text: "#1A1A1A",
    white: "#FFFFFF",
    black: "#1A1A1A",
    background: "#FFFFFF",
    grey: "#ADADAD",
    neutral: "#f5f5f5",
    tint: primaryLight,
    tabIconDefault: "#808080",
    tabIconSelected: primaryLight,
    border: "#f5f5f5",
   
  },
  dark: {
    primary: primaryDark,
    text: "#F5F5F5",
    white: "#1A1A1A",
    black: "#FFFFFF",
    background: "#0D0D0D",
    grey: "#ADADAD",
    neutral: "#1a1a1a",
    tint: primaryDark,
    tabIconDefault: "#999999",
    tabIconSelected: primaryDark,
    border: "#333333",
    
  },
};

export type ThemeMode = keyof typeof Colors;
