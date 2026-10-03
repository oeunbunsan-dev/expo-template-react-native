import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { Product, ProductCategory } from '../../types/ecommerce';
import { ThemedText } from '../ThemedText';
import { ThemedCard } from '../ThemedCard';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartSheet } from './CartSheet';

export const CustomerShopView: React.FC = () => {
  const { colors, borderRadius, t } = useAppTheme();
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cartCount,
  } = useEcommerce();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);

  const categories: { id: ProductCategory; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'all', labelKey: 'categoriesAll', icon: 'apps' },
    { id: 'artisan', labelKey: 'categoryArtisan', icon: 'sparkles' },
    { id: 'food', labelKey: 'categoryFood', icon: 'cafe' },
    { id: 'electronics', labelKey: 'categoryElectronics', icon: 'headset' },
    { id: 'fashion', labelKey: 'categoryFashion', icon: 'shirt' },
    { id: 'home', labelKey: 'categoryHome', icon: 'home' },
  ];

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar & Cart Trigger */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: Math.min(borderRadius, 14),
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            gap: 8,
          }}
        >
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={{
              flex: 1,
              color: colors.text,
              fontSize: 14,
              padding: 0,
            }}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Floating Cart Button */}
        <Pressable
          onPress={() => setCartVisible(true)}
          style={({ pressed }) => [
            {
              width: 46,
              height: 46,
              borderRadius: Math.min(borderRadius, 14),
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="cart" size={22} color={colors.onPrimary} />
          {cartCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: '#EF4444',
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                borderWidth: 2,
                borderColor: colors.surface,
              }}
            >
              <ThemedText variant="caption" weight="700" style={{ color: '#FFFFFF', fontSize: 10 }}>
                {cartCount}
              </ThemedText>
            </View>
          )}
        </Pressable>
      </View>

      {/* Hero Marketplace Banner */}
      <ThemedCard
        padding="md"
        style={{
          marginBottom: 16,
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
          borderWidth: 1.5,
          overflow: 'hidden',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, gap: 4 }}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <ThemedText variant="caption" weight="700" style={{ color: colors.onPrimary }}>
                {t('flashDeals')}
              </ThemedText>
            </View>
            <ThemedText variant="title" weight="700" color="primary">
              Cambodian Heritage & Modern Tech
            </ThemedText>
            <ThemedText variant="caption" color="secondary">
              Handwoven silk, organic Kampot pepper & spatial audio gear
            </ThemedText>
          </View>
          <Ionicons name="ribbon" size={48} color={colors.primary} style={{ opacity: 0.8 }} />
        </View>
      </ThemedCard>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginBottom: 16, paddingRight: 8 }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: Math.min(borderRadius, 12),
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.cardBorder,
                  gap: 6,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isSelected ? colors.onPrimary : colors.textSecondary}
              />
              <ThemedText
                variant="sm"
                weight={isSelected ? '700' : '500'}
                style={{
                  color: isSelected ? colors.onPrimary : colors.text,
                }}
              >
                {t(cat.labelKey as any)}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Section Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <ThemedText variant="title" weight="700">
          {t('allProducts')} ({filteredProducts.length})
        </ThemedText>
      </View>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <ThemedCard padding="lg" style={{ alignItems: 'center', gap: 10, marginVertical: 20 }}>
          <Ionicons name="search-outline" size={38} color={colors.textMuted} />
          <ThemedText variant="body" color="secondary">
            No products match your search or category filter.
          </ThemedText>
        </ThemedCard>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleOpenProduct}
            />
          ))}
        </View>
      )}

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onOpenCart={() => setCartVisible(true)}
      />

      <CartSheet
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
      />
    </View>
  );
};
