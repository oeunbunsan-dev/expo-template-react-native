export type ThemeId = 'modern' | 'midnight' | 'sunset' | 'emerald' | 'cyberpunk';

export type ThemeMode = 'system' | 'light' | 'dark';

export type FontSizeScale = 'small' | 'medium' | 'large' | 'xlarge';

export type FontFamilyId = 'system' | 'kantumruy' | 'battambang' | 'moul' | 'kdamThmor' | 'inter';

export type FontWeightOption = '300' | '400' | '500' | '600' | '700';

export type Language = 'en' | 'km';

export type RadiusOption = 'sharp' | 'medium' | 'rounded' | 'pill';

export interface ThemeColors {
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
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryContainer: string;
  onPrimary: string;
  primaryGlow: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  tabBar: string;
  tabBarBorder: string;
  badgeBg: string;
  badgeText: string;
}

export interface ThemeSettings {
  themeId: ThemeId;
  mode: ThemeMode;
  colorSeed: string;
  fontSizeScale: FontSizeScale;
  fontFamily: FontFamilyId;
  fontWeight: FontWeightOption;
  language: Language;
  radius: RadiusOption;
}

export interface FontMetrics {
  scale: number;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    hero: number;
  };
}
