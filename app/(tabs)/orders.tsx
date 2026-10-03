import React from 'react';
import { ScrollView, View } from 'react-native';
import { useAppTheme } from '../../src/context/ThemeContext';
import { useEcommerce } from '../../src/context/EcommerceContext';
import { ThemedHeader } from '../../src/components/ThemedHeader';
import { RoleBadgeSwitcher } from '../../src/components/ecommerce/RoleBadgeSwitcher';
import { CustomerOrdersView } from '../../src/components/ecommerce/CustomerOrdersView';
import { VendorDashboardView } from '../../src/components/ecommerce/VendorDashboardView';
import { AdminDashboardView } from '../../src/components/ecommerce/AdminDashboardView';

export default function OrdersScreen() {
  const { colors, t } = useAppTheme();
  const { role } = useEcommerce();

  const title =
    role === 'customer'
      ? t('navOrders')
      : role === 'vendor'
      ? t('vendorOrdersTitle')
      : t('platformOrdersLedgerTitle');

  const subtitle =
    role === 'customer'
      ? 'Live delivery tracking & order records'
      : role === 'vendor'
      ? 'Store fulfillment queue & shipping operations'
      : 'System-wide transactions audit & tracking';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader title={title} subtitle={subtitle} />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 60,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <RoleBadgeSwitcher />

        {role === 'customer' && <CustomerOrdersView />}
        {role === 'vendor' && <VendorDashboardView />}
        {role === 'admin' && <AdminDashboardView />}
      </ScrollView>
    </View>
  );
}
