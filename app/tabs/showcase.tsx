import React, { useState } from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/context/ThemeContext';
import { ThemedHeader } from '../../src/components/ThemedHeader';
import { ThemedText } from '../../src/components/ThemedText';
import { ThemedCard } from '../../src/components/ThemedCard';
import { ThemedButton } from '../../src/components/ThemedButton';
import { SettingsSection } from '../../src/components/SettingsSection';

export default function ShowcaseScreen() {
  const { colors, borderRadius, fontFamilyResolved, language, t } = useAppTheme();
  const [testText, setTestText] = useState('');
  const [toggleState, setToggleState] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader
        title={t('showcaseTitle')}
        subtitle={t('showcaseSubtitle')}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 60,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Typography Tester Input */}
        <ThemedCard padding="md">
          <ThemedText variant="title" weight="700" style={{ marginBottom: 6 }}>
            {language === 'km' ? 'សាកល្បងវាយអត្ថបទផ្ទាល់' : 'Interactive Type Tester'}
          </ThemedText>
          <ThemedText variant="caption" color="secondary" style={{ marginBottom: 12 }}>
            {language === 'km'
              ? 'វាយបញ្ចូលអក្សរខ្មែរ ឬឡាតាំងដើម្បីមើលការបង្ហាញ'
              : 'Type below to see active font, weight and scale in action'}
          </ThemedText>

          <TextInput
            value={testText}
            onChangeText={setTestText}
            placeholder={t('sampleInputPlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.cardSecondary,
              color: colors.text,
              padding: 12,
              borderRadius: Math.min(borderRadius, 12),
              fontSize: 16,
              fontFamily: fontFamilyResolved.fontFamily,
              fontWeight: fontFamilyResolved.fontWeight,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              marginBottom: 10,
            }}
          />

          {testText ? (
            <View
              style={{
                padding: 12,
                backgroundColor: colors.primaryContainer,
                borderRadius: Math.min(borderRadius, 10),
              }}
            >
              <ThemedText variant="hero" color="primary">
                {testText}
              </ThemedText>
            </View>
          ) : null}
        </ThemedCard>

        {/* 1. Typographic Scale Showcase */}
        <SettingsSection
          icon={<Ionicons name="text" size={16} color={colors.primary} />}
          title={t('showcaseHeadings')}
        >
          <ThemedCard padding="md" style={{ gap: 14 }}>
            <View style={{ gap: 4 }}>
              <ThemedText variant="caption" color="muted">HERO SCALE</ThemedText>
              <ThemedText variant="hero">
                {language === 'km' ? 'ចំណងជើងធំបំផុត Hero' : 'Hero Heading 30px'}
              </ThemedText>
            </View>

            <View style={{ gap: 4 }}>
              <ThemedText variant="caption" color="muted">HEADLINE SCALE</ThemedText>
              <ThemedText variant="headline">
                {language === 'km' ? 'ចំណងជើងធំ Headline' : 'Headline Title 24px'}
              </ThemedText>
            </View>

            <View style={{ gap: 4 }}>
              <ThemedText variant="caption" color="muted">SUBTITLE SCALE</ThemedText>
              <ThemedText variant="subtitle">
                {language === 'km' ? 'ចំណងជើងរង Subtitle' : 'Subtitle Level 20px'}
              </ThemedText>
            </View>

            <View style={{ gap: 4 }}>
              <ThemedText variant="caption" color="muted">TITLE SCALE</ThemedText>
              <ThemedText variant="title">
                {language === 'km' ? 'ចំណងជើង Title' : 'Section Title 18px'}
              </ThemedText>
            </View>

            <View style={{ gap: 4 }}>
              <ThemedText variant="caption" color="muted">BODY TEXT</ThemedText>
              <ThemedText variant="body" color="secondary">
                {language === 'km'
                  ? 'អក្សរតួសេចក្តីធម្មតា: ភាសាខ្មែរជាភាសាជាតិ និងផ្លូវការនៃប្រទេសកម្ពុជា។ ប្រព័ន្ធប្រតិបត្តិការ Expo SDK 54 ផ្តល់ជូននូវបទពិសោធន៍ដ៏អស្ចារ្យ។'
                  : 'Regular Body: The quick brown fox jumps over the lazy dog. A modular, accessible typography system designed for mobile elegance.'}
              </ThemedText>
            </View>

            <View style={{ gap: 4 }}>
              <ThemedText variant="caption" color="muted">CAPTION TEXT</ThemedText>
              <ThemedText variant="caption" color="muted">
                Caption tier 12px • Metadata • Timestamps • Footnotes
              </ThemedText>
            </View>
          </ThemedCard>
        </SettingsSection>

        {/* 2. Interactive Buttons Showcase */}
        <SettingsSection
          icon={<Ionicons name="hand-left" size={16} color={colors.primary} />}
          title={t('showcaseButtons')}
        >
          <ThemedCard padding="md" style={{ gap: 12 }}>
            <ThemedButton
              title={t('btnPrimary')}
              variant="primary"
              size="lg"
              icon={<Ionicons name="flash" size={18} color={colors.onPrimary} />}
            />

            <ThemedButton
              title={t('btnSecondary')}
              variant="secondary"
              size="md"
              icon={<Ionicons name="sparkles" size={18} color={colors.primary} />}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <ThemedButton
                title={t('btnOutline')}
                variant="outline"
                size="md"
                style={{ flex: 1 }}
              />
              <ThemedButton
                title={t('btnGhost')}
                variant="ghost"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </ThemedCard>
        </SettingsSection>

        {/* 3. Badges, Tags & Controls */}
        <SettingsSection
          icon={<Ionicons name="pricetags" size={16} color={colors.primary} />}
          title={t('showcaseBadges')}
        >
          <ThemedCard padding="md" style={{ gap: 16 }}>
            {/* Tag Pills */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: colors.primary,
                }}
              >
                <ThemedText variant="caption" weight="700" style={{ color: colors.onPrimary }}>
                  {t('tagActive')}
                </ThemedText>
              </View>

              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: colors.primaryContainer,
                }}
              >
                <ThemedText variant="caption" weight="600" color="primary">
                  {t('tagKhmerReady')}
                </ThemedText>
              </View>

              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: colors.cardSecondary,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                }}
              >
                <ThemedText variant="caption" weight="600" color="secondary">
                  {t('tagSdk54')}
                </ThemedText>
              </View>
            </View>

            {/* Switch Control */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.borderSubtle,
              }}
            >
              <ThemedText variant="body" weight="600">
                {t('switchLabel')}
              </ThemedText>
              <Switch
                value={toggleState}
                onValueChange={setToggleState}
                trackColor={{ false: colors.cardBorder, true: colors.primary }}
                thumbColor={colors.onPrimary}
              />
            </View>
          </ThemedCard>
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
