import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeType } from "@/constants/ColorSchemes";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorSchemeType;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorSchemeType) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  colorScheme: "warm",
  toggleTheme: () => {},
  setColorScheme: () => {},
  isReady: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [colorScheme, setColorSchemeState] = useState<ColorSchemeType>("warm");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("APP_THEME");
        const savedScheme = await AsyncStorage.getItem("APP_COLOR_SCHEME");

        if (savedTheme && savedTheme !== theme) {
          setTheme(savedTheme as Theme);
        }
        if (savedScheme && savedScheme !== colorScheme) {
          setColorSchemeState(savedScheme as ColorSchemeType);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsReady(true);
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("APP_THEME", newTheme);
  };

  const setColorScheme = async (scheme: ColorSchemeType) => {
    setColorSchemeState(scheme);
    await AsyncStorage.setItem("APP_COLOR_SCHEME", scheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colorScheme, toggleTheme, setColorScheme, isReady }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
