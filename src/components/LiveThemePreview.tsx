import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';

export const LiveThemePreview: React.FC = () => {
  const { colors, borderRadius, themeId, colorSeed, fontFamily, fontWeight, language, t } =
    useAppTheme();

  return (
    <ThemedCard
      variant="elevated"
      style={{
        borderWidth: 2,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* Top Bar with Live Tag & Meta */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primaryContainer,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            gap: 6,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}
          />
          <ThemedText variant="caption" weight="600" color="primary">
            {t('livePreviewBadge')}
          </ThemedText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colorSeed,
              borderWidth: 1.5,
              borderColor: colors.cardBorder,
            }}
          />
          <ThemedText variant="caption" color="secondary" weight="500">
            {colorSeed}
          </ThemedText>
        </View>
      </View>

      {/* Title */}
      <ThemedText variant="title" weight="700" style={{ marginBottom: 6 }}>
        {t('livePreviewTitle')}
      </ThemedText>

      {/* Subtitle */}
      <ThemedText variant="sm" color="secondary" style={{ marginBottom: 12 }}>
        {t('livePreviewSubtitle')}
      </ThemedText>

      {/* Sample Body Text with both Latin & Khmer */}
      <View
        style={{
          backgroundColor: colors.cardSecondary,
          padding: 12,
          borderRadius: Math.min(borderRadius, 14),
          marginBottom: 16,
          borderLeftWidth: 3,
          borderLeftColor: colors.primary,
        }}
      >
        <ThemedText variant="body" style={{ marginBottom: 6 }}>
          {t('livePreviewBody')}
        </ThemedText>
        <ThemedText variant="caption" color="muted">
          Theme: {themeId} • Font: {fontFamily} • Weight: {fontWeight} • Lang: {language.toUpperCase()}
        </ThemedText>
      </View>

      {/* Action Row */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <ThemedButton
          title={t('btnPrimary')}
          variant="primary"
          size="sm"
          icon={<Ionicons name="sparkles" size={16} color={colors.onPrimary} />}
          style={{ flex: 1 }}
        />
        <ThemedButton
          title={t('btnOutline')}
          variant="outline"
          size="sm"
          style={{ flex: 1 }}
        />
      </View>
    </ThemedCard>
  );
};
