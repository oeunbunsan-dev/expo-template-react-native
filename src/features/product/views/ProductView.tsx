import { categoryService } from '@/src/apis/services/category';
import { productService } from '@/src/apis/services/product';
import { useAppTheme } from '@/src/context/ThemeContext';
import { useCartStore } from '@/src/stores/use-cart-store';
import { useWishlistStore } from '@/src/stores/use-wishlist-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCart from '../components/ProductCard';

export default function ProductView() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { addToCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);

      if (prodRes.status === 'fulfilled') {
        const d = prodRes.value?.data || prodRes.value || [];
        setProducts(Array.isArray(d) ? d : []);
      }
      if (catRes.status === 'fulfilled') {
        const d = catRes.value?.data || catRes.value || [];
        setCategories(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.warn('Error fetching shop data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const onPressProduct = (productObj: any) => {
    const { slug } = productObj;
    if (slug) {
      router.push(`/(customer)/product/${slug}`);
    }
  };

  const handleAddToCart = async (productObj: any) => {
    try {
      const ok = await addToCart(productObj.id, 1);
      if (ok) {
        Alert.alert('Added to Bag', `"${productObj.name}" added to your cart.`);
      } else {
        Alert.alert('Notice', 'Could not add product to cart.');
      }
    } catch {
      Alert.alert('Error', 'Failed to add to cart.');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || p.shortDescription || '').toLowerCase();
      const brandName = (p.brand?.name || '').toLowerCase();

      const matchesSearch = name.includes(q) || desc.includes(q) || brandName.includes(q);

      const matchesCat =
        selectedCategory === 'ALL' ||
        String(p.categoryId) === selectedCategory ||
        String(p.category?.id) === selectedCategory ||
        (p.category?.name || '').toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Bar with Search, Wishlist & Cart */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.brandingCol}>
          <Text style={[styles.appTitle, { color: colors.text }]}>Modern Commerce</Text>
          <Text style={[styles.appSub, { color: colors.textMuted }]}>
            Cambodia&apos;s Multi-Vendor Marketplace
          </Text>
        </View>

        <View style={styles.topRightIcons}>
          <TouchableOpacity
            onPress={() => router.push('/(customer)/wishlist')}
            style={[styles.badgeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="heart-outline" size={20} color={colors.text} />
            {wishlistItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(customer)/(tabs)/orders')}
            style={[styles.badgeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="bag-handle-outline" size={20} color={colors.text} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={[styles.searchSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search gadgets, crafts, brands..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('ALL')}
            style={[
              styles.catPill,
              {
                backgroundColor: selectedCategory === 'ALL' ? colors.primary : colors.card,
                borderColor: selectedCategory === 'ALL' ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.catPillText,
                { color: selectedCategory === 'ALL' ? '#FFFFFF' : colors.text },
              ]}
            >
              All Items
            </Text>
          </TouchableOpacity>

          {categories.map((c) => {
            const isSel = selectedCategory === String(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCategory(String(c.id))}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isSel ? colors.primary : colors.card,
                    borderColor: isSel ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catPillText,
                    { color: isSel ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Catalog Grid */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading marketplace catalog...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No products found</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {searchQuery || selectedCategory !== 'ALL'
                  ? 'Try selecting a different category or clearing search.'
                  : 'Check back soon for new arrivals from our merchants.'}
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredProducts.map((item) => (
                <ProductCart
                  key={item.id}
                  productObj={item}
                  onPressProduct={onPressProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  brandingCol: { flex: 1 },
  appTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  appSub: { fontSize: 11, marginTop: 1 },
  topRightIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  searchSection: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  catScroll: { gap: 6, paddingVertical: 2 },
  catPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  catPillText: { fontSize: 12, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyText: { fontSize: 13, textAlign: 'center', maxWidth: 260 },
});
