import { TextStyle } from 'react-native';
import { FontFamilyId, FontSizeScale, FontWeightOption, RadiusOption } from '../types/theme';

export interface FontFamilyOption {
  id: FontFamilyId;
  name: string;
  nativeName: string;
  isKhmer: boolean;
  sampleEn: string;
  sampleKm: string;
}

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  {
    id: 'system',
    name: 'System Default',
    nativeName: 'ពុម្ពអក្សរប្រព័ន្ធ',
    isKhmer: false,
    sampleEn: 'Modern OS Typography',
    sampleKm: 'ពុម្ពអក្សរប្រព័ន្ធលំនាំដើម',
  },
  {
    id: 'kantumruy',
    name: 'Kantumruy Pro',
    nativeName: 'កន្ទុំរុយ ប្រូ',
    isKhmer: true,
    sampleEn: 'Premium Multilingual Design',
    sampleKm: 'សួស្តីកម្ពុជា រចនាប័ទ្មខ្មែរទំនើប',
  },
  {
    id: 'battambang',
    name: 'Battambang',
    nativeName: 'បាត់ដំបង',
    isKhmer: true,
    sampleEn: 'Classic Khmer Geometry',
    sampleKm: 'ស្វាគមន៍មកកាន់ទឹកដីបាត់ដំបង',
  },
  {
    id: 'moul',
    name: 'Moul Display',
    nativeName: 'មូល (រាជវាំង)',
    isKhmer: true,
    sampleEn: 'Royal Khmer Display Script',
    sampleKm: 'ព្រះរាជាណាចក្រកម្ពុជា',
  },
  {
    id: 'kdamThmor',
    name: 'Kdam Thmor Pro',
    nativeName: 'ក្តាមថ្ម ប្រូ',
    isKhmer: true,
    sampleEn: 'Techno Geometric Typeface',
    sampleKm: 'បច្ចេកវិទ្យាព័ត៌មានវិទ្យា',
  },
  {
    id: 'inter',
    name: 'Inter UI',
    nativeName: 'អ៊ិនធ័រ',
    isKhmer: false,
    sampleEn: 'Precision Interface Typeface',
    sampleKm: 'រចនាឡើងយ៉ាងម៉ត់ចត់',
  },
];

export const FONT_SIZE_SCALES: Record<FontSizeScale, { scale: number; labelEn: string; labelKm: string }> = {
  small: { scale: 0.88, labelEn: 'Small (88%)', labelKm: 'តូច (៨៨%)' },
  medium: { scale: 1.0, labelEn: 'Medium (100%)', labelKm: 'មធ្យម (១០០%)' },
  large: { scale: 1.15, labelEn: 'Large (115%)', labelKm: 'ធំ (១១៥%)' },
  xlarge: { scale: 1.3, labelEn: 'Extra Large (130%)', labelKm: 'ធំបំផុត (១៣០%)' },
};

export const FONT_WEIGHT_OPTIONS: { id: FontWeightOption; label: string; numeric: number }[] = [
  { id: '300', label: 'Light', numeric: 300 },
  { id: '400', label: 'Regular', numeric: 400 },
  { id: '500', label: 'Medium', numeric: 500 },
  { id: '600', label: 'SemiBold', numeric: 600 },
  { id: '700', label: 'Bold', numeric: 700 },
];

export const RADIUS_VALUES: Record<RadiusOption, number> = {
  sharp: 4,
  medium: 12,
  rounded: 20,
  pill: 999,
};

/**
 * Maps logical font family + weight to loaded font asset name.
 * On React Native / Android, custom fonts must specify the exact font name.
 */
export function resolveFontFamilyAndWeight(
  family: FontFamilyId,
  weight: FontWeightOption = '400'
): { fontFamily?: string; fontWeight: TextStyle['fontWeight'] } {
  switch (family) {
    case 'kantumruy': {
      let fontName = 'KantumruyPro-Regular';
      if (weight === '300') fontName = 'KantumruyPro-Light';
      else if (weight === '400') fontName = 'KantumruyPro-Regular';
      else if (weight === '500') fontName = 'KantumruyPro-Medium';
      else if (weight === '600') fontName = 'KantumruyPro-SemiBold';
      else if (weight === '700') fontName = 'KantumruyPro-Bold';
      return { fontFamily: fontName, fontWeight: 'normal' };
    }
    case 'battambang': {
      const fontName = weight === '700' || weight === '600' ? 'Battambang-Bold' : 'Battambang-Regular';
      return { fontFamily: fontName, fontWeight: 'normal' };
    }
    case 'moul': {
      return { fontFamily: 'Moul-Regular', fontWeight: 'normal' };
    }
    case 'kdamThmor': {
      return { fontFamily: 'KdamThmorPro-Regular', fontWeight: 'normal' };
    }
    case 'inter': {
      let fontName = 'Inter-Regular';
      if (weight === '300') fontName = 'Inter-Light';
      else if (weight === '400') fontName = 'Inter-Regular';
      else if (weight === '500') fontName = 'Inter-Medium';
      else if (weight === '600') fontName = 'Inter-SemiBold';
      else if (weight === '700') fontName = 'Inter-Bold';
      return { fontFamily: fontName, fontWeight: 'normal' };
    }
    case 'system':
    default:
      return { fontFamily: undefined, fontWeight: weight };
  }
}

/**
 * Returns scaled sizes for various typography tiers
 */
export function getTypographySizes(scaleFactor: FontSizeScale) {
  const factor = FONT_SIZE_SCALES[scaleFactor].scale;
  return {
    caption: Math.round(12 * factor),
    sm: Math.round(14 * factor),
    body: Math.round(16 * factor),
    title: Math.round(18 * factor),
    subtitle: Math.round(20 * factor),
    headline: Math.round(24 * factor),
    hero: Math.round(30 * factor),
  };
}
