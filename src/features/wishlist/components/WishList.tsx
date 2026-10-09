import { useAppTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WishListItemProps {
  item: any;
  onMoveToCart: (item: any) => void;
  onRemove: (item: any) => void;
  onPressItem: (item: any) => void;
}

export default function WishList({ item, onMoveToCart, onRemove, onPressItem }: WishListItemProps) {
  const { colors } = useAppTheme();

  const product = item.product || item;
  const coverImage =
    product.images?.find((img: any) => img.isCover)?.url ||
    product.images?.[0]?.url ||
    product.image;

  const price = Number(product.basePrice || product.price || 0);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPressItem(product)}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {/* Product Image */}
      <View style={styles.imageWrap}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: colors.card }]}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.name || product.titleEn || 'Wishlist Item'}
        </Text>

        {product.store && (
          <Text style={[styles.storeText, { color: colors.textMuted }]}>
            {product.store.name}
          </Text>
        )}

        <Text style={[styles.price, { color: colors.primary }]}>
          ${price.toFixed(2)}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionCol}>
        <TouchableOpacity
          onPress={() => onRemove(item)}
          style={[styles.iconBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onMoveToCart(item)}
          style={[styles.cartBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          <Text style={styles.cartBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  storeText: {
    fontSize: 11,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  actionCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  cartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
