import "@react-navigation/bottom-tabs";

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      "/quran/[surah]": { surah: string };
    }

    interface BottomTabNavigationOptions {
      newTab?: boolean;
      newFeature?: boolean;
    }
  }
}
