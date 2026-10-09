import React from 'react';
import { ScrollView, View } from 'react-native';
import { ThemedHeader } from '../../src/components/ThemedHeader';
import { RoleBadgeSwitcher } from '../../src/components/ecommerce/RoleBadgeSwitcher';
import { useEcommerce } from '../../src/context/EcommerceContext';
import { useAppTheme } from '../../src/context/ThemeContext';

export default function MarketplaceScreen() {
  const { colors, t } = useAppTheme();
  const { role } = useEcommerce();

  const getScreenTitle = () => {
    switch (role) {
      case 'vendor':
        return t('vendorDashboard');
      case 'admin':
        return t('adminConsole');
      case 'customer':
      default:
        return t('appTitle');
    }
  };

  const getScreenSubtitle = () => {
    switch (role) {
      case 'vendor':
        return 'Angkor Heritage & Tech Store • Inventory & Sales';
      case 'admin':
        return 'Multi-Merchant Governance & Platform Analytics';
      case 'customer':
      default:
        return t('appSubtitle');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader
        title={getScreenTitle()}
        subtitle={getScreenSubtitle()}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 60,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Switcher Pill */}
        <RoleBadgeSwitcher />

      </ScrollView>
    </View>
  );
}
