import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import InlineAyahView, { InlineAyahViewHandle } from "./InlineAyahView";
import ListAyahView from "./ListAyahView";
import AyahItem from "./AyahItem";
import { Ayah, SurahData } from "./types";
import { toArabicDigits } from "./utils";

interface SurahContentProps {
  surahData: SurahData;
  isInlineMode: boolean;
  isSwitchingView: boolean;
  bookmark: number | null;
  onAyahPress: (ayah: Ayah) => void;
  onToggleBookmark: (ayahNumber: number) => void;
  color: any;
}

export interface SurahContentHandle {
  inlineRef: React.RefObject<InlineAyahViewHandle | null>;
  loadMoreList: () => void;
  scrollToBookmark: (scrollViewRef: React.RefObject<any>) => void;
}

export const SurahContent = forwardRef<SurahContentHandle, SurahContentProps>(
  (
    {
      surahData,
      isInlineMode,
      isSwitchingView,
      bookmark,
      onAyahPress,
      onToggleBookmark,
      color,
    },
    ref
  ) => {
    const [listPage, setListPage] = useState(10);
    const [ayahHeights, setAyahHeights] = useState<{ [key: number]: number }>(
      {}
    );
    const inlineRef = useRef<InlineAyahViewHandle | null>(null);

    // Set initial listPage based on bookmark when both surah data and bookmark are loaded
    useEffect(() => {
      if (surahData && bookmark && !isInlineMode) {
        const requiredAyahs = Math.min(bookmark + 10, surahData.ayahs.length);
        setListPage(requiredAyahs);
      }
    }, [surahData, bookmark, isInlineMode]);

    useImperativeHandle(
      ref,
      () => ({
        inlineRef,
        loadMoreList: () => {
          if (surahData && listPage < surahData.ayahs.length) {
            setListPage((prevPage) =>
              Math.min(prevPage + 10, surahData.ayahs.length)
            );
          }
        },
        scrollToBookmark: (scrollViewRef: React.RefObject<any>) => {
          if (!bookmark || !surahData) return;

          if (isInlineMode) {
            // For inline mode, load more until bookmark is visible
            if (inlineRef.current) {
              const bookmarkIndex = bookmark - 1;
              const requiredCount = Math.min(
                bookmarkIndex + 10,
                surahData.ayahs.length
              );
              // Trigger load more in inline view if needed
              if (requiredCount > 20) {
                inlineRef.current.loadMore();
              }
              // Scroll to approximate position in inline mode
              setTimeout(() => {
                if (scrollViewRef.current) {
                  // Estimate position: each ayah is roughly 50-100px in inline mode
                  const estimatedY = bookmarkIndex * 80;
                  scrollViewRef.current.scrollTo({
                    y: estimatedY,
                    animated: true,
                  });
                }
              }, 200);
            }
            return;
          }

          // For list mode: ensure bookmark ayah is loaded
          const bookmarkIndex = bookmark - 1;
          if (bookmarkIndex >= listPage) {
            const requiredAyahs = Math.min(
              bookmarkIndex + 10,
              surahData.ayahs.length
            );
            setListPage(requiredAyahs);

            // Wait for layout then scroll
            setTimeout(() => {
              if (scrollViewRef.current) {
                // Calculate approximate position based on ayah heights
                let scrollY = 0;
                for (
                  let i = 0;
                  i < bookmarkIndex && i < surahData.ayahs.length;
                  i++
                ) {
                  const ayahNumber = i + 1;
                  scrollY += ayahHeights[ayahNumber] || 100; // Default height estimate
                }
                scrollViewRef.current.scrollTo({ y: scrollY, animated: true });
              }
            }, 300);
          } else {
            // Bookmark is already loaded, scroll to it
            setTimeout(() => {
              if (scrollViewRef.current) {
                let scrollY = 0;
                for (
                  let i = 0;
                  i < bookmarkIndex && i < surahData.ayahs.length;
                  i++
                ) {
                  const ayahNumber = i + 1;
                  scrollY += ayahHeights[ayahNumber] || 100;
                }
                scrollViewRef.current.scrollTo({ y: scrollY, animated: true });
              }
            }, 100);
          }
        },
      }),
      [surahData, listPage, bookmark, isInlineMode, ayahHeights]
    );

    const renderAyah = (ayah: Ayah, index: number) => (
      <View
        key={ayah.numberInSurah}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setAyahHeights((prev) => ({
            ...prev,
            [ayah.numberInSurah]: height,
          }));
        }}
      >
        <AyahItem
          ayah={ayah}
          onPress={onAyahPress}
          isBookmarked={bookmark === ayah.numberInSurah}
          onToggleBookmark={onToggleBookmark}
        />
      </View>
    );

    if (isSwitchingView) {
      return (
        <View style={styles.switchingViewContainer}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      );
    }

    if (isInlineMode) {
      return (
        <InlineAyahView
          ref={inlineRef}
          ayahs={surahData.ayahs}
          bookmark={bookmark}
          onAyahPress={onAyahPress}
          onToggleBookmark={onToggleBookmark}
          toArabicDigits={toArabicDigits}
          color={color}
        />
      );
    }

    return (
      <ListAyahView
        ayahs={surahData.ayahs.slice(0, listPage)}
        bookmark={bookmark}
        onAyahPress={onAyahPress}
        onToggleBookmark={onToggleBookmark}
        renderAyah={renderAyah}
      />
    );
  }
);

const styles = StyleSheet.create({
  switchingViewContainer: {
    flex: 1,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
