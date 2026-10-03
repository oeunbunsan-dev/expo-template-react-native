import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { Product } from '../../types/ecommerce';
import { ThemedCard } from '../ThemedCard';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';

export interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { colors, language, t } = useAppTheme();
  const { addToCart, isInWishlist, toggleWishlist } = useEcommerce();

  const isFavorited = isInWishlist(product.id);
  const title = language === 'km' ? product.titleKm : product.titleEn;

  return (
    <ThemedCard
      padding="none"
      onPress={() => onPress(product)}
      style={{
        width: '48%',
        overflow: 'hidden',
        marginBottom: 14,
      }}
    >
      {/* Product Image / Illustration Banner */}
      <View
        style={{
          width: '100%',
          aspectRatio: 1.15,
          backgroundColor: product.accentBg,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Ionicons
          name={product.iconName as any}
          size={52}
          color="#334155"
        />

        {/* Promo Badge */}
        {product.badge && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: colors.primary,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
            }}
          >
            <ThemedText
              variant="caption"
              weight="700"
              style={{ color: colors.onPrimary, fontSize: 10 }}
            >
              {product.badge}
            </ThemedText>
          </View>
        )}

        {/* Wishlist Heart */}
        <Pressable
          onPress={() => toggleWishlist(product.id)}
          style={({ pressed }) => [
            {
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorited ? '#EF4444' : '#64748B'}
          />
        </Pressable>
      </View>

      {/* Details Body */}
      <View style={{ padding: 12, gap: 6 }}>
        {/* Vendor tag */}
        <ThemedText variant="caption" color="muted" numberOfLines={1}>
          {product.vendorName}
        </ThemedText>

        {/* Title */}
        <ThemedText
          variant="body"
          weight="600"
          numberOfLines={2}
          style={{ height: 42 }}
        >
          {title}
        </ThemedText>

        {/* Rating & Review */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <ThemedText variant="caption" weight="700">
            {product.rating.toFixed(1)}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            ({product.reviewsCount})
          </ThemedText>
        </View>

        {/* Pricing */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <ThemedText variant="title" weight="700" color="primary">
            ${product.price.toFixed(2)}
          </ThemedText>
          {product.originalPrice && (
            <ThemedText
              variant="caption"
              color="muted"
              style={{ textDecorationLine: 'line-through' }}
            >
              ${product.originalPrice.toFixed(2)}
            </ThemedText>
          )}
        </View>

        {/* Quick Add to Cart Button */}
        <ThemedButton
          title={t('addToCart')}
          variant="secondary"
          size="sm"
          icon={<Ionicons name="cart" size={14} color={colors.primary} />}
          onPress={() => addToCart(product, 1)}
          style={{ marginTop: 4, width: '100%' }}
        />
      </View>
    </ThemedCard>
  );
};
