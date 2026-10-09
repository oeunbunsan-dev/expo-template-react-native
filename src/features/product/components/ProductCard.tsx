import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
// Standard 2-column grid item width (subtracting screen padding and column gap)
const CARD_WIDTH = (width - 48) / 2;

// --- TypeScript Definitions ---
export interface ProductImageItem {
  id: string;
  url: string;
  isCover?: boolean;
  sortOrder?: number;
}

export interface ProductInventoryItem {
  quantity: number;
  reservedQuantity: number;
}

export interface ProductCardObject {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  basePrice: string;
  comparePrice?: string | null;
  ratingAvg?: string;
  ratingCount?: number;
  salesCount?: number;
  isFeatured?: boolean;
  brand?: {
    name: string;
  };
  images: ProductImageItem[];
  inventory?: ProductInventoryItem[];
}

interface ProductCartProps {
  productObj: ProductCardObject;
  onPressProduct?: (product: ProductCardObject) => void;
  onAddToCart?: (product: ProductCardObject) => void;
}

const ProductCart: React.FC<ProductCartProps> = ({
  productObj,
  onPressProduct,
  onAddToCart,
}) => {
  if (!productObj) return null;

  const {
    name,
    basePrice,
    comparePrice,
    ratingAvg,
    salesCount,
    brand,
    images,
    inventory,
    isFeatured,
  } = productObj;

  // Determine cover image (or fallback to the first image)
  const coverImage = images?.find((img) => img.isCover)?.url || images?.[0]?.url;

  // Calculate discount percentage
  const basePriceNum = parseFloat(basePrice);
  const comparePriceNum = comparePrice ? parseFloat(comparePrice) : 0;
  const discountPercent =
    comparePriceNum > basePriceNum
      ? Math.round(((comparePriceNum - basePriceNum) / comparePriceNum) * 100)
      : null;

  // Compute available inventory stock
  const totalStock =
    inventory?.reduce(
      (sum, item) => sum + (item.quantity - (item.reservedQuantity || 0)),
      0
    ) ?? 0;
  const isOutOfStock = totalStock <= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPressProduct?.(productObj)}
    >
      {/* Product Image & Badges */}
      <View style={styles.imageContainer}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Featured / Discount Badges */}
        <View style={styles.badgeColumn}>
          {discountPercent ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
            </View>
          ) : isFeatured ? (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          ) : null}
        </View>

        {/* Stock Out Overlay Badge */}
        {isOutOfStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Brand Name */}
        {brand?.name ? (
          <Text style={styles.brandText} numberOfLines={1}>
            {brand.name.toUpperCase()}
          </Text>
        ) : null}

        {/* Product Title */}
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>

        {/* Rating and Sales Count */}
        <View style={styles.ratingRow}>
          {ratingAvg && (
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>{ratingAvg}</Text>
            </View>
          )}
          {salesCount !== undefined && salesCount > 0 && (
            <Text style={styles.salesText}>({salesCount} sold)</Text>
          )}
        </View>

        {/* Price & Action Button */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.basePrice}>${basePrice}</Text>
            {discountPercent ? (
              <Text style={styles.comparePrice}>${comparePrice}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.cartButton, isOutOfStock && styles.cartButtonDisabled]}
            activeOpacity={0.7}
            disabled={isOutOfStock}
            onPress={() => onAddToCart?.(productObj)}
          >
            <Text style={styles.cartButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // Android elevation
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  badgeColumn: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  discountBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  featuredBadge: {
    backgroundColor: '#111827',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  outOfStockBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  salesText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceContainer: {
    flex: 1,
  },
  basePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  comparePrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: -2,
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
  },
});

export default ProductCart;
