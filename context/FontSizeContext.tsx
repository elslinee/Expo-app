import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FontSizeContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

interface FontSizeProviderProps {
  children: ReactNode;
}

const FONT_SIZE_KEY = "quran_font_size";
const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 32;
const DEFAULT_FONT_SIZE = 20;

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({
  children,
}) => {
  const [fontSize, setFontSizeState] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const stored = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (stored) {
          const size = parseInt(stored, 10);
          if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
            setFontSizeState(size);
          }
        }
      } catch (error) {
        console.error("Error loading font size:", error);
      }
    };
    loadFontSize();
  }, []);

  const setFontSize = useCallback(async (size: number) => {
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    setFontSizeState(clampedSize);
    try {
      await AsyncStorage.setItem(FONT_SIZE_KEY, clampedSize.toString());
    } catch (error) {
      console.error("Error saving font size:", error);
    }
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize(fontSize + 2);
  }, [fontSize, setFontSize]);

  const decreaseFontSize = useCallback(() => {
    setFontSize(fontSize - 2);
  }, [fontSize, setFontSize]);

  const resetFontSize = useCallback(() => {
    setFontSize(DEFAULT_FONT_SIZE);
  }, [setFontSize]);

  const contextValue = useMemo(
    () => ({
      fontSize,
      setFontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
    }),
    [fontSize, setFontSize, increaseFontSize, decreaseFontSize, resetFontSize]
  );

  return (
    <FontSizeContext.Provider value={contextValue}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};
