import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { ThemedText } from '../ThemedText';
import { ThemedCard } from '../ThemedCard';
import { ThemedButton } from '../ThemedButton';
import { StatCard } from './StatCard';
import { AddProductModal } from './AddProductModal';

export const VendorDashboardView: React.FC = () => {
  const { colors, borderRadius, language, t } = useAppTheme();
  const {
    vendorProducts,
    vendorOrders,
    vendorRevenue,
    updateProductStock,
    deleteProduct,
    updateOrderStatus,
  } = useEcommerce();

  const [addModalVisible, setAddModalVisible] = useState(false);

  const pendingCount = vendorOrders.filter((o) => o.status === 'pending' || o.status === 'processing').length;

  return (
    <View style={{ gap: 20 }}>
      {/* Store Profile Card */}
      <ThemedCard
        padding="md"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: '#F59E0B',
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
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="storefront" size={26} color="#F59E0B" />
            </View>

            <View style={{ gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ThemedText variant="title" weight="700">
                  {t('vendorStoreName')}
                </ThemedText>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              </View>
              <ThemedText variant="caption" color="secondary">
                Merchant ID: #VN-8842 • Siem Reap & Phnom Penh
              </ThemedText>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
            }}
          >
            <ThemedText variant="caption" weight="700" color="success">
              Active Store
            </ThemedText>
          </View>
        </View>
      </ThemedCard>

      {/* Analytics Metric Cards Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard
          title={t('vendorRevenue')}
          value={`$${vendorRevenue.toFixed(2)}`}
          icon="cash-outline"
          iconColor="#10B981"
          trend="+18.4%"
          isPositive
        />
        <StatCard
          title={t('vendorPendingOrders')}
          value={`${pendingCount}`}
          icon="time-outline"
          iconColor="#F59E0B"
          trend={`${pendingCount} to ship`}
          isPositive={pendingCount === 0}
        />
        <StatCard
          title={t('vendorTotalProducts')}
          value={`${vendorProducts.length}`}
          icon="cube-outline"
          iconColor={colors.primary}
        />
        <StatCard
          title={t('vendorRating')}
          value="4.9 ★"
          icon="star"
          iconColor="#F59E0B"
          trend="99.2% Positive"
        />
      </View>

      {/* Action Header: Inventory Management */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
        }}
      >
        <ThemedText variant="title" weight="700">
          {t('vendorInventoryTitle')} ({vendorProducts.length})
        </ThemedText>

        <ThemedButton
          title={t('addProductBtn')}
          variant="primary"
          size="sm"
          icon={<Ionicons name="add" size={16} color={colors.onPrimary} />}
          onPress={() => setAddModalVisible(true)}
        />
      </View>

      {/* Product Inventory List */}
      <View style={{ gap: 10 }}>
        {vendorProducts.map((prod) => {
          const title = language === 'km' ? prod.titleKm : prod.titleEn;
          return (
            <ThemedCard key={prod.id} padding="sm">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: Math.min(borderRadius, 10),
                    backgroundColor: prod.accentBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={prod.iconName as any} size={22} color="#334155" />
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText variant="body" weight="600" numberOfLines={1}>
                    {title}
                  </ThemedText>
                  <ThemedText variant="sm" weight="700" color="primary">
                    ${prod.price.toFixed(2)}
                  </ThemedText>
                </View>

                {/* Stock Controls */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.cardSecondary,
                    borderRadius: 8,
                    padding: 2,
                    gap: 6,
                  }}
                >
                  <Pressable
                    onPress={() => updateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: colors.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="remove" size={14} color={colors.text} />
                  </Pressable>

                  <View style={{ alignItems: 'center', minWidth: 38 }}>
                    <ThemedText variant="sm" weight="700">
                      {prod.stock}
                    </ThemedText>
                    <ThemedText variant="caption" color="muted" style={{ fontSize: 9 }}>
                      in stock
                    </ThemedText>
                  </View>

                  <Pressable
                    onPress={() => updateProductStock(prod.id, prod.stock + 1)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: colors.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="add" size={14} color={colors.text} />
                  </Pressable>
                </View>

                {/* Delete button */}
                <Pressable
                  onPress={() => deleteProduct(prod.id)}
                  style={{ padding: 6 }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </Pressable>
              </View>
            </ThemedCard>
          );
        })}
      </View>

      {/* Section: Customer Orders to Fulfill */}
      <View style={{ marginTop: 10, gap: 10 }}>
        <ThemedText variant="title" weight="700">
          {t('vendorOrdersTitle')} ({vendorOrders.length})
        </ThemedText>

        {vendorOrders.map((order) => {
          const statusColor =
            order.status === 'delivered'
              ? colors.success
              : order.status === 'shipped'
              ? colors.primary
              : order.status === 'processing'
              ? '#F59E0B'
              : '#94A3B8';

          return (
            <ThemedCard key={order.id} padding="md" style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <ThemedText variant="title" weight="700">
                    {order.id}
                  </ThemedText>
                  <ThemedText variant="caption" color="muted">
                    {order.customerName} • {order.date}
                  </ThemedText>
                </View>

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: colors.cardSecondary,
                    borderWidth: 1,
                    borderColor: statusColor,
                  }}
                >
                  <ThemedText variant="caption" weight="700" style={{ color: statusColor }}>
                    {order.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              {/* Items summary */}
              <View style={{ backgroundColor: colors.cardSecondary, padding: 8, borderRadius: 8 }}>
                {order.items.map((it, idx) => (
                  <ThemedText key={idx} variant="caption" color="secondary">
                    • {it.quantity}x {language === 'km' ? it.product.titleKm : it.product.titleEn} (${(it.product.price * it.quantity).toFixed(2)})
                  </ThemedText>
                ))}
              </View>

              {/* Total & Action row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 6,
                  borderTopWidth: 1,
                  borderTopColor: colors.borderSubtle,
                }}
              >
                <ThemedText variant="body" weight="700" color="primary">
                  Total: ${order.total.toFixed(2)}
                </ThemedText>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {order.status !== 'shipped' && order.status !== 'delivered' && (
                    <ThemedButton
                      title={t('markShippedBtn')}
                      variant="secondary"
                      size="sm"
                      onPress={() => updateOrderStatus(order.id, 'shipped')}
                    />
                  )}
                  {order.status === 'shipped' && (
                    <ThemedButton
                      title={t('markDeliveredBtn')}
                      variant="primary"
                      size="sm"
                      onPress={() => updateOrderStatus(order.id, 'delivered')}
                    />
                  )}
                </View>
              </View>
            </ThemedCard>
          );
        })}
      </View>

      {/* Add Product Modal */}
      <AddProductModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </View>
  );
};
