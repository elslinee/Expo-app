import { useEffect, useState } from "react";
import * as Updates from "expo-updates";

interface UpdateState {
  isChecking: boolean;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
  showUpdateModal: boolean;
  error: Error | null;
}

/**
 * Hook للتحقق من التحديثات OTA وتطبيقها تلقائياً
 * يعمل فقط في بيئة الإنتاج (production builds)
 */
export default function useAppUpdates() {
  const [updateState, setUpdateState] = useState<UpdateState>({
    isChecking: false,
    isDownloading: false,
    isUpdateAvailable: false,
    showUpdateModal: false,
    error: null,
  });

  const checkForUpdates = async () => {
    try {
      // لا تتحقق من التحديثات في وضع التطوير
      if (__DEV__ || !Updates.isEnabled) {
        console.log("⚠️ التحديثات معطلة في وضع التطوير");
        return;
      }

      setUpdateState((prev) => ({ ...prev, isChecking: true, error: null }));
      console.log("🔍 جاري التحقق من وجود تحديثات...");

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        console.log("✅ تحديث جديد متاح!");
        setUpdateState((prev) => ({
          ...prev,
          isChecking: false,
          isUpdateAvailable: true,
          isDownloading: true,
        }));

        // تحميل التحديث
        console.log("📥 جاري تحميل التحديث...");
        await Updates.fetchUpdateAsync();

        console.log("✅ تم تحميل التحديث بنجاح");
        setUpdateState((prev) => ({
          ...prev,
          isDownloading: false,
          showUpdateModal: true,
        }));
      } else {
        console.log("✅ التطبيق محدث بالفعل");
        setUpdateState((prev) => ({ ...prev, isChecking: false }));
      }
    } catch (error) {
      console.error("❌ خطأ في التحقق من التحديثات:", error);
      setUpdateState((prev) => ({
        ...prev,
        isChecking: false,
        isDownloading: false,
        error: error as Error,
      }));
    }
  };

  const handleRestart = async () => {
    await Updates.reloadAsync();
  };

  const handleLater = () => {
    setUpdateState((prev) => ({
      ...prev,
      showUpdateModal: false,
    }));
  };

  useEffect(() => {
    // التحقق من التحديثات عند بدء التطبيق
    checkForUpdates();

    // يمكنك أيضاً إضافة interval للتحقق بشكل دوري
    const interval = setInterval(
      () => {
        checkForUpdates();
      },
      1000 * 60 * 60
    ); // كل ساعة

    return () => clearInterval(interval);
  }, []);

  return {
    ...updateState,
    checkForUpdates,
    handleRestart,
    handleLater,
  };
}
