const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

// تحسينات لتقليل حجم الـ bundle
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve("metro-minify-terser"),
  minifierConfig: {
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

// إعداد path alias للـ @/
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // حل @/ إلى المجلد الجذري
  if (moduleName.startsWith("@/")) {
    const modulePath = moduleName.replace("@/", "");
    const resolvedPath = path.resolve(__dirname, modulePath);

    // محاولة حل المسار مع extensions (يشمل ملفات الصوت والصور)
    const sourceExts = context.sourceExts ||
      config.resolver.sourceExts || [
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "mp3",
        "png",
        "jpg",
        "jpeg",
        "svg",
        "webp",
      ];
    for (const ext of sourceExts) {
      const fullPath = `${resolvedPath}.${ext}`;
      if (fs.existsSync(fullPath)) {
        return {
          filePath: fullPath,
          type: "sourceFile",
        };
      }
    }

    // محاولة حل كـ directory مع index file
    for (const ext of sourceExts) {
      const indexPath = path.join(resolvedPath, `index.${ext}`);
      if (fs.existsSync(indexPath)) {
        return {
          filePath: indexPath,
          type: "sourceFile",
        };
      }
    }
  }

  // استخدام الـ resolver الأصلي
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  // fallback إلى default resolver
  return context.resolveRequest(context, moduleName, platform);
};

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

// إضافة ملفات الصوت والصور إلى sourceExts إذا لم تكن موجودة
const requiredExts = ["mp3", "png", "jpg", "jpeg", "svg", "webp"];
const missingExts = requiredExts.filter(
  (ext) => !existingSourceExts.includes(ext)
);
if (missingExts.length > 0) {
  config.resolver.sourceExts = [...existingSourceExts, ...missingExts];
} else {
  config.resolver.sourceExts = existingSourceExts;
}

// إزالة source maps من production
if (isProduction) {
  config.resolver.sourceExts = config.resolver.sourceExts.filter(
    (ext) => ext !== "map"
  );
}

module.exports = withNativeWind(config, { input: "./global.css" });
