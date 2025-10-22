import React from "react";
import { View, StyleSheet } from "react-native";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface ListAyahViewProps {
  ayahs: Ayah[];
  bookmark: number | null;
  onAyahPress: (ayah: Ayah) => void;
  onToggleBookmark: (ayahNumber: number) => void;
  renderAyah: (ayah: Ayah, index: number) => React.ReactElement;
}
const ListAyahView: React.FC<ListAyahViewProps> = ({ ayahs, renderAyah }) => {
  return (
    <View style={styles.container}>
      {ayahs.map((ayah, index) => renderAyah(ayah, index + 1))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default React.memo(ListAyahView);
