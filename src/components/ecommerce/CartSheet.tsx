import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { ThemedCard } from '../ThemedCard';

export interface CartSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({ visible, onClose }) => {
  const { colors, borderRadius, language, t } = useAppTheme();
  const { cart, cartTotal, updateQuantity, removeFromCart, placeOrder } = useEcommerce();

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [recipientName, setRecipientName] = useState('Bunsan Doe');
  const [phoneNumber, setPhoneNumber] = useState('+855 12 888 999');
  const [address, setAddress] = useState('St 2004, Sen Sok, Phnom Penh');
  const [paymentMethod, setPaymentMethod] = useState<'aba' | 'acleda' | 'cod'>('aba');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderCode, setLastOrderCode] = useState('');

  const handleConfirmOrder = () => {
    const paymentLabel =
      paymentMethod === 'aba'
        ? 'ABA PAY / KHQR'
        : paymentMethod === 'acleda'
        ? 'ACLEDA Mobile'
        : 'Cash on Delivery';

    const order = placeOrder({
      recipientName,
      phoneNumber,
      address,
      paymentMethod: paymentLabel,
    });

    setLastOrderCode(order.id);
    setCheckoutVisible(false);
    setOrderSuccess(true);
  };

  const handleFinishSuccess = () => {
    setOrderSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' }}>
        <View
          style={{
            maxHeight: '85%',
            backgroundColor: colors.surface,
            borderTopLeftRadius: Math.min(borderRadius + 8, 28),
            borderTopRightRadius: Math.min(borderRadius + 8, 28),
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderSubtle,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="cart" size={22} color={colors.primary} />
              <ThemedText variant="title" weight="700">
                {t('cartTitle')} ({cart.length})
              </ThemedText>
            </View>

            <Pressable
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.cardSecondary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          {cart.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="cart-outline" size={36} color={colors.primary} />
              </View>
              <ThemedText variant="title" weight="700">
                {t('cartEmpty')}
              </ThemedText>
              <ThemedText variant="body" color="secondary" style={{ textAlign: 'center' }}>
                {t('cartEmptySubtitle')}
              </ThemedText>
              <ThemedButton
                title={t('continueShopping')}
                variant="primary"
                onPress={onClose}
                style={{ marginTop: 12 }}
              />
            </View>
          ) : (
            <>
              {/* Item List */}
              <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                {cart.map((item) => {
                  const title = language === 'km' ? item.product.titleKm : item.product.titleEn;
                  return (
                    <ThemedCard key={item.product.id} padding="sm">
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {/* Icon thumb */}
                        <View
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: Math.min(borderRadius, 10),
                            backgroundColor: item.product.accentBg,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name={item.product.iconName as any} size={24} color="#334155" />
                        </View>

                        {/* Title & Price */}
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="body" weight="600" numberOfLines={1}>
                            {title}
                          </ThemedText>
                          <ThemedText variant="sm" weight="700" color="primary">
                            ${item.product.price.toFixed(2)}
                          </ThemedText>
                        </View>

                        {/* Stepper */}
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
                            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
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

                          <ThemedText variant="sm" weight="700" style={{ minWidth: 18, textAlign: 'center' }}>
                            {item.quantity}
                          </ThemedText>

                          <Pressable
                            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
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
                          onPress={() => removeFromCart(item.product.id)}
                          style={{ padding: 6 }}
                        >
                          <Ionicons name="trash-outline" size={18} color={colors.error} />
                        </Pressable>
                      </View>
                    </ThemedCard>
                  );
                })}
              </ScrollView>

              {/* Bottom Totals & Checkout Button */}
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderTopWidth: 1,
                  borderTopColor: colors.borderSubtle,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText variant="sm" color="secondary">
                    {t('cartSubtotal')}
                  </ThemedText>
                  <ThemedText variant="body" weight="600">
                    ${cartTotal.toFixed(2)}
                  </ThemedText>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText variant="sm" color="secondary">
                    {t('shippingFee')}
                  </ThemedText>
                  <ThemedText variant="sm" weight="700" color="success">
                    {t('freeShipping')}
                  </ThemedText>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderSubtle,
                  }}
                >
                  <ThemedText variant="title" weight="700">
                    {t('cartTotal')}
                  </ThemedText>
                  <ThemedText variant="headline" weight="700" color="primary">
                    ${cartTotal.toFixed(2)}
                  </ThemedText>
                </View>

                <ThemedButton
                  title={t('checkoutNow')}
                  variant="primary"
                  size="lg"
                  icon={<Ionicons name="card" size={18} color={colors.onPrimary} />}
                  onPress={() => setCheckoutVisible(true)}
                  style={{ marginTop: 6 }}
                />
              </View>
            </>
          )}
        </View>
      </View>

      {/* Checkout Form Modal */}
      <Modal visible={checkoutVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' }}>
          <View
            style={{
              maxHeight: '90%',
              backgroundColor: colors.surface,
              borderTopLeftRadius: Math.min(borderRadius + 8, 28),
              borderTopRightRadius: Math.min(borderRadius + 8, 28),
              padding: 20,
              gap: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText variant="headline" weight="700">
                {t('checkoutModalTitle')}
              </ThemedText>
              <Pressable onPress={() => setCheckoutVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ gap: 14 }}>
              {/* Recipient */}
              <View style={{ gap: 4 }}>
                <ThemedText variant="sm" weight="600">
                  {t('recipientName')}
                </ThemedText>
                <TextInput
                  value={recipientName}
                  onChangeText={setRecipientName}
                  style={{
                    backgroundColor: colors.cardSecondary,
                    color: colors.text,
                    padding: 12,
                    borderRadius: Math.min(borderRadius, 12),
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                />
              </View>

              {/* Phone */}
              <View style={{ gap: 4 }}>
                <ThemedText variant="sm" weight="600">
                  {t('phoneNumber')}
                </ThemedText>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: colors.cardSecondary,
                    color: colors.text,
                    padding: 12,
                    borderRadius: Math.min(borderRadius, 12),
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                />
              </View>

              {/* Address */}
              <View style={{ gap: 4 }}>
                <ThemedText variant="sm" weight="600">
                  {t('deliveryAddress')}
                </ThemedText>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  style={{
                    backgroundColor: colors.cardSecondary,
                    color: colors.text,
                    padding: 12,
                    borderRadius: Math.min(borderRadius, 12),
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                />
              </View>

              {/* Payment Option */}
              <View style={{ gap: 8 }}>
                <ThemedText variant="sm" weight="600">
                  {t('paymentMethod')}
                </ThemedText>

                {[
                  { id: 'aba' as const, label: t('abaPay'), icon: 'qr-code-outline' },
                  { id: 'acleda' as const, label: t('acledaPay'), icon: 'phone-portrait-outline' },
                  { id: 'cod' as const, label: t('cashOnDelivery'), icon: 'cash-outline' },
                ].map((item) => {
                  const isSelected = paymentMethod === item.id;
                  return (
                    <ThemedCard
                      key={item.id}
                      selected={isSelected}
                      onPress={() => setPaymentMethod(item.id)}
                      padding="sm"
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={isSelected ? colors.primary : colors.textSecondary}
                          />
                          <ThemedText variant="body" weight={isSelected ? '700' : '500'}>
                            {item.label}
                          </ThemedText>
                        </View>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={isSelected ? colors.primary : colors.textMuted}
                        />
                      </View>
                    </ThemedCard>
                  );
                })}
              </View>

              <ThemedButton
                title={`${t('confirmAndPay')} • $${cartTotal.toFixed(2)}`}
                variant="primary"
                size="lg"
                onPress={handleConfirmOrder}
                style={{ marginTop: 10 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Order Success Dialog */}
      <Modal visible={orderSuccess} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <ThemedCard style={{ width: '100%', maxWidth: 380, alignItems: 'center', gap: 14 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            </View>

            <ThemedText variant="headline" weight="700" style={{ textAlign: 'center' }}>
              {t('orderSuccessTitle')}
            </ThemedText>

            <ThemedText variant="body" color="secondary" style={{ textAlign: 'center' }}>
              {t('orderSuccessMessage')}
            </ThemedText>

            <View
              style={{
                backgroundColor: colors.cardSecondary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <ThemedText variant="title" weight="700" color="primary">
                {lastOrderCode}
              </ThemedText>
            </View>

            <ThemedButton
              title={t('continueShopping')}
              variant="primary"
              size="md"
              onPress={handleFinishSuccess}
              style={{ width: '100%', marginTop: 8 }}
            />
          </ThemedCard>
        </View>
      </Modal>
    </Modal>
  );
};
