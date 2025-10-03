/** @type {import('tailwindcss').Config} */
const { FontFamily } = require("./constants/FontFamily");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // all Expo Router screens & layouts
    "./components/**/*.{js,jsx,ts,tsx}", // shared components
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    fontWeight: {},
    extend: {
      colors: {
        prim: {
          DEFAULT: "#A27B5C",
          dark: "#8C5C38",
        },
        gray: {
          light: "#ECECEC",
          DEFAULT: "#808080",
          dark: "#999999",
        },
        background: {
          light: "#FFFFFF",
          dark: "#0D0D0D",
        },
        text: {
          light: "#1A1A1A",
          dark: "#F5F5F5",
        },
      },
      fontFamily: {
        extraLight: FontFamily.extraLight,
        light: FontFamily.light,
        regular: FontFamily.regular,
        medium: FontFamily.medium,
        bold: FontFamily.bold,
        extraBold: FontFamily.extraBold,
        black: FontFamily.black,
        quran: FontFamily.quran,
        quranBold: FontFamily.quranBold,
      },
    },
  },
  plugins: [],
};
