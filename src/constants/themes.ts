import { ThemeColors, ThemeId, ThemeMode } from '../types/theme';
import { adjustLightness, getContrastTextColor, hexToRgba, normalizeHex } from './colors';

interface BasePalette {
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  cardSecondary: string;
  cardBorder: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  tabBar: string;
  tabBarBorder: string;
  badgeBg: string;
  badgeText: string;
  success: string;
  warning: string;
  error: string;
}

export const THEME_DEFINITIONS: Record<ThemeId, { light: BasePalette; dark: BasePalette }> = {
  modern: {
    light: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      cardSecondary: '#F1F5F9',
      cardBorder: '#E2E8F0',
      border: '#E2E8F0',
      borderSubtle: '#F1F5F9',
      text: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      tabBar: '#FFFFFF',
      tabBarBorder: '#E2E8F0',
      badgeBg: '#F1F5F9',
      badgeText: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    dark: {
      background: '#0B0F17',
      surface: '#131B2A',
      surfaceElevated: '#1C263A',
      card: '#131B2A',
      cardSecondary: '#1C263A',
      cardBorder: '#23324D',
      border: '#23324D',
      borderSubtle: '#192437',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      tabBar: '#101725',
      tabBarBorder: '#1F2C43',
      badgeBg: '#1C263A',
      badgeText: '#CBD5E1',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
    },
  },

  midnight: {
    light: {
      background: '#F5F5F7',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      cardSecondary: '#EBEBF0',
      cardBorder: '#D8D8E0',
      border: '#D8D8E0',
      borderSubtle: '#E8E8EE',
      text: '#1C1C1E',
      textSecondary: '#636366',
      textMuted: '#8E8E93',
      tabBar: '#FFFFFF',
      tabBarBorder: '#E5E5EA',
      badgeBg: '#EBEBF0',
      badgeText: '#1C1C1E',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    },
    dark: {
      background: '#000000', // Pure pitch OLED
      surface: '#0D0D0E',
      surfaceElevated: '#18181A',
      card: '#0F0F12',
      cardSecondary: '#1A1A1E',
      cardBorder: '#28282E',
      border: '#28282E',
      borderSubtle: '#1C1C20',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      textMuted: '#71717A',
      tabBar: '#08080A',
      tabBarBorder: '#222228',
      badgeBg: '#1C1C20',
      badgeText: '#E4E4E7',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },

  sunset: {
    light: {
      background: '#FDFBF7', // Cream warm paper
      surface: '#FFFFFF',
      surfaceElevated: '#FFFDF9',
      card: '#FAF6EF',
      cardSecondary: '#F1E9DC',
      cardBorder: '#E6DCCF',
      border: '#E6DCCF',
      borderSubtle: '#EFE7DA',
      text: '#292017',
      textSecondary: '#6E5C4B',
      textMuted: '#9C8875',
      tabBar: '#FAF5ED',
      tabBarBorder: '#E8DECة',
      badgeBg: '#F1E9DC',
      badgeText: '#4A3B2C',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
    },
    dark: {
      background: '#151210',
      surface: '#201C18',
      surfaceElevated: '#2A2420',
      card: '#221D19',
      cardSecondary: '#2F2722',
      cardBorder: '#423730',
      border: '#423730',
      borderSubtle: '#2E2621',
      text: '#F7EFE9',
      textSecondary: '#BFAFA1',
      textMuted: '#87776A',
      tabBar: '#1A1613',
      tabBarBorder: '#352D27',
      badgeBg: '#2E2621',
      badgeText: '#F7EFE9',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },

  emerald: {
    light: {
      background: '#F2F8F5',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      cardSecondary: '#E2F0E8',
      cardBorder: '#C9E1D4',
      border: '#C9E1D4',
      borderSubtle: '#E2EFE7',
      text: '#0F261C',
      textSecondary: '#355E4C',
      textMuted: '#688E7D',
      tabBar: '#FFFFFF',
      tabBarBorder: '#CCE4D7',
      badgeBg: '#E2F0E8',
      badgeText: '#184734',
      success: '#10B981',
      warning: '#D97706',
      error: '#EF4444',
    },
    dark: {
      background: '#071510',
      surface: '#0F221B',
      surfaceElevated: '#173228',
      card: '#0F221B',
      cardSecondary: '#19362B',
      cardBorder: '#234C3D',
      border: '#234C3D',
      borderSubtle: '#152F25',
      text: '#EDF8F3',
      textSecondary: '#8EBEA9',
      textMuted: '#588874',
      tabBar: '#0B1C15',
      tabBarBorder: '#1F4235',
      badgeBg: '#19362B',
      badgeText: '#D1EAE0',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
    },
  },

  cyberpunk: {
    light: {
      background: '#F7F6FD',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      cardSecondary: '#EDE9FE',
      cardBorder: '#D8CEFE',
      border: '#D8CEFE',
      borderSubtle: '#EDE9FE',
      text: '#191136',
      textSecondary: '#5B429A',
      textMuted: '#8B72C7',
      tabBar: '#FFFFFF',
      tabBarBorder: '#DDD5FE',
      badgeBg: '#EDE9FE',
      badgeText: '#5B21B6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    dark: {
      background: '#080512',
      surface: '#120C28',
      surfaceElevated: '#1D1440',
      card: '#130C29',
      cardSecondary: '#201544',
      cardBorder: '#36246E',
      border: '#36246E',
      borderSubtle: '#22164A',
      text: '#F5F3FF',
      textSecondary: '#A78BFA',
      textMuted: '#735BAA',
      tabBar: '#0D0820',
      tabBarBorder: '#2A1C56',
      badgeBg: '#23164D',
      badgeText: '#C4B5FD',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
    },
  },
};

export function resolveThemeColors(
  themeId: ThemeId,
  mode: ThemeMode,
  isSystemDark: boolean,
  colorSeed: string
): ThemeColors {
  const isDark = mode === 'system' ? isSystemDark : mode === 'dark';
  const theme = THEME_DEFINITIONS[themeId] || THEME_DEFINITIONS.modern;
  const base = isDark ? theme.dark : theme.light;

  const validSeed = normalizeHex(colorSeed);
  const onPrimary = getContrastTextColor(validSeed);
  const primaryLight = adjustLightness(validSeed, isDark ? 22 : 18);
  const primaryDark = adjustLightness(validSeed, isDark ? -20 : -15);
  const primaryContainer = isDark ? hexToRgba(validSeed, 0.22) : hexToRgba(validSeed, 0.12);
  const primaryGlow = hexToRgba(validSeed, isDark ? 0.35 : 0.2);

  return {
    ...base,
    primary: validSeed,
    primaryLight,
    primaryDark,
    primaryContainer,
    onPrimary,
    primaryGlow,
    accent: validSeed,
  };
}
