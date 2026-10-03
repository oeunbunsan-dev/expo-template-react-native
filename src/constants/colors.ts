export interface SeedPreset {
  id: string;
  nameEn: string;
  nameKm: string;
  hex: string;
}

export const SEED_PRESETS: SeedPreset[] = [
  { id: 'royal-blue', nameEn: 'Royal Blue', nameKm: 'ខៀវរាជវង្ស', hex: '#2563EB' },
  { id: 'radiant-violet', nameEn: 'Radiant Violet', nameKm: 'ស្វាយរស្មី', hex: '#7C3AED' },
  { id: 'emerald-jewel', nameEn: 'Emerald Green', nameKm: 'ត្បូងមរកត', hex: '#059669' },
  { id: 'sunset-amber', nameEn: 'Sunset Amber', nameKm: 'ទឹកក្រូចពន្លឺ', hex: '#D97706' },
  { id: 'ruby-rose', nameEn: 'Ruby Rose', nameKm: 'ផ្កាកុលាប', hex: '#E11D48' },
  { id: 'cyber-cyan', nameEn: 'Cyber Cyan', nameKm: 'ខៀវផ្ទៃមេឃ', hex: '#06B6D4' },
  { id: 'solar-orange', nameEn: 'Solar Orange', nameKm: 'ក្រូចឆេះ', hex: '#EA580C' },
  { id: 'mint-fresh', nameEn: 'Mint Fresh', nameKm: 'ជីរអង្កាម', hex: '#10B981' },
  { id: 'indigo-aura', nameEn: 'Indigo Aura', nameKm: 'ឥណ្ឌីហ្គោ', hex: '#6366F1' },
  { id: 'deep-crimson', nameEn: 'Crimson Red', nameKm: 'ក្រហមឈាមជ្រូក', hex: '#DC2626' },
];

export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
}

export function normalizeHex(hex: string): string {
  let cleaned = hex.trim();
  if (!cleaned.startsWith('#')) {
    cleaned = '#' + cleaned;
  }
  if (cleaned.length === 4) {
    cleaned = '#' + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2] + cleaned[3] + cleaned[3];
  }
  return isValidHex(cleaned) ? cleaned.toUpperCase() : '#2563EB';
}

export function hexToRgba(hex: string, alpha: number): string {
  const norm = normalizeHex(hex);
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function adjustLightness(hex: string, percent: number): string {
  const norm = normalizeHex(hex);
  let r = parseInt(norm.slice(1, 3), 16);
  let g = parseInt(norm.slice(3, 5), 16);
  let b = parseInt(norm.slice(5, 7), 16);

  const amount = Math.round(255 * (percent / 100));
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`.toUpperCase();
}

export function getContrastTextColor(hex: string): string {
  const norm = normalizeHex(hex);
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);

  // Relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0F172A' : '#FFFFFF';
}
