import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export default function AboutScreen() {
  const { theme } = useTheme();
  const color = Colors[theme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: color.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: color.text }]}>حول التطبيق</Text>

        <Text style={[styles.paragraph, { color: color.text }]}>
          تطبيق مواقيت الصلاة في غزة - تطبيق إسلامي شامل يوفر مواقيت الصلاة
          الدقيقة والعديد من الميزات المفيدة للمسلمين.
        </Text>

        <Text style={[styles.subtitle, { color: color.text }]}>المميزات:</Text>

        <Text style={[styles.listItem, { color: color.text }]}>
          • مواقيت الصلاة الدقيقة لمدينة غزة
        </Text>
        <Text style={[styles.listItem, { color: color.text }]}>
          • تنبيهات الصلاة
        </Text>
        <Text style={[styles.listItem, { color: color.text }]}>
          • القرآن الكريم
        </Text>
        <Text style={[styles.listItem, { color: color.text }]}>
          • واجهة عربية جميلة
        </Text>

        <Text style={[styles.paragraph, { color: color.text }]}>
          نسخة التطبيق: 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    lineHeight: 24,
    marginBottom: 15,
  },
  listItem: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    lineHeight: 24,
    marginBottom: 8,
  },
});
