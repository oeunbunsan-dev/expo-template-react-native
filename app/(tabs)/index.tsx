import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/context/ThemeContext';
import { ThemedHeader } from '../../src/components/ThemedHeader';
import { ThemedText } from '../../src/components/ThemedText';
import { ThemedCard } from '../../src/components/ThemedCard';
import { ThemedButton } from '../../src/components/ThemedButton';

export default function OverviewScreen() {
  const router = useRouter();
  const {
    colors,
    borderRadius,
    themeId,
    setMode,
    colorSeed,
    fontFamily,
    fontWeight,
    language,
    isDark,
    t,
  } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader
        title={t('appTitle')}
        subtitle={t('appSubtitle')}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 60,
          gap: 18,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <ThemedCard
          variant="elevated"
          style={{
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.primary,
            borderWidth: 1.5,
            padding: 20,
            overflow: 'hidden',
          }}
        >
          {/* Subtle background glow circle */}
          <View
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: colors.primaryGlow,
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: colors.primaryContainer,
              }}
            >
              <ThemedText variant="caption" weight="700" color="primary">
                Expo SDK 54
              </ThemedText>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: colors.cardSecondary,
              }}
            >
              <ThemedText variant="caption" weight="600" color="secondary">
                {language === 'en' ? '🇬🇧 English Default' : '🇰🇭 ភាសាខ្មែរ'}
              </ThemedText>
            </View>
          </View>

          <ThemedText variant="headline" weight="700" style={{ marginBottom: 6 }}>
            {t('welcomeTitle')}
          </ThemedText>

          <ThemedText variant="body" color="secondary" style={{ marginBottom: 16 }}>
            {t('welcomeSubtitle')}
          </ThemedText>

          {/* Configuration Pills */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: colors.borderSubtle,
            }}
          >
            {/* Theme Badge */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardSecondary,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: Math.min(borderRadius, 12),
                gap: 6,
              }}
            >
              <Ionicons name="color-palette" size={14} color={colors.primary} />
              <ThemedText variant="caption" weight="600">
                {t(`theme${themeId.charAt(0).toUpperCase() + themeId.slice(1)}` as any)}
              </ThemedText>
            </View>

            {/* Seed Badge */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardSecondary,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: Math.min(borderRadius, 12),
                gap: 6,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: colorSeed,
                }}
              />
              <ThemedText variant="caption" weight="600">
                Seed: {colorSeed}
              </ThemedText>
            </View>

            {/* Font Badge */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardSecondary,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: Math.min(borderRadius, 12),
                gap: 6,
              }}
            >
              <Ionicons name="text" size={14} color={colors.primary} />
              <ThemedText variant="caption" weight="600">
                {fontFamily} ({fontWeight})
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        {/* Quick Action Grid */}
        <View style={{ gap: 10 }}>
          <ThemedText variant="title" weight="700">
            {t('quickActions')}
          </ThemedText>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <ThemedButton
              title={t('actionCustomize')}
              variant="primary"
              icon={<Ionicons name="options" size={18} color={colors.onPrimary} />}
              style={{ flex: 1 }}
              onPress={() => router.push('/(tabs)/settings' as any)}
            />

            <ThemedButton
              title={isDark ? t('modeLight') : t('modeDark')}
              variant="secondary"
              icon={
                <Ionicons
                  name={isDark ? 'sunny' : 'moon'}
                  size={18}
                  color={colors.primary}
                />
              }
              style={{ flex: 1 }}
              onPress={() => setMode(isDark ? 'light' : 'dark')}
            />
          </View>
        </View>

        {/* Dynamic Feature Highlights */}
        <View style={{ gap: 10 }}>
          <ThemedText variant="title" weight="700">
            {t('recentActivity')}
          </ThemedText>

          {[
            {
              icon: 'color-wand',
              titleKey: 'activity1Title',
              descKey: 'activity1Desc',
            },
            {
              icon: 'globe',
              titleKey: 'activity2Title',
              descKey: 'activity2Desc',
            },
            {
              icon: 'shield-checkmark',
              titleKey: 'activity3Title',
              descKey: 'activity3Desc',
            },
          ].map((item, idx) => (
            <ThemedCard key={idx} padding="md">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: Math.min(borderRadius, 14),
                    backgroundColor: colors.primaryContainer,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <ThemedText variant="title" weight="600">
                    {t(item.titleKey as any)}
                  </ThemedText>
                  <ThemedText variant="sm" color="secondary" style={{ marginTop: 2 }}>
                    {t(item.descKey as any)}
                  </ThemedText>
                </View>
              </View>
            </ThemedCard>
          ))}
        </View>

        {/* Typographic Harmony Quote Card */}
        <ThemedCard
          variant="surface"
          padding="lg"
          style={{
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
          }}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} style={{ marginBottom: 8 }} />
          <ThemedText variant="body" weight="500" style={{ fontStyle: 'italic', marginBottom: 8 }}>
            {t('quoteText')}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            {t('quoteAuthor')}
          </ThemedText>
        </ThemedCard>
      </ScrollView>
    </View>
  );
}
