const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// تحسينات لتقليل حجم الـ bundle
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve("metro-minify-terser"),
  minifierConfig: {
    // إزالة console.log في production
    compress: {
      drop_console: true,
      passes: 3,
    },
    mangle: {
      keep_classnames: false,
      keep_fnames: false,
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true,
    },
  },
};

// إزالة react-devtools-core من production bundle
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.EXPO_PUBLIC_ENV === "production";

// التأكد من وجود config.resolver
if (!config.resolver) {
  config.resolver = {};
}

// التأكد من أن blockList هو array
const existingBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [];

if (isProduction) {
  config.resolver.blockList = [
    ...existingBlockList,
    /react-devtools-core/,
    /react-devtools-shared/,
    /react-devtools-timeline/,
  ];
}

// تحسين resolver لإزالة الملفات غير المستخدمة
// التأكد من أن sourceExts هو array
const existingSourceExts = Array.isArray(config.resolver.sourceExts)
  ? config.resolver.sourceExts
  : [];

config.resolver.sourceExts = isProduction
  ? existingSourceExts.filter((ext) => ext !== "map")
  : existingSourceExts;

module.exports = withNativeWind(config, { input: "./global.css" });
