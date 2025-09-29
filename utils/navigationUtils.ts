import { router } from "expo-router";

// دالة للانتقال السلس مع تحسينات
export const navigateToPage = (route: "/quran" | "/about") => {
  // انتقال فوري بدون تأخير
  router.push(route);
};

// دالة للعودة مع تحسينات
export const goBack = () => {
  // عودة فورية بدون تأخير
  if (router.canGoBack()) {
    router.back();
  }
};

// دالة للانتقال مع استبدال الصفحة الحالية
export const replacePage = (route: "/quran" | "/about") => {
  router.replace(route);
};
