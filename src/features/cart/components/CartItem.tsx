import { useAppTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CartItemProps {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const { colors } = useAppTheme();

  const product = item.product || {};
  const coverImage =
    product.images?.find((img: any) => img.isCover)?.url ||
    product.images?.[0]?.url ||
    item.image ||
    product.image;

  const price = Number(item.unitPrice || product.basePrice || 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Product Image */}
      <View style={styles.imageWrap}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: colors.card }]}>
            <Ionicons name="cube-outline" size={24} color={colors.textMuted} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.name || item.title || 'Product Item'}
        </Text>

        {item.variant && (
          <Text style={[styles.variantText, { color: colors.textMuted }]}>
            Variant: {item.variant.title || item.variant.sku}
          </Text>
        )}

        <Text style={[styles.price, { color: colors.primary }]}>
          ${price.toFixed(2)}
        </Text>
      </View>

      {/* Quantity Stepper & Remove */}
      <View style={styles.actionsCol}>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>

        <View style={[styles.stepper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TouchableOpacity onPress={onDecrease} style={styles.stepBtn}>
            <Ionicons name="remove" size={14} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity || 1}</Text>

          <TouchableOpacity onPress={onIncrease} style={styles.stepBtn}>
            <Ionicons name="add" size={14} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
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
  variantText: {
    fontSize: 11,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  actionsCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  removeBtn: {
    padding: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
    minWidth: 20,
    textAlign: 'center',
  },
});
