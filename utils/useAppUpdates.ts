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
        return;
      }

      setUpdateState((prev) => ({ ...prev, isChecking: true, error: null }));

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateState((prev) => ({
          ...prev,
          isChecking: false,
          isUpdateAvailable: true,
          isDownloading: true,
        }));

        // تحميل التحديث

        await Updates.fetchUpdateAsync();

        setUpdateState((prev) => ({
          ...prev,
          isDownloading: false,
          showUpdateModal: true,
        }));
      } else {
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
