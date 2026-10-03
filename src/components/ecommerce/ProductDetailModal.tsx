import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { Product } from '../../types/ecommerce';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { ThemedCard } from '../ThemedCard';

export interface ProductDetailModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  visible,
  onClose,
  onOpenCart,
}) => {
  const { colors, borderRadius, language, t } = useAppTheme();
  const { addToCart, isInWishlist, toggleWishlist } = useEcommerce();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const title = language === 'km' ? product.titleKm : product.titleEn;
  const description = language === 'km' ? product.descKm : product.descEn;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    onOpenCart?.();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.65)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            maxHeight: '90%',
            backgroundColor: colors.surface,
            borderTopLeftRadius: Math.min(borderRadius + 8, 28),
            borderTopRightRadius: Math.min(borderRadius + 8, 28),
            overflow: 'hidden',
          }}
        >
          {/* Top Header / Image Area */}
          <View
            style={{
              width: '100%',
              height: 220,
              backgroundColor: product.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Ionicons name={product.iconName as any} size={84} color="#334155" />

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="close" size={22} color="#0F172A" />
            </Pressable>

            {/* Favorite Button */}
            <Pressable
              onPress={() => toggleWishlist(product.id)}
              style={({ pressed }) => [
                {
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorited ? '#EF4444' : '#64748B'}
              />
            </Pressable>

            {/* Category Pill */}
            <View
              style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                backgroundColor: 'rgba(0,0,0,0.65)',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <ThemedText variant="caption" weight="600" style={{ color: '#FFFFFF' }}>
                {product.category.toUpperCase()}
              </ThemedText>
            </View>
          </View>

          {/* Details ScrollView */}
          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            {/* Title & Price */}
            <View style={{ gap: 6 }}>
              <ThemedText variant="headline" weight="700">
                {title}
              </ThemedText>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <ThemedText variant="hero" weight="700" color="primary">
                    ${product.price.toFixed(2)}
                  </ThemedText>
                  {product.originalPrice && (
                    <ThemedText
                      variant="title"
                      color="muted"
                      style={{ textDecorationLine: 'line-through' }}
                    >
                      ${product.originalPrice.toFixed(2)}
                    </ThemedText>
                  )}
                </View>

                {/* Rating */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="star" size={18} color="#F59E0B" />
                  <ThemedText variant="title" weight="700">
                    {product.rating.toFixed(1)}
                  </ThemedText>
                  <ThemedText variant="caption" color="muted">
                    ({product.reviewsCount} {t('ratingReviews')})
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Stock indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: product.stock > 0 ? colors.success : colors.error,
                }}
              />
              <ThemedText variant="sm" weight="600" color={product.stock > 0 ? 'success' : 'error'}>
                {product.stock > 0
                  ? `${product.stock} ${t('stockRemaining')}`
                  : t('outOfStock')}
              </ThemedText>
            </View>

            {/* Vendor Card */}
            <ThemedCard variant="surface" padding="sm">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primaryContainer,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="storefront" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="caption" color="secondary">
                    {t('soldBy')}
                  </ThemedText>
                  <ThemedText variant="body" weight="600">
                    {product.vendorName}
                  </ThemedText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.success} />
                  <ThemedText variant="caption" weight="600" color="success">
                    Verified
                  </ThemedText>
                </View>
              </View>
            </ThemedCard>

            {/* Description */}
            <View style={{ gap: 6 }}>
              <ThemedText variant="title" weight="700">
                {t('productDescription')}
              </ThemedText>
              <ThemedText variant="body" color="secondary" style={{ lineHeight: 22 }}>
                {description}
              </ThemedText>
            </View>

            {/* Quantity Stepper */}
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
              <ThemedText variant="title" weight="600">
                {t('selectQuantity')}
              </ThemedText>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.cardSecondary,
                  borderRadius: Math.min(borderRadius, 12),
                  padding: 4,
                  gap: 12,
                }}
              >
                <Pressable
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="remove" size={18} color={colors.text} />
                </Pressable>

                <ThemedText variant="title" weight="700" style={{ minWidth: 24, textAlign: 'center' }}>
                  {quantity}
                </ThemedText>

                <Pressable
                  onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="add" size={18} color={colors.text} />
                </Pressable>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <ThemedButton
                title={t('addToCart')}
                variant="secondary"
                size="lg"
                icon={<Ionicons name="cart" size={18} color={colors.primary} />}
                onPress={handleAddToCart}
                style={{ flex: 1 }}
              />
              <ThemedButton
                title={t('buyNow')}
                variant="primary"
                size="lg"
                icon={<Ionicons name="flash" size={18} color={colors.onPrimary} />}
                onPress={handleBuyNow}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
