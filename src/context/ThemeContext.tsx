import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TextStyle, useColorScheme } from 'react-native';
import { translations, TranslationKey } from '../constants/translations';
import { resolveThemeColors } from '../constants/themes';
import {
  getTypographySizes,
  RADIUS_VALUES,
  resolveFontFamilyAndWeight,
} from '../constants/typography';
import {
  FontFamilyId,
  FontSizeScale,
  FontWeightOption,
  Language,
  RadiusOption,
  ThemeColors,
  ThemeId,
  ThemeMode,
  ThemeSettings,
} from '../types/theme';

const STORAGE_KEY = '@theme_sdk54_settings_v1';

export const DEFAULT_SETTINGS: ThemeSettings = {
  themeId: 'modern',
  mode: 'system',
  colorSeed: '#2563EB',
  fontSizeScale: 'medium',
  fontFamily: 'system',
  fontWeight: '400',
  language: 'en', // English default as requested
  radius: 'medium',
};

export interface ThemeContextValue {
  settings: ThemeSettings;
  themeId: ThemeId;
  mode: ThemeMode;
  colorSeed: string;
  fontSizeScale: FontSizeScale;
  fontFamily: FontFamilyId;
  fontWeight: FontWeightOption;
  language: Language;
  radius: RadiusOption;
  isDark: boolean;
  colors: ThemeColors;
  borderRadius: number;
  fontSize: ReturnType<typeof getTypographySizes>;
  fontFamilyResolved: { fontFamily?: string; fontWeight: TextStyle['fontWeight'] };
  isLoaded: boolean;
  setThemeId: (id: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  setColorSeed: (seed: string) => void;
  setFontSizeScale: (scale: FontSizeScale) => void;
  setFontFamily: (family: FontFamilyId) => void;
  setFontWeight: (weight: FontWeightOption) => void;
  setLanguage: (lang: Language) => void;
  setRadius: (radius: RadiusOption) => void;
  applyPreset: (presetId: 'khmerElegance' | 'cyberpunkGlow' | 'oledMinimal' | 'nordicNature') => void;
  resetDefaults: () => Promise<void>;
  t: (key: TranslationKey) => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted preferences on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          setSettings((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (err) {
        console.warn('Failed to load theme settings from storage:', err);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist preferences on change
  const saveSettings = useCallback(async (newSettings: ThemeSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.warn('Failed to persist theme settings:', err);
    }
  }, []);

  const triggerHaptic = useCallback(() => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Haptics not available on web or unsupported devices
    }
  }, []);

  const updateSetting = useCallback(
    <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
      triggerHaptic();
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        saveSettings(updated);
        return updated;
      });
    },
    [saveSettings, triggerHaptic]
  );

  const setThemeId = useCallback((id: ThemeId) => updateSetting('themeId', id), [updateSetting]);
  const setMode = useCallback((mode: ThemeMode) => updateSetting('mode', mode), [updateSetting]);
  const setColorSeed = useCallback((seed: string) => updateSetting('colorSeed', seed), [updateSetting]);
  const setFontSizeScale = useCallback(
    (scale: FontSizeScale) => updateSetting('fontSizeScale', scale),
    [updateSetting]
  );
  const setFontFamily = useCallback(
    (family: FontFamilyId) => updateSetting('fontFamily', family),
    [updateSetting]
  );
  const setFontWeight = useCallback(
    (weight: FontWeightOption) => updateSetting('fontWeight', weight),
    [updateSetting]
  );
  const setLanguage = useCallback((lang: Language) => updateSetting('language', lang), [updateSetting]);
  const setRadius = useCallback((radius: RadiusOption) => updateSetting('radius', radius), [updateSetting]);

  const applyPreset = useCallback(
    (presetId: 'khmerElegance' | 'cyberpunkGlow' | 'oledMinimal' | 'nordicNature') => {
      triggerHaptic();
      let presetUpdates: Partial<ThemeSettings> = {};
      switch (presetId) {
        case 'khmerElegance':
          presetUpdates = {
            themeId: 'sunset',
            mode: 'light',
            colorSeed: '#D97706',
            fontFamily: 'kantumruy',
            fontWeight: '500',
            radius: 'medium',
            language: 'km',
          };
          break;
        case 'cyberpunkGlow':
          presetUpdates = {
            themeId: 'cyberpunk',
            mode: 'dark',
            colorSeed: '#06B6D4',
            fontFamily: 'kdamThmor',
            fontWeight: '600',
            radius: 'sharp',
          };
          break;
        case 'oledMinimal':
          presetUpdates = {
            themeId: 'midnight',
            mode: 'dark',
            colorSeed: '#7C3AED',
            fontFamily: 'battambang',
            fontWeight: '400',
            radius: 'rounded',
          };
          break;
        case 'nordicNature':
          presetUpdates = {
            themeId: 'emerald',
            mode: 'light',
            colorSeed: '#10B981',
            fontFamily: 'kantumruy',
            fontWeight: '500',
            radius: 'rounded',
          };
          break;
      }

      setSettings((prev) => {
        const next = { ...prev, ...presetUpdates };
        saveSettings(next);
        return next;
      });
    },
    [saveSettings, triggerHaptic]
  );

  const resetDefaults = useCallback(async () => {
    triggerHaptic();
    setSettings(DEFAULT_SETTINGS);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear storage:', err);
    }
  }, [triggerHaptic]);

  const isDark = useMemo(() => {
    if (settings.mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return settings.mode === 'dark';
  }, [settings.mode, systemColorScheme]);

  const colors = useMemo(() => {
    return resolveThemeColors(
      settings.themeId,
      settings.mode,
      systemColorScheme === 'dark',
      settings.colorSeed
    );
  }, [settings.themeId, settings.mode, systemColorScheme, settings.colorSeed]);

  const borderRadius = useMemo(() => {
    return RADIUS_VALUES[settings.radius] ?? 12;
  }, [settings.radius]);

  const fontSize = useMemo(() => {
    return getTypographySizes(settings.fontSizeScale);
  }, [settings.fontSizeScale]);

  const fontFamilyResolved = useMemo(() => {
    return resolveFontFamilyAndWeight(settings.fontFamily, settings.fontWeight);
  }, [settings.fontFamily, settings.fontWeight]);

  const t = useCallback(
    (key: TranslationKey): string => {
      const lang = settings.language;
      return translations[lang]?.[key] ?? translations.en[key] ?? key;
    },
    [settings.language]
  );

  const value = useMemo(
    () => ({
      settings,
      themeId: settings.themeId,
      mode: settings.mode,
      colorSeed: settings.colorSeed,
      fontSizeScale: settings.fontSizeScale,
      fontFamily: settings.fontFamily,
      fontWeight: settings.fontWeight,
      language: settings.language,
      radius: settings.radius,
      isDark,
      colors,
      borderRadius,
      fontSize,
      fontFamilyResolved,
      isLoaded,
      setThemeId,
      setMode,
      setColorSeed,
      setFontSizeScale,
      setFontFamily,
      setFontWeight,
      setLanguage,
      setRadius,
      applyPreset,
      resetDefaults,
      t,
    }),
    [
      settings,
      isDark,
      colors,
      borderRadius,
      fontSize,
      fontFamilyResolved,
      isLoaded,
      setThemeId,
      setMode,
      setColorSeed,
      setFontSizeScale,
      setFontFamily,
      setFontWeight,
      setLanguage,
      setRadius,
      applyPreset,
      resetDefaults,
      t,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
