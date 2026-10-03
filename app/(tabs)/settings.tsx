import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/context/ThemeContext';
import { useEcommerce } from '../../src/context/EcommerceContext';
import { ThemedText } from '../../src/components/ThemedText';
import { ThemedCard } from '../../src/components/ThemedCard';
import { ThemedButton } from '../../src/components/ThemedButton';
import { ThemedHeader } from '../../src/components/ThemedHeader';
import { SettingsSection } from '../../src/components/SettingsSection';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { ColorSeedPicker } from '../../src/components/ColorSeedPicker';
import { LiveThemePreview } from '../../src/components/LiveThemePreview';
import { RoleBadgeSwitcher } from '../../src/components/ecommerce/RoleBadgeSwitcher';
import { UserProfileCard } from '../../src/components/auth/UserProfileCard';
import { FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS, resolveFontFamilyAndWeight } from '../../src/constants/typography';
import { FontSizeScale, FontWeightOption, RadiusOption, ThemeId, ThemeMode } from '../../src/types/theme';

export default function SettingsScreen() {
  const {
    colors,
    borderRadius,
    themeId,
    setThemeId,
    mode,
    setMode,
    fontSizeScale,
    setFontSizeScale,
    fontFamily,
    setFontFamily,
    fontWeight,
    setFontWeight,
    language,
    setLanguage,
    radius,
    setRadius,
    applyPreset,
    resetDefaults,
    t,
  } = useAppTheme();

  const { role, setRole } = useEcommerce();
  const [showResetModal, setShowResetModal] = useState(false);

  // 5 Themes metadata
  const themeList: { id: ThemeId; nameKey: string; descKey: string; lightBg: string; darkBg: string }[] = [
    {
      id: 'modern',
      nameKey: 'themeModern',
      descKey: 'themeModernDesc',
      lightBg: '#F8FAFC',
      darkBg: '#0B0F17',
    },
    {
      id: 'midnight',
      nameKey: 'themeMidnight',
      descKey: 'themeMidnightDesc',
      lightBg: '#F5F5F7',
      darkBg: '#000000',
    },
    {
      id: 'sunset',
      nameKey: 'themeSunset',
      descKey: 'themeSunsetDesc',
      lightBg: '#FDFBF7',
      darkBg: '#151210',
    },
    {
      id: 'emerald',
      nameKey: 'themeEmerald',
      descKey: 'themeEmeraldDesc',
      lightBg: '#F2F8F5',
      darkBg: '#071510',
    },
    {
      id: 'cyberpunk',
      nameKey: 'themeCyberpunk',
      descKey: 'themeCyberpunkDesc',
      lightBg: '#F7F6FD',
      darkBg: '#080512',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader
        title={t('settingsTitle')}
        subtitle={t('settingsSubtitle')}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 60,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Account & Persona Section */}
        <SettingsSection
          icon={<Ionicons name="person-circle" size={16} color={colors.primary} />}
          title={t('profileHeader')}
          description="Active session, authenticated persona & account details"
        >
          <UserProfileCard />
        </SettingsSection>

        {/* Marketplace Role Switcher Section */}
        <SettingsSection
          icon={<Ionicons name="people" size={16} color={colors.primary} />}
          title={t('switchRoleTitle')}
          description="Switch between Customer, Vendor, and Admin viewports"
        >
          <RoleBadgeSwitcher />

          <View style={{ gap: 8, marginTop: 4 }}>
            {[
              {
                id: 'customer' as const,
                titleKey: 'roleCustomer',
                descKey: 'roleCustomerDesc',
                icon: 'cart-outline',
              },
              {
                id: 'vendor' as const,
                titleKey: 'roleVendor',
                descKey: 'roleVendorDesc',
                icon: 'storefront-outline',
              },
              {
                id: 'admin' as const,
                titleKey: 'roleAdmin',
                descKey: 'roleAdminDesc',
                icon: 'shield-checkmark-outline',
              },
            ].map((r) => {
              const isSelected = role === r.id;
              return (
                <ThemedCard
                  key={r.id}
                  selected={isSelected}
                  onPress={() => setRole(r.id)}
                  padding="sm"
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <Ionicons
                        name={r.icon as any}
                        size={20}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="body" weight={isSelected ? '700' : '600'}>
                          {t(r.titleKey as any)}
                        </ThemedText>
                        <ThemedText variant="caption" color="secondary">
                          {t(r.descKey as any)}
                        </ThemedText>
                      </View>
                    </View>

                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={isSelected ? colors.primary : colors.textMuted}
                    />
                  </View>
                </ThemedCard>
              );
            })}
          </View>
        </SettingsSection>

        {/* Top: Live Interactive Preview */}
        <SettingsSection
          icon={<Ionicons name="eye" size={16} color={colors.primary} />}
          title={t('livePreview')}
          description={t('sectionAppearanceDesc')}
        >
          <LiveThemePreview />
        </SettingsSection>

        {/* 1. Theme Mode (System / Light / Dark) & 5 Themes */}
        <SettingsSection
          icon={<Ionicons name="color-filter" size={16} color={colors.primary} />}
          title={t('sectionAppearance')}
          description={t('sectionAppearanceDesc')}
        >
          {/* Mode Switcher */}
          <SegmentedControl<ThemeMode>
            selectedId={mode}
            onSelect={setMode}
            options={[
              {
                id: 'system',
                label: t('modeSystem'),
                icon: <Ionicons name="contrast" size={16} color={mode === 'system' ? colors.onPrimary : colors.textSecondary} />,
              },
              {
                id: 'light',
                label: t('modeLight'),
                icon: <Ionicons name="sunny" size={16} color={mode === 'light' ? colors.onPrimary : colors.textSecondary} />,
              },
              {
                id: 'dark',
                label: t('modeDark'),
                icon: <Ionicons name="moon" size={16} color={mode === 'dark' ? colors.onPrimary : colors.textSecondary} />,
              },
            ]}
          />

          {/* 5 Themes List Cards */}
          <View style={{ gap: 10, marginTop: 4 }}>
            {themeList.map((item) => {
              const isSelected = themeId === item.id;
              return (
                <ThemedCard
                  key={item.id}
                  selected={isSelected}
                  onPress={() => setThemeId(item.id)}
                  padding="md"
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      {/* Swatch preview split light/dark */}
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: Math.min(borderRadius, 12),
                          overflow: 'hidden',
                          flexDirection: 'row',
                          borderWidth: 1.5,
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                        }}
                      >
                        <View style={{ flex: 1, backgroundColor: item.lightBg }} />
                        <View style={{ flex: 1, backgroundColor: item.darkBg }} />
                      </View>

                      <View style={{ flex: 1 }}>
                        <ThemedText variant="title" weight={isSelected ? '700' : '600'}>
                          {t(item.nameKey as any)}
                        </ThemedText>
                        <ThemedText variant="caption" color="secondary" numberOfLines={1}>
                          {t(item.descKey as any)}
                        </ThemedText>
                      </View>
                    </View>

                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                      }}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
                      )}
                    </View>
                  </View>
                </ThemedCard>
              );
            })}
          </View>
        </SettingsSection>

        {/* 2. Color Seed (Primary Accent) */}
        <SettingsSection
          icon={<Ionicons name="prism" size={16} color={colors.primary} />}
          title={t('sectionSeed')}
          description={t('sectionSeedDesc')}
        >
          <ColorSeedPicker />
        </SettingsSection>

        {/* 3. Text Font Size */}
        <SettingsSection
          icon={<Ionicons name="text" size={16} color={colors.primary} />}
          title={t('sectionFontSize')}
          description={t('sectionFontSizeDesc')}
        >
          <SegmentedControl<FontSizeScale>
            selectedId={fontSizeScale}
            onSelect={setFontSizeScale}
            options={[
              { id: 'small', label: language === 'km' ? 'តូច 88%' : 'Small' },
              { id: 'medium', label: language === 'km' ? 'មធ្យម 100%' : 'Medium' },
              { id: 'large', label: language === 'km' ? 'ធំ 115%' : 'Large' },
              { id: 'xlarge', label: language === 'km' ? 'ធំបំផុត 130%' : 'X-Large' },
            ]}
          />

          <ThemedCard variant="surface" padding="sm" style={{ marginTop: 8 }}>
            <ThemedText variant="caption" color="muted">
              {language === 'km' ? 'ទិដ្ឋភាពទំហំអក្សរផ្ទាល់:' : 'Live Font Size Scale Preview:'}
            </ThemedText>
            <ThemedText variant="title" weight="600" style={{ marginVertical: 4 }}>
              {language === 'km' ? 'អក្សរទំហំចំណងជើង' : 'Scaled Title Typography'}
            </ThemedText>
            <ThemedText variant="body" color="secondary">
              {language === 'km'
                ? 'ទំហំអក្សរនេះត្រូវពង្រីក ឬបង្រួមគ្រប់ទីកន្លែងក្នុងកម្មវិធី។'
                : 'This text scales up and down smoothly according to your preferred size.'}
            </ThemedText>
          </ThemedCard>
        </SettingsSection>

        {/* 4. Font Family (including Khmer Fonts) */}
        <SettingsSection
          icon={<Ionicons name="library" size={16} color={colors.primary} />}
          title={t('sectionFontFamily')}
          description={t('sectionFontFamilyDesc')}
        >
          <View style={{ gap: 10 }}>
            {FONT_FAMILY_OPTIONS.map((item) => {
              const isSelected = fontFamily === item.id;
              const sampleFontConfig = resolveFontFamilyAndWeight(item.id, '600');

              return (
                <ThemedCard
                  key={item.id}
                  selected={isSelected}
                  onPress={() => setFontFamily(item.id)}
                  padding="md"
                >
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <ThemedText variant="title" weight={isSelected ? '700' : '600'}>
                          {item.name}
                        </ThemedText>
                        <ThemedText variant="sm" color="secondary">
                          ({item.nativeName})
                        </ThemedText>
                      </View>

                      {item.isKhmer && (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                            backgroundColor: colors.primaryContainer,
                          }}
                        >
                          <ThemedText variant="caption" weight="600" color="primary">
                            🇰🇭 Khmer
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    {/* Live typography preview of this specific font family */}
                    <View
                      style={{
                        backgroundColor: colors.cardSecondary,
                        padding: 10,
                        borderRadius: Math.min(borderRadius, 10),
                      }}
                    >
                      <ThemedText
                        style={{
                          fontFamily: sampleFontConfig.fontFamily,
                          fontWeight: sampleFontConfig.fontWeight,
                          fontSize: 16,
                          color: isSelected ? colors.primary : colors.text,
                        }}
                      >
                        {item.sampleKm}
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontFamily: sampleFontConfig.fontFamily,
                          fontWeight: sampleFontConfig.fontWeight,
                          fontSize: 13,
                          color: colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {item.sampleEn}
                      </ThemedText>
                    </View>
                  </View>
                </ThemedCard>
              );
            })}
          </View>
        </SettingsSection>

        {/* 5. Font Weight */}
        <SettingsSection
          icon={<Ionicons name="barbell" size={16} color={colors.primary} />}
          title={t('sectionFontWeight')}
          description={t('sectionFontWeightDesc')}
        >
          <SegmentedControl<FontWeightOption>
            selectedId={fontWeight}
            onSelect={setFontWeight}
            options={FONT_WEIGHT_OPTIONS.map((w) => ({
              id: w.id,
              label: w.label,
            }))}
          />

          <ThemedCard variant="surface" padding="sm" style={{ marginTop: 8 }}>
            <ThemedText
              variant="body"
              weight={fontWeight}
              style={{ textAlign: 'center', color: colors.text }}
            >
              {language === 'km'
                ? `កម្រាស់អក្សរដែលបានជ្រើសរើស: ${fontWeight} (អក្សរខ្មែរ និងឡាតាំង)`
                : `Active typographic weight: ${fontWeight} (Multilingual rendered)`}
            </ThemedText>
          </ThemedCard>
        </SettingsSection>

        {/* 6. Language Switcher (English default <-> Khmer) */}
        <SettingsSection
          icon={<Ionicons name="globe" size={16} color={colors.primary} />}
          title={t('sectionLanguage')}
          description={t('sectionLanguageDesc')}
        >
          <SegmentedControl
            selectedId={language}
            onSelect={(id) => setLanguage(id as any)}
            options={[
              {
                id: 'en',
                label: '🇬🇧 English (Default)',
              },
              {
                id: 'km',
                label: '🇰🇭 ភាសាខ្មែរ (Khmer)',
              },
            ]}
          />
        </SettingsSection>

        {/* 7. Corner Roundness ("and etc.") */}
        <SettingsSection
          icon={<Ionicons name="shapes" size={16} color={colors.primary} />}
          title={t('sectionRadius')}
          description={t('sectionRadiusDesc')}
        >
          <SegmentedControl<RadiusOption>
            selectedId={radius}
            onSelect={setRadius}
            options={[
              { id: 'sharp', label: language === 'km' ? 'ស្រួច' : 'Sharp' },
              { id: 'medium', label: language === 'km' ? 'រលោង' : 'Smooth' },
              { id: 'rounded', label: language === 'km' ? 'មូល' : 'Round' },
              { id: 'pill', label: language === 'km' ? 'ពងក្រពើ' : 'Pill' },
            ]}
          />
        </SettingsSection>

        {/* 8. Curated Style Presets */}
        <SettingsSection
          icon={<Ionicons name="sparkles" size={16} color={colors.primary} />}
          title={t('sectionPresets')}
          description={t('sectionPresetsDesc')}
        >
          <View style={{ gap: 10 }}>
            {[
              {
                id: 'khmerElegance' as const,
                titleKey: 'presetKhmerElegance',
                descKey: 'presetKhmerEleganceDesc',
                color: '#D97706',
              },
              {
                id: 'cyberpunkGlow' as const,
                titleKey: 'presetCyberpunkGlow',
                descKey: 'presetCyberpunkGlowDesc',
                color: '#06B6D4',
              },
              {
                id: 'oledMinimal' as const,
                titleKey: 'presetOledMinimal',
                descKey: 'presetOledMinimalDesc',
                color: '#7C3AED',
              },
              {
                id: 'nordicNature' as const,
                titleKey: 'presetNordicNature',
                descKey: 'presetNordicNatureDesc',
                color: '#10B981',
              },
            ].map((preset) => (
              <ThemedCard
                key={preset.id}
                onPress={() => applyPreset(preset.id)}
                padding="md"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: preset.color,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <ThemedText variant="title" weight="600">
                        {t(preset.titleKey as any)}
                      </ThemedText>
                      <ThemedText variant="caption" color="secondary">
                        {t(preset.descKey as any)}
                      </ThemedText>
                    </View>
                  </View>

                  <Ionicons name="arrow-forward" size={18} color={colors.primary} />
                </View>
              </ThemedCard>
            ))}
          </View>
        </SettingsSection>

        {/* 9. Reset Defaults & Persistence status */}
        <View style={{ gap: 12, marginTop: 12 }}>
          <ThemedButton
            title={t('resetDefaults')}
            variant="outline"
            icon={<Ionicons name="refresh" size={18} color={colors.primary} />}
            onPress={() => setShowResetModal(true)}
          />

          <View style={{ alignItems: 'center', gap: 4, marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="cloud-done-outline" size={14} color={colors.success} />
              <ThemedText variant="caption" color="muted">
                {t('savedAutomatically')}
              </ThemedText>
            </View>
            <ThemedText variant="caption" color="muted">
              {t('versionInfo')}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.65)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <ThemedCard style={{ width: '100%', maxWidth: 380, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="warning" size={20} color={colors.error} />
              </View>
              <ThemedText variant="title" weight="700">
                {t('resetConfirmTitle')}
              </ThemedText>
            </View>

            <ThemedText variant="body" color="secondary">
              {t('resetConfirmMessage')}
            </ThemedText>

            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <ThemedButton
                title={t('btnCancel')}
                variant="ghost"
                size="sm"
                onPress={() => setShowResetModal(false)}
              />
              <ThemedButton
                title={t('btnReset')}
                variant="primary"
                size="sm"
                onPress={() => {
                  resetDefaults();
                  setShowResetModal(false);
                }}
                style={{ backgroundColor: colors.error }}
              />
            </View>
          </ThemedCard>
        </View>
      </Modal>
    </View>
  );
}
