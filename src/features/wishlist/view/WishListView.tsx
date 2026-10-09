import { useAppTheme } from '@/src/context/ThemeContext';
import { useCartStore } from '@/src/stores/use-cart-store';
import { useWishlistStore } from '@/src/stores/use-wishlist-store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WishList from '../components/WishList';

export default function WishListView() {
  const { colors } = useAppTheme();
  const { items, fetchWishlist, removeFromWishlist, moveToCart, isLoading } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  const handleMoveToCart = async (item: any) => {
    const pId = item.productId || item.product?.id || item.id;
    try {
      await moveToCart(pId, item.variantId);
      await addToCart(pId, 1, item.variantId);
      Alert.alert('Added to Cart', 'Item transferred from wishlist to your active cart.');
    } catch {
      Alert.alert('Action Failed', 'Could not move item to cart.');
    }
  };

  const handleRemove = async (item: any) => {
    const pId = item.productId || item.product?.id || item.id;
    try {
      await removeFromWishlist(pId);
    } catch {
      Alert.alert('Error', 'Could not remove item.');
    }
  };

  const handlePressProduct = (product: any) => {
    if (product.slug) {
      router.push(`/(customer)/product/${product.slug}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Saved Favorites</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in wishlist
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(customer)/(tabs)/orders')}
          style={[styles.cartBadgeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="bag-handle-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isLoading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading saved items...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your wishlist is empty</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Save products you love by tapping the heart icon while browsing our catalog.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(customer)/(tabs)')}
            style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.exploreBtnText}>Browse Marketplace</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {items.map((item) => (
            <WishList
              key={item.id || item.productId}
              item={item}
              onMoveToCart={handleMoveToCart}
              onRemove={handleRemove}
              onPressItem={handlePressProduct}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  cartBadgeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
  },
  exploreBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
