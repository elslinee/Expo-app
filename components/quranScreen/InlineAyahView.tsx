import React from "react";
import { Text } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { useFontSize } from "@/context/FontSizeContext";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface InlineAyahViewProps {
  ayahs: Ayah[];
  bookmark: number | null;
  onAyahPress: (ayah: Ayah) => void;
  onToggleBookmark: (ayahNumber: number) => void;
  toArabicDigits: (value: number | string) => string;
  color: any;
}

const InlineAyahView: React.FC<InlineAyahViewProps> = ({
  ayahs,
  bookmark,
  onAyahPress,
  toArabicDigits,
  color,
}) => {
  const { fontSize } = useFontSize();

  return (
    <Text style={styles.inlineText(fontSize, color.darkText)}>
      {ayahs.map((ayah) => {
        const isThisBookmarked = bookmark === ayah.numberInSurah;
        return (
          <Text
            key={ayah.numberInSurah}
            onPress={() =>
              onAyahPress({
                numberInSurah: ayah.numberInSurah,
                text: ayah.text,
                translation: ayah.translation,
              })
            }
            onLongPress={() =>
              onAyahPress({
                numberInSurah: ayah.numberInSurah,
                text: ayah.text,
                translation: ayah.translation,
              })
            }
            style={
              isThisBookmarked
                ? styles.inlineAyahTextBookmarked(color.primary20)
                : styles.inlineAyahText
            }
          >
            {ayah.text}
            <Text style={styles.inlineAyahNumber(fontSize, color.primary)}>
              {"  "} ﴿ {toArabicDigits(ayah.numberInSurah)} ﴾ {"  "}
            </Text>
          </Text>
        );
      })}
    </Text>
  );
};

const styles = {
  inlineText: (fontSize: number, color: string) => ({
    fontSize: fontSize,
    fontFamily: FontFamily.quran,
    color: color,
    writingDirection: "rtl" as const,
  }),
  inlineAyahText: {
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlign: "center" as const,
  },
  inlineAyahTextBookmarked: (backgroundColor: string) => ({
    backgroundColor: backgroundColor,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlign: "center" as const,
  }),
  inlineAyahNumber: (fontSize: number, color: string) => ({
    position: "relative" as const,
    fontFamily: FontFamily.bold,
    fontSize: fontSize - 1,
    color: color,
  }),
};

export default InlineAyahView;
