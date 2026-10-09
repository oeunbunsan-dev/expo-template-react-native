import { productService } from '@/src/apis/services/product';
import { useAppTheme } from '@/src/context/ThemeContext';
import { useCartStore } from '@/src/stores/use-cart-store';
import { useWishlistStore } from '@/src/stores/use-wishlist-store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductDetails from '../components/ProductDetails';

interface ProductDetailsViewProps {
  slug: string | string[] | undefined;
}

export default function ProductDetailsView({ slug }: ProductDetailsViewProps) {
  const { colors } = useAppTheme();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [productDetails, setProductDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slugString = Array.isArray(slug) ? slug[0] : slug || '';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    productService
      .getProductBySlug(slugString)
      .then((res) => {
        if (isMounted) {
          const data = res?.data || res;
          setProductDetails(data);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err?.message || 'Could not find product');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slugString]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.barTitle, { color: colors.text }]} numberOfLines={1}>
          {productDetails?.name || 'Product Details'}
        </Text>

        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => router.push('/(customer)/wishlist')}
            style={styles.iconBtn}
          >
            <Ionicons name="heart-outline" size={22} color={colors.text} />
            {wishlistItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(customer)/(tabs)/orders')}
            style={styles.iconBtn}
          >
            <Ionicons name="bag-handle-outline" size={22} color={colors.text} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.textMuted }}>Loading product...</Text>
        </View>
      ) : error || !productDetails ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Product Not Found</Text>
          <Text style={[styles.errorSub, { color: colors.textMuted }]}>
            {error || 'This product might be out of stock or unpublished.'}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backHomeBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Back to Shop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ProductDetails productDetailsObj={productDetails} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  barTitle: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  iconBtn: {
    position: 'relative',
    padding: 6,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  errorSub: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
  },
  backHomeBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
