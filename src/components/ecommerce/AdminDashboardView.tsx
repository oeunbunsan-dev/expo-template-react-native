import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { ThemedText } from '../ThemedText';
import { ThemedCard } from '../ThemedCard';
import { ThemedButton } from '../ThemedButton';
import { StatCard } from './StatCard';

export const AdminDashboardView: React.FC = () => {
  const { colors, language, t } = useAppTheme();
  const { vendors, toggleVendorStatus, orders, platformMetrics } = useEcommerce();

  return (
    <View style={{ gap: 20 }}>
      {/* Executive Header Banner */}
      <ThemedCard
        padding="md"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: '#8B5CF6',
          backgroundColor: colors.surfaceElevated,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="shield-checkmark" size={26} color="#8B5CF6" />
            </View>

            <View style={{ gap: 2 }}>
              <ThemedText variant="title" weight="700">
                {t('adminConsole')}
              </ThemedText>
              <ThemedText variant="caption" color="secondary">
                Executive Overseer & Multi-Vendor Engine • SDK 54
              </ThemedText>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
            }}
          >
            <ThemedText variant="caption" weight="700" style={{ color: '#8B5CF6' }}>
              SuperAdmin
            </ThemedText>
          </View>
        </View>
      </ThemedCard>

      {/* Platform Executive Metrics Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard
          title={t('platformGmv')}
          value={`$${platformMetrics.totalGmv.toLocaleString()}`}
          icon="trending-up"
          iconColor="#10B981"
          trend="+24.6% YoY"
          isPositive
        />
        <StatCard
          title={t('commissionRevenue')}
          value={`$${platformMetrics.commissionEarned.toLocaleString()}`}
          icon="pie-chart-outline"
          iconColor="#8B5CF6"
          trend="8.0% Take Rate"
        />
        <StatCard
          title={t('totalMerchants')}
          value={`${platformMetrics.activeVendors} Active`}
          icon="storefront-outline"
          iconColor="#F59E0B"
        />
        <StatCard
          title={t('totalPlatformOrders')}
          value={`${platformMetrics.totalOrders}`}
          icon="cart-outline"
          iconColor={colors.primary}
          trend="+310 this week"
        />
      </View>

      {/* Merchant Governance & Approvals */}
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText variant="title" weight="700">
            {t('vendorManagementTitle')} ({vendors.length})
          </ThemedText>
          <ThemedText variant="caption" color="secondary">
            {t('commissionRateLabel')}
          </ThemedText>
        </View>

        {vendors.map((vendor) => {
          const name = language === 'km' ? vendor.nameKm : vendor.name;
          const isActive = vendor.status === 'active';
          const isPending = vendor.status === 'pending';

          const badgeBg = isActive
            ? 'rgba(16, 185, 129, 0.15)'
            : isPending
            ? 'rgba(245, 158, 11, 0.15)'
            : 'rgba(239, 68, 68, 0.15)';
          const badgeText = isActive
            ? colors.success
            : isPending
            ? '#F59E0B'
            : colors.error;

          return (
            <ThemedCard key={vendor.id} padding="md" style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ gap: 2 }}>
                  <ThemedText variant="title" weight="700">
                    {name}
                  </ThemedText>
                  <ThemedText variant="caption" color="secondary">
                    Owner: {vendor.ownerName} • Joined: {vendor.joinedDate}
                  </ThemedText>
                </View>

                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: badgeBg,
                  }}
                >
                  <ThemedText variant="caption" weight="700" style={{ color: badgeText }}>
                    {vendor.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              {/* Stats row */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: colors.cardSecondary,
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <ThemedText variant="caption" color="secondary">
                  Sales: <ThemedText variant="caption" weight="700">{vendor.salesCount}</ThemedText>
                </ThemedText>
                <ThemedText variant="caption" color="secondary">
                  Revenue: <ThemedText variant="caption" weight="700">${vendor.revenue.toLocaleString()}</ThemedText>
                </ThemedText>
                <ThemedText variant="caption" color="secondary">
                  Rating: <ThemedText variant="caption" weight="700">{vendor.rating} ★</ThemedText>
                </ThemedText>
              </View>

              {/* Action Button */}
              <ThemedButton
                title={isActive ? t('suspendVendorBtn') : t('approveVendorBtn')}
                variant={isActive ? 'outline' : 'primary'}
                size="sm"
                onPress={() => toggleVendorStatus(vendor.id)}
                style={isActive ? { borderColor: colors.error } : undefined}
                textStyle={isActive ? { color: colors.error } : undefined}
              />
            </ThemedCard>
          );
        })}
      </View>

      {/* Platform Orders Ledger */}
      <View style={{ gap: 10, marginTop: 10 }}>
        <ThemedText variant="title" weight="700">
          {t('platformOrdersLedgerTitle')}
        </ThemedText>

        {orders.map((ord) => (
          <ThemedCard key={ord.id} padding="sm">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <ThemedText variant="body" weight="700">
                  {ord.id} • ${ord.total.toFixed(2)}
                </ThemedText>
                <ThemedText variant="caption" color="secondary">
                  {ord.customerName} • {ord.paymentMethod}
                </ThemedText>
              </View>

              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: colors.cardSecondary,
                }}
              >
                <ThemedText variant="caption" weight="600" color="primary">
                  {ord.status.toUpperCase()}
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
        ))}
      </View>
    </View>
  );
};
