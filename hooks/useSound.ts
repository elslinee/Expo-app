import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import { SOUND_ENABLED_KEY } from "@/components/tasbeehDetail/types";

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);
  const tapSoundPlayer = useAudioPlayer(require("@/assets/audios/click.mp3"));

  // Load saved sound preference on mount
  useEffect(() => {
    const loadSoundPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
        if (saved !== null) {
          const enabled = saved === "true";
          setSoundEnabled(enabled);
          soundEnabledRef.current = enabled;
        }
      } catch (error) {
        // Use default value if loading fails
      }
    };
    loadSoundPreference();
  }, []);

  // Toggle sound on/off - instant update
  const toggleSound = useCallback(() => {
    // Update ref first for instant response
    soundEnabledRef.current = !soundEnabledRef.current;
    const newValue = soundEnabledRef.current;

    // Update state for UI (non-blocking)
    setSoundEnabled(newValue);

    // Save to AsyncStorage (non-blocking)
    AsyncStorage.setItem(SOUND_ENABLED_KEY, String(newValue)).catch(() => {
      // Silently fail if save fails
    });

    // Test sound immediately if turning on
    if (newValue && tapSoundPlayer) {
      try {
        tapSoundPlayer.seekTo(0);
        tapSoundPlayer.play();
      } catch (error) {
        // Silently fail
      }
    }
  }, [tapSoundPlayer]);

  // Play tap sound function - optimized for fast clicks
  // Uses ref to get the latest value instantly
  const playTapSound = useCallback(() => {
    if (!tapSoundPlayer || !soundEnabledRef.current) return;

    try {
      // Reset to beginning immediately for instant response
      tapSoundPlayer.seekTo(0);
      // Play immediately without blocking
      tapSoundPlayer.play();
    } catch (error) {
      // Silently fail if audio is not available
    }
  }, [tapSoundPlayer]);

  return { soundEnabled, toggleSound, playTapSound };
};
