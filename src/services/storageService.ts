import { AccessibilitySettings } from '../types';

const SETTINGS_KEY = 'seeable_accessibility_settings_v1';
const HISTORY_KEY = 'seeable_recent_results_v1';

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 'standard',
  highContrast: false,
  reducedMotion: false,
  theme: 'dark',
  autoSpeak: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  speechVolume: 1.0,
  preferredVoiceURI: ''
};

export class StorageService {
  public static getSettings(): AccessibilitySettings {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_SETTINGS };
    }

    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return { ...DEFAULT_SETTINGS };
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed
      };
    } catch (e) {
      console.warn('Failed to parse settings from localStorage, using defaults:', e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  public static saveSettings(settings: AccessibilitySettings): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to write settings to localStorage:', e);
    }
  }
}
