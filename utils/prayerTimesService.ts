import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import getAladhanTime from "./getAladhanTime";

interface PrayerTime {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerTimesData {
  timings: PrayerTime;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      format: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
      params: any;
    };
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: any;
  };
}

interface CachedPrayerTimes {
  data: PrayerTimesData;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  date: string; // YYYY-MM-DD format for date comparison
}

/**
 * Centralized Prayer Times Service
 *
 * This service provides:
 * - Centralized API calls for prayer times
 * - Local storage caching to avoid unnecessary API calls
 * - Automatic cache invalidation when date changes
 * - Location change detection to refresh data when user moves significantly
 * - Singleton pattern to ensure single instance across the app
 * - Observer pattern to notify all components when data updates
 */
class PrayerTimesService {
  private static instance: PrayerTimesService;
  private cache: CachedPrayerTimes | null = null;
  private listeners: Set<
    (
      data: PrayerTimesData | null,
      loading: boolean,
      error: string | null
    ) => void
  > = new Set();
  private locationSubscription: Location.LocationSubscription | null = null;
  private isMonitoringLocation: boolean = false;

  private constructor() {}

  static getInstance(): PrayerTimesService {
    if (!PrayerTimesService.instance) {
      PrayerTimesService.instance = new PrayerTimesService();
    }
    return PrayerTimesService.instance;
  }

  // Subscribe to prayer times updates
  subscribe(
    listener: (
      data: PrayerTimesData | null,
      loading: boolean,
      error: string | null
    ) => void
  ) {
    this.listeners.add(listener);

    // If we have cached data, immediately notify the listener
    if (this.cache) {
      listener(this.cache.data, false, null);
    }

    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners
  private notifyListeners(
    data: PrayerTimesData | null,
    loading: boolean,
    error: string | null
  ) {
    this.listeners.forEach((listener) => listener(data, loading, error));
  }

  // Get current date in YYYY-MM-DD format
  private getCurrentDateString(): string {
    return new Date().toISOString().split("T")[0];
  }

  // Check if cached data is still valid
  private isCacheValid(cachedData: CachedPrayerTimes): boolean {
    const currentDate = this.getCurrentDateString();
    return cachedData.date === currentDate;
  }

  // Check if location has changed significantly
  private hasLocationChanged(newLocation: {
    latitude: number;
    longitude: number;
  }): boolean {
    if (!this.cache) return true;

    const { latitude: oldLat, longitude: oldLng } = this.cache.location;
    const { latitude: newLat, longitude: newLng } = newLocation;

    // Consider location changed if difference is more than 0.01 degrees (~1km)
    const threshold = 0.01;
    return (
      Math.abs(oldLat - newLat) > threshold ||
      Math.abs(oldLng - newLng) > threshold
    );
  }

  // Load cached data from AsyncStorage
  private async loadCachedData(): Promise<CachedPrayerTimes | null> {
    try {
      const cached = await AsyncStorage.getItem("prayerTimesCache");
      if (cached) {
        const parsedCache: CachedPrayerTimes = JSON.parse(cached);
        if (this.isCacheValid(parsedCache)) {
          return parsedCache;
        } else {
          // Cache is outdated, remove it
          await AsyncStorage.removeItem("prayerTimesCache");
        }
      }
    } catch (error) {
      console.error("Error loading cached prayer times:", error);
    }
    return null;
  }

  // Save data to AsyncStorage
  private async saveCachedData(
    data: PrayerTimesData,
    location: { latitude: number; longitude: number }
  ) {
    try {
      const cacheData: CachedPrayerTimes = {
        data,
        location,
        timestamp: Date.now(),
        date: this.getCurrentDateString(),
      };
      await AsyncStorage.setItem("prayerTimesCache", JSON.stringify(cacheData));
      this.cache = cacheData;
    } catch (error) {
      console.error("Error saving prayer times cache:", error);
    }
  }

  // Fetch prayer times from API
  private async fetchPrayerTimes(location: {
    latitude: number;
    longitude: number;
  }): Promise<PrayerTimesData> {
    const data = await getAladhanTime({
      latitude: location.latitude,
      longitude: location.longitude,
      method: 3, // Muslim World League
      school: 0, // Shafi
    });
    return data.data;
  }

  // Get current location (fallback method)
  private async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    // Mirror the single-prompt behavior: check first, request only if never asked
    const { status: existingStatus } =
      await Location.getForegroundPermissionsAsync();
    if (existingStatus !== "granted") {
      // Do not prompt here; LocationContext owns prompting logic.
      // If permission not granted, propagate error to let UI handle gracefully.
      throw new Error("Location permission denied");
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }

  // Get prayer times with provided coordinates
  async getPrayerTimesWithLocation(
    latitude: number,
    longitude: number,
    forceRefresh: boolean = false
  ): Promise<PrayerTimesData | null> {
    try {
      // Try to load from cache first (if not forcing refresh)
      if (!forceRefresh) {
        const cachedData = await this.loadCachedData();
        if (cachedData) {
          this.cache = cachedData;
          this.notifyListeners(cachedData.data, false, null);
          return cachedData.data;
        }
      }

      // Fetch new data from API
      const data = await this.fetchPrayerTimes({ latitude, longitude });
      if (data) {
        // Cache the new data
        await this.saveCachedData(data, { latitude, longitude });
        this.cache = {
          data,
          timestamp: Date.now(),
          location: { latitude, longitude },
          date: new Date().toDateString(),
        };
        this.notifyListeners(data, false, null);
        return data;
      }

      return null;
    } catch (error) {
      console.error("Error getting prayer times:", error);
      this.notifyListeners(
        null,
        false,
        error instanceof Error ? error.message : "Unknown error"
      );
      return null;
    }
  }

  // Main method to get prayer times (uses current location)
  async getPrayerTimes(
    forceRefresh: boolean = false
  ): Promise<PrayerTimesData | null> {
    try {
      // Try to load from cache first (if not forcing refresh)
      if (!forceRefresh) {
        const cachedData = await this.loadCachedData();
        if (cachedData) {
          this.cache = cachedData;
          this.notifyListeners(cachedData.data, false, null);
          return cachedData.data;
        }
      }

      // Only request location if we don't have valid cached data
      // Notify listeners that we're loading
      this.notifyListeners(null, true, null);

      // Get current location
      const location = await this.getCurrentLocation();

      // Check if location has changed significantly (if we have cache)
      if (this.cache && !this.hasLocationChanged(location)) {
        // Location hasn't changed much, use cached data
        this.notifyListeners(this.cache.data, false, null);
        return this.cache.data;
      }

      // Fetch new data from API
      const prayerTimesData = await this.fetchPrayerTimes(location);

      // Save to cache
      await this.saveCachedData(prayerTimesData, location);

      // Notify listeners
      this.notifyListeners(prayerTimesData, false, null);

      return prayerTimesData;
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch prayer times";
      this.notifyListeners(null, false, errorMessage);
      return null;
    }
  }

  // Force refresh prayer times
  async refreshPrayerTimes(): Promise<PrayerTimesData | null> {
    return this.getPrayerTimes(true);
  }

  // Clear cache
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem("prayerTimesCache");
      this.cache = null;
    } catch (error) {
      console.error("Error clearing prayer times cache:", error);
    }
  }

  // Get cached data without fetching
  getCachedPrayerTimes(): PrayerTimesData | null {
    return this.cache?.data || null;
  }

  // Check if we have valid cached data without loading it
  async hasValidCachedData(): Promise<boolean> {
    try {
      const cached = await AsyncStorage.getItem("prayerTimesCache");
      if (cached) {
        const parsedCache: CachedPrayerTimes = JSON.parse(cached);
        return this.isCacheValid(parsedCache);
      }
    } catch (error) {
      console.error("Error checking cached data:", error);
    }
    return false;
  }

  // Start monitoring location changes
  async startLocationMonitoring(): Promise<void> {
    if (this.isMonitoringLocation) return;

    try {
      // Check if we have recent cached data first
      const hasRecentData = await this.hasValidCachedData();
      if (hasRecentData) {
        console.log(
          "Recent prayer times data available, skipping location monitoring"
        );
        return;
      }

      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        console.warn(
          "Location services are disabled, skipping location monitoring"
        );
        return;
      }

      // Check if we already have location permission without requesting it
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn(
          "Location permission not granted, skipping location monitoring"
        );
        return;
      }

      this.isMonitoringLocation = true;

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 300000, // Check every 5 minutes instead of 30 seconds
          distanceInterval: 5000, // Check if moved more than 5km instead of 1km
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          if (this.hasLocationChanged(newLocation)) {
            this.getPrayerTimes(true);
          }
        }
      );
    } catch (error) {
      console.error("Error starting location monitoring:", error);
      this.isMonitoringLocation = false;
      // Don't throw the error, just log it and continue without monitoring
    }
  }

  // Stop monitoring location changes
  stopLocationMonitoring(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    this.isMonitoringLocation = false;
  }

  // Check if location monitoring is active
  isLocationMonitoringActive(): boolean {
    return this.isMonitoringLocation;
  }
}

export default PrayerTimesService;
export type { PrayerTimesData, PrayerTime };
