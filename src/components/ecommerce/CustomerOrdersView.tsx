import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { ThemedText } from '../ThemedText';
import { ThemedCard } from '../ThemedCard';
import { ThemedButton } from '../ThemedButton';
import { CartSheet } from './CartSheet';

export const CustomerOrdersView: React.FC = () => {
  const { colors, language, t } = useAppTheme();
  const { orders, cartCount } = useEcommerce();
  const [cartVisible, setCartVisible] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      {/* Quick Cart Banner */}
      <ThemedCard
        padding="md"
        onPress={() => setCartVisible(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
          borderWidth: 1.5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="cart" size={22} color={colors.onPrimary} />
          </View>
          <View>
            <ThemedText variant="title" weight="700">
              {t('cartTitle')}
            </ThemedText>
            <ThemedText variant="caption" color="secondary">
              {cartCount > 0 ? `${cartCount} items ready for checkout` : t('cartEmpty')}
            </ThemedText>
          </View>
        </View>

        <ThemedButton
          title={t('checkoutNow')}
          variant="primary"
          size="sm"
          onPress={() => setCartVisible(true)}
        />
      </ThemedCard>

      {/* Orders List Section */}
      <View style={{ gap: 10 }}>
        <ThemedText variant="title" weight="700">
          {t('ordersTitle')} ({orders.length})
        </ThemedText>

        {orders.length === 0 ? (
          <ThemedCard padding="lg" style={{ alignItems: 'center', gap: 10 }}>
            <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
            <ThemedText variant="title" weight="600">
              {t('ordersEmpty')}
            </ThemedText>
            <ThemedText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
              {t('ordersEmptySubtitle')}
            </ThemedText>
          </ThemedCard>
        ) : (
          orders.map((order) => {
            const statusColor =
              order.status === 'delivered'
                ? colors.success
                : order.status === 'shipped'
                ? colors.primary
                : order.status === 'processing'
                ? '#F59E0B'
                : '#94A3B8';

            const statusText =
              order.status === 'delivered'
                ? t('orderStatusDelivered')
                : order.status === 'shipped'
                ? t('orderStatusShipped')
                : order.status === 'processing'
                ? t('orderStatusProcessing')
                : t('orderStatusPending');

            return (
              <ThemedCard key={order.id} padding="md" style={{ gap: 12 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <ThemedText variant="title" weight="700">
                      {order.id}
                    </ThemedText>
                    <ThemedText variant="caption" color="muted">
                      {order.date}
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
                      {statusText}
                    </ThemedText>
                  </View>
                </View>

                {/* Items */}
                <View style={{ backgroundColor: colors.cardSecondary, padding: 10, borderRadius: 8, gap: 4 }}>
                  {order.items.map((it, idx) => (
                    <ThemedText key={idx} variant="sm">
                      • {it.quantity}x {language === 'km' ? it.product.titleKm : it.product.titleEn} (${it.product.price.toFixed(2)})
                    </ThemedText>
                  ))}
                  <ThemedText variant="caption" color="muted" style={{ marginTop: 4 }}>
                    📍 {order.address} • 💳 {order.paymentMethod}
                  </ThemedText>
                </View>

                {/* Total */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderSubtle,
                  }}
                >
                  <ThemedText variant="body" color="secondary">
                    {t('orderTotalLabel')}:
                  </ThemedText>
                  <ThemedText variant="title" weight="700" color="primary">
                    ${order.total.toFixed(2)}
                  </ThemedText>
                </View>
              </ThemedCard>
            );
          })
        )}
      </View>

      <CartSheet
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
      />
    </View>
  );
};
