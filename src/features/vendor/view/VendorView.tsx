import { brandService } from '@/src/apis/services/brand';
import { categoryService } from '@/src/apis/services/category';
import { inventoryService } from '@/src/apis/services/inventory';
import { storeService } from '@/src/apis/services/store';
import { vendorService } from '@/src/apis/services/vendor';
import { useAppTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/providers/auth-provider';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProductFormData {
  storeId: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  basePrice: string;
  comparePrice: string;
  costPrice: string;
  categoryId: string;
  brandId: string;
  initialStock: string;
  imageUrl: string;
  status: 'DRAFT' | 'PUBLISHED';
  isFeatured: boolean;
}

const initialProductForm: ProductFormData = {
  storeId: '',
  name: '',
  description: '',
  shortDescription: '',
  sku: '',
  basePrice: '',
  comparePrice: '',
  costPrice: '',
  categoryId: '',
  brandId: '',
  initialStock: '10',
  imageUrl: '',
  status: 'PUBLISHED',
  isFeatured: false,
};

export default function VendorView() {
  const { colors } = useAppTheme();
  const { user } = useAuth();

  // Navigation sub-tab
  const [subTab, setSubTab] = useState<'PRODUCTS' | 'STORE'>('PRODUCTS');

  // Overview stats
  const [overview, setOverview] = useState<any>(null);
  const [alertsCount, setAlertsCount] = useState<number>(0);

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Store profile
  const [myStores, setMyStores] = useState<any[]>([]);
  const [storeForm, setStoreForm] = useState({ name: '', description: '', logo: '' });
  const [storeSubmitting, setStoreSubmitting] = useState(false);

  // Modals
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);
  const [productSubmitting, setProductSubmitting] = useState(false);

  // General loading
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendorData = useCallback(async () => {
    try {
      const [ovRes, prodRes, catRes, brandRes, storeRes, alertRes, vProfRes] = await Promise.allSettled([
        vendorService.getVendorDashboardOverview(),
        vendorService.listVendorProducts(),
        categoryService.getAllCategories(),
        brandService.getAllBrands(),
        storeService.getMyStores(),
        inventoryService.getInventoryAlerts().catch(() => null),
        vendorService.getVendorProfile().catch(() => null),
      ]);

      if (ovRes.status === 'fulfilled') {
        const d = ovRes.value?.data ?? ovRes.value;
        setOverview(d);
      }
      if (prodRes.status === 'fulfilled') {
        const d = prodRes.value?.data ?? prodRes.value ?? [];
        setProducts(Array.isArray(d) ? d : []);
      }
      if (catRes.status === 'fulfilled') {
        const d = catRes.value?.data ?? catRes.value ?? [];
        setCategories(Array.isArray(d) ? d : []);
      }
      if (brandRes.status === 'fulfilled') {
        const d = brandRes.value?.data ?? brandRes.value ?? [];
        setBrands(Array.isArray(d) ? d : []);
      }

      // Robust extraction of stores across endpoints and fallback auth state
      let storeArr: any[] = [];
      if (storeRes.status === 'fulfilled') {
        const raw = storeRes.value?.data ?? storeRes.value ?? [];
        if (Array.isArray(raw)) {
          storeArr = raw.filter((s: any) => s && s.id);
        } else if (Array.isArray(raw?.stores)) {
          storeArr = raw.stores.filter((s: any) => s && s.id);
        } else if (raw && typeof raw === 'object' && raw.id) {
          storeArr = [raw];
        }
      }

      // Fallback 1: Vendor Profile endpoint
      if (storeArr.length === 0 && vProfRes.status === 'fulfilled' && vProfRes.value) {
        const vp = vProfRes.value?.data ?? vProfRes.value;
        const vpStores = Array.isArray(vp?.stores) ? vp.stores : (vp?.store ? [vp.store] : []);
        storeArr = vpStores.filter((s: any) => s && s.id);
      }

      // Fallback 2: Auth Profile User state
      if (storeArr.length === 0 && user?.data) {
        const uStores = Array.isArray(user.data.stores)
          ? user.data.stores
          : Array.isArray(user.data.vendor?.stores)
            ? user.data.vendor.stores
            : user.data.vendor?.store
              ? [user.data.vendor.store]
              : [];
        storeArr = uStores.filter((s: any) => s && s.id);
      }

      setMyStores(storeArr);

      if (storeArr.length > 0 && storeArr[0]) {
        setStoreForm({
          name: storeArr[0].name || '',
          description: storeArr[0].description || '',
          logo: storeArr[0].logo || '',
        });
      } else {
        const defaultName =
          user?.data?.vendor?.companyName ||
          user?.data?.companyName ||
          '';
        if (defaultName) {
          setStoreForm((prev) => ({
            ...prev,
            name: prev.name || defaultName,
          }));
        }
      }

      if (alertRes.status === 'fulfilled' && alertRes.value) {
        const d = alertRes.value?.data ?? alertRes.value ?? [];
        setAlertsCount(Array.isArray(d) ? d.length : 0);
      }
    } catch (err: any) {
      console.warn('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendorData();
  };

  // Open Create Product Modal
  const handleOpenCreateModal = () => {
    if (myStores.length === 0) {
      Alert.alert(
        'Store Setup Required',
        'You must configure your store profile before adding products to your catalog.',
        [
          { text: 'Set Up Store', onPress: () => setSubTab('STORE') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    setEditingProduct(null);
    setProductForm({
      ...initialProductForm,
      storeId: myStores[0]?.id ? String(myStores[0].id) : '',
      categoryId: categories[0]?.id ? String(categories[0].id) : '',
      brandId: brands[0]?.id ? String(brands[0].id) : '',
    });
    setProductModalVisible(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (item: any) => {
    setEditingProduct(item);
    const coverUrl = item.images?.find((img: any) => img.isCover)?.url || item.images?.[0]?.url || '';
    setProductForm({
      storeId: item.storeId || item.store?.id || (myStores[0]?.id ? String(myStores[0].id) : ''),
      name: item.name || '',
      description: item.description || '',
      shortDescription: item.shortDescription || '',
      sku: item.sku || '',
      basePrice: String(item.basePrice || ''),
      comparePrice: item.comparePrice ? String(item.comparePrice) : '',
      costPrice: item.costPrice ? String(item.costPrice) : '',
      categoryId: item.categoryId || (item.category?.id ? String(item.category.id) : ''),
      brandId: item.brandId || (item.brand?.id ? String(item.brand.id) : ''),
      initialStock: String(item.initialStock || '10'),
      imageUrl: coverUrl,
      status: item.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
      isFeatured: Boolean(item.isFeatured),
    });
    setProductModalVisible(true);
  };

  // Save (Create or Update) Product
  const handleSaveProduct = async () => {
    const targetStoreId = productForm.storeId || myStores[0]?.id;
    if (!editingProduct && !targetStoreId) {
      Alert.alert(
        'Store Required',
        'A valid store is required to create a product. Please set up your store profile first.',
        [
          {
            text: 'Set Up Store',
            onPress: () => {
              setProductModalVisible(false);
              setSubTab('STORE');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    if (!productForm.name.trim() || productForm.name.trim().length < 2) {
      Alert.alert('Validation Error', 'Product title must be at least 2 characters.');
      return;
    }

    if (!productForm.basePrice || isNaN(Number(productForm.basePrice)) || Number(productForm.basePrice) < 0) {
      Alert.alert('Validation Error', 'A valid base price (0 or greater) is required.');
      return;
    }

    if (!productForm.categoryId) {
      Alert.alert('Validation Error', 'Please select a product category.');
      return;
    }

    const trimmedDesc = productForm.description.trim();
    if (!trimmedDesc || trimmedDesc.length < 5) {
      Alert.alert('Validation Error', 'Product description must be at least 5 characters long.');
      return;
    }

    try {
      setProductSubmitting(true);
      const payload: any = {
        name: productForm.name.trim(),
        description: trimmedDesc,
        shortDescription: productForm.shortDescription.trim(),
        sku: productForm.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
        basePrice: parseFloat(productForm.basePrice),
        categoryId: productForm.categoryId,
        status: productForm.status,
        isFeatured: productForm.isFeatured,
      };

      if (!editingProduct) {
        payload.storeId = String(targetStoreId);
      }

      if (productForm.comparePrice && !isNaN(Number(productForm.comparePrice))) {
        payload.comparePrice = parseFloat(productForm.comparePrice);
      }
      if (productForm.costPrice && !isNaN(Number(productForm.costPrice))) {
        payload.costPrice = parseFloat(productForm.costPrice);
      }
      if (productForm.brandId) {
        payload.brandId = productForm.brandId;
      }
      if (productForm.initialStock && !isNaN(Number(productForm.initialStock))) {
        payload.initialStock = parseInt(productForm.initialStock, 10);
      }
      if (productForm.imageUrl.trim()) {
        payload.images = [
          {
            url: productForm.imageUrl.trim(),
            altText: productForm.name.trim(),
            isCover: true,
            sortOrder: 1,
          },
        ];
      }

      if (editingProduct) {
        await vendorService.updateVendorProduct(editingProduct.id, payload);
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        await vendorService.createVendorProduct(payload);
        Alert.alert('Success', 'Product published to store catalog!');
      }

      setProductModalVisible(false);
      setEditingProduct(null);
      await fetchVendorData();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save product');
    } finally {
      setProductSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await vendorService.deleteVendorProduct(id);
            Alert.alert('Deleted', 'Product removed successfully.');
            await fetchVendorData();
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to delete product');
          }
        },
      },
    ]);
  };

  // Save Store Profile
  const handleSaveStore = async () => {
    if (!storeForm.name.trim() || storeForm.name.trim().length < 2) {
      Alert.alert('Validation Error', 'Store name must be at least 2 characters.');
      return;
    }

    try {
      setStoreSubmitting(true);
      const activeStore = myStores[0];
      if (activeStore?.id) {
        await storeService.updateStore(activeStore.id, {
          name: storeForm.name.trim(),
          description: storeForm.description.trim(),
          logo: storeForm.logo.trim(),
        });
        Alert.alert('Success', 'Store profile updated successfully!');
      } else {
        await storeService.createStore({
          name: storeForm.name.trim(),
          description: storeForm.description.trim(),
          logo: storeForm.logo.trim(),
        });
        Alert.alert(
          'Store Created!',
          'Your storefront is now ready! You can now add products to your catalog.',
          [
            { text: 'Add Products', onPress: () => setSubTab('PRODUCTS') },
            { text: 'OK' },
          ]
        );
      }
      await fetchVendorData();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save store profile');
    } finally {
      setStoreSubmitting(false);
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = name.includes(q) || sku.includes(q);
      const matchesStatus = statusFilter === 'ALL' || (p.status || '').toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Overview Metrics Cards */}
      <View style={[styles.statsSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.statsHeader}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>Vendor Portal</Text>
          <Text style={[styles.statsSub, { color: colors.textMuted }]}>
            {myStores[0]?.name ? `Store: ${myStores[0].name}` : 'Multi-Vendor Merchant Station'}
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.metricIconRow}>
              <Ionicons name="cube-outline" size={18} color="#2563EB" />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Catalog</Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {products.length}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.metricIconRow}>
              <Ionicons name="cash-outline" size={18} color="#10B981" />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Revenue</Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              ${overview?.totalRevenue ? Number(overview.totalRevenue).toFixed(0) : '0'}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.metricIconRow}>
              <Ionicons name="cart-outline" size={18} color="#7C3AED" />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Orders</Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {overview?.totalOrders ?? 0}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.metricIconRow}>
              <Ionicons name="warning-outline" size={18} color="#F59E0B" />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Alerts</Text>
            </View>
            <Text style={[styles.metricValue, { color: alertsCount > 0 ? '#EF4444' : colors.text }]}>
              {alertsCount}
            </Text>
          </View>
        </View>

        {/* Sub-Tabs Switch */}
        <View style={[styles.tabNav, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setSubTab('PRODUCTS')}
            style={[
              styles.tabNavBtn,
              subTab === 'PRODUCTS' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="pricetags-outline"
              size={16}
              color={subTab === 'PRODUCTS' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabNavText,
                { color: subTab === 'PRODUCTS' ? '#FFFFFF' : colors.text },
              ]}
            >
              Products ({products.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSubTab('STORE')}
            style={[
              styles.tabNavBtn,
              subTab === 'STORE' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="storefront-outline"
              size={16}
              color={subTab === 'STORE' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabNavText,
                { color: subTab === 'STORE' ? '#FFFFFF' : colors.text },
              ]}
            >
              Store Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PRODUCTS TAB */}
      {subTab === 'PRODUCTS' ? (
        <View style={{ flex: 1 }}>
          {/* Controls bar: Search, filter & Add button */}
          <View style={[styles.productControls, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={16} color={colors.textMuted} />
              <TextInput
                placeholder="Search products or SKU..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: colors.text }]}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.controlsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setStatusFilter(st)}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: statusFilter === st ? colors.primary : colors.card,
                        borderColor: statusFilter === st ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: statusFilter === st ? '#FFFFFF' : colors.text,
                      }}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={handleOpenCreateModal}
                style={[styles.btnAddProduct, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.btnAddProductText}>New</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Store Setup Alert Banner if no store exists */}
          {myStores.length === 0 && (
            <View style={[styles.noStoreAlert, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
              <Ionicons name="warning-outline" size={22} color="#D97706" />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400E' }}>
                  Store Profile Not Set Up
                </Text>
                <Text style={{ fontSize: 11, color: '#B45309' }}>
                  You must create your store profile before you can list products in the marketplace.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSubTab('STORE')}
                style={[styles.btnStoreAction, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.btnStoreActionText}>Set Up Store</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product List */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading inventory...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollList}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
            >
              {filteredProducts.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.text }]}>No products found</Text>
                  <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                    {myStores.length === 0
                      ? 'Configure your store profile first, then start adding products.'
                      : 'Tap "+ New" above to add your first product to your storefront.'}
                  </Text>
                  <TouchableOpacity
                    onPress={myStores.length === 0 ? () => setSubTab('STORE') : handleOpenCreateModal}
                    style={[styles.createFirstBtn, { backgroundColor: colors.primary }]}
                  >
                    <Ionicons name={myStores.length === 0 ? "storefront-outline" : "add-circle-outline"} size={18} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
                      {myStores.length === 0 ? 'Create Store Profile First' : 'Add Product'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredProducts.map((item) => {
                  const cover = item.images?.find((img: any) => img.isCover)?.url || item.images?.[0]?.url;
                  const isPublished = (item.status || '').toUpperCase() === 'PUBLISHED';

                  return (
                    <View
                      key={item.id}
                      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      {/* Product Thumbnail */}
                      <View style={styles.imageWrap}>
                        {cover ? (
                          <Image source={{ uri: cover }} style={styles.thumb} />
                        ) : (
                          <View style={[styles.placeholderThumb, { backgroundColor: colors.card }]}>
                            <Ionicons name="image-outline" size={24} color={colors.textMuted} />
                          </View>
                        )}
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: isPublished ? '#ECFDF5' : '#FEF3C7' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: isPublished ? '#059669' : '#D97706' },
                            ]}
                          >
                            {item.status || 'DRAFT'}
                          </Text>
                        </View>
                      </View>

                      {/* Product Info */}
                      <View style={{ flex: 1, paddingVertical: 4 }}>
                        <Text style={[styles.pName, { color: colors.text }]} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={[styles.pSku, { color: colors.textMuted }]}>
                          SKU: {item.sku || 'N/A'}
                        </Text>
                        <View style={styles.pPriceRow}>
                          <Text style={[styles.pPrice, { color: colors.primary }]}>
                            ${Number(item.basePrice || 0).toFixed(2)}
                          </Text>
                          {item.comparePrice ? (
                            <Text style={[styles.pCompare, { color: colors.textMuted }]}>
                              ${Number(item.comparePrice).toFixed(2)}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.pActions}>
                        <TouchableOpacity
                          onPress={() => handleOpenEditModal(item)}
                          style={[styles.iconActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                          <Ionicons name="pencil" size={16} color={colors.text} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDeleteProduct(item.id, item.name)}
                          style={[styles.iconActionBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>
      ) : (
        /* STORE PROFILE TAB */
        <ScrollView contentContainerStyle={styles.storeScroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.storeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.storeHeader}>
              <View style={styles.storeLogoWrap}>
                {storeForm.logo ? (
                  <Image source={{ uri: storeForm.logo }} style={styles.storeLogo} />
                ) : (
                  <View style={[styles.placeholderLogo, { backgroundColor: colors.primary }]}>
                    <Ionicons name="storefront" size={28} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.storeTitle, { color: colors.text }]}>
                  {storeForm.name || 'Storefront Details'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  Publicly visible on Modern Commerce Marketplace
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Store Name *</Text>
              <TextInput
                value={storeForm.name}
                onChangeText={(t) => setStoreForm((prev) => ({ ...prev, name: t }))}
                placeholder="e.g. Apex Electronics, Phnom Penh Arts"
                placeholderTextColor={colors.textMuted}
                style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Store Description</Text>
              <TextInput
                value={storeForm.description}
                onChangeText={(t) => setStoreForm((prev) => ({ ...prev, description: t }))}
                placeholder="About your shop, specialties and craftsmanship..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                style={[
                  styles.formInput,
                  { color: colors.text, borderColor: colors.border, backgroundColor: colors.background, height: 75, textAlignVertical: 'top' },
                ]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Store Logo URL</Text>
              <TextInput
                value={storeForm.logo}
                onChangeText={(t) => setStoreForm((prev) => ({ ...prev, logo: t }))}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor={colors.textMuted}
                style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              />
            </View>

            <TouchableOpacity
              disabled={storeSubmitting}
              onPress={handleSaveStore}
              style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
            >
              {storeSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.btnPrimaryText}>Save Store Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      <Modal visible={productModalVisible} transparent animationType="slide" onRequestClose={() => setProductModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity onPress={() => setProductModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              {/* Store Picker */}
              {myStores.length > 1 ? (
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Store *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {myStores.map((st) => {
                      const isSelected = String(productForm.storeId) === String(st.id);
                      return (
                        <TouchableOpacity
                          key={st.id}
                          onPress={() => setProductForm((p) => ({ ...p, storeId: String(st.id) }))}
                          style={[
                            styles.catPill,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.card,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? '#FFFFFF' : colors.text }}>
                            {st.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : myStores.length === 1 ? (
                <View style={[styles.singleStoreChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="storefront-outline" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 12, color: colors.text }}>
                    Store: <Text style={{ fontWeight: '700' }}>{myStores[0].name}</Text>
                  </Text>
                </View>
              ) : null}

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Product Title *</Text>
                <TextInput
                  value={productForm.name}
                  onChangeText={(t) => setProductForm((p) => ({ ...p, name: t }))}
                  placeholder="e.g. Wireless ANC Headphones"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Base Price ($) *</Text>
                  <TextInput
                    value={productForm.basePrice}
                    onChangeText={(t) => setProductForm((p) => ({ ...p, basePrice: t }))}
                    placeholder="120.00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Compare Price ($)</Text>
                  <TextInput
                    value={productForm.comparePrice}
                    onChangeText={(t) => setProductForm((p) => ({ ...p, comparePrice: t }))}
                    placeholder="150.00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>SKU</Text>
                  <TextInput
                    value={productForm.sku}
                    onChangeText={(t) => setProductForm((p) => ({ ...p, sku: t }))}
                    placeholder="HP-ANC-X1"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Initial Stock</Text>
                  <TextInput
                    value={productForm.initialStock}
                    onChangeText={(t) => setProductForm((p) => ({ ...p, initialStock: t }))}
                    placeholder="25"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  />
                </View>
              </View>

              {/* Category Picker */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                  {categories.map((c) => {
                    const isSelected = String(productForm.categoryId) === String(c.id);
                    return (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => setProductForm((p) => ({ ...p, categoryId: String(c.id) }))}
                        style={[
                          styles.catPill,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.card,
                            borderColor: isSelected ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? '#FFFFFF' : colors.text }}>
                          {c.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Image URL with live preview */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Cover Image URL</Text>
                <TextInput
                  value={productForm.imageUrl}
                  onChangeText={(t) => setProductForm((p) => ({ ...p, imageUrl: t }))}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={colors.textMuted}
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                />
                {productForm.imageUrl ? (
                  <View style={styles.imagePreviewWrap}>
                    <Image source={{ uri: productForm.imageUrl }} style={styles.previewImage} resizeMode="cover" />
                  </View>
                ) : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Description * (min. 5 chars)</Text>
                <TextInput
                  value={productForm.description}
                  onChangeText={(t) => setProductForm((p) => ({ ...p, description: t }))}
                  placeholder="Detailed product features, specifications..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                  style={[
                    styles.formInput,
                    { color: colors.text, borderColor: colors.border, backgroundColor: colors.background, height: 75, textAlignVertical: 'top' },
                  ]}
                />
              </View>

              {/* Status Switch */}
              <View style={[styles.switchRow, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.switchLabel, { color: colors.text }]}>Publish Immediately</Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>
                    Visible for customer browsing & checkout
                  </Text>
                </View>
                <Switch
                  value={productForm.status === 'PUBLISHED'}
                  onValueChange={(val) =>
                    setProductForm((p) => ({ ...p, status: val ? 'PUBLISHED' : 'DRAFT' }))
                  }
                  trackColor={{ false: '#D1D5DB', true: colors.primary }}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                disabled={productSubmitting}
                onPress={handleSaveProduct}
                style={[styles.btnPrimary, { backgroundColor: colors.primary, marginTop: 16, marginBottom: 30 }]}
              >
                {productSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.btnPrimaryText}>
                      {editingProduct ? 'Save Product Changes' : 'Create Product'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsSection: { padding: 16, borderBottomWidth: 1, gap: 12 },
  statsHeader: {},
  statsTitle: { fontSize: 20, fontWeight: '700' },
  statsSub: { fontSize: 12, marginTop: 2 },
  metricsGrid: { flexDirection: 'row', gap: 8 },
  metricCard: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1 },
  metricIconRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  metricLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  metricValue: { fontSize: 16, fontWeight: '700' },
  tabNav: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3 },
  tabNavBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, gap: 6 },
  tabNavText: { fontSize: 13, fontWeight: '600' },
  productControls: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 38, gap: 6 },
  searchInput: { flex: 1, fontSize: 13, paddingVertical: 0 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  btnAddProduct: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  btnAddProductText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  noStoreAlert: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginTop: 10, borderRadius: 10, borderWidth: 1, gap: 10 },
  btnStoreAction: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnStoreActionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  singleStoreChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  scrollList: { padding: 16, paddingBottom: 80, gap: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { paddingVertical: 50, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 12, textAlign: 'center', maxWidth: 260 },
  createFirstBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginTop: 8, gap: 6 },
  productCard: { flexDirection: 'row', padding: 10, borderRadius: 12, borderWidth: 1, gap: 10, alignItems: 'center' },
  imageWrap: { position: 'relative' },
  thumb: { width: 68, height: 68, borderRadius: 8 },
  placeholderThumb: { width: 68, height: 68, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statusBadge: { position: 'absolute', top: 2, left: 2, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  statusBadgeText: { fontSize: 9, fontWeight: '700' },
  pName: { fontSize: 14, fontWeight: '600' },
  pSku: { fontSize: 11, marginTop: 2 },
  pPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pPrice: { fontSize: 14, fontWeight: '700' },
  pCompare: { fontSize: 12, textDecorationLine: 'line-through' },
  pActions: { gap: 6 },
  iconActionBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  storeScroll: { padding: 16, paddingBottom: 80 },
  storeCard: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 12 },
  storeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  storeLogoWrap: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
  storeLogo: { width: 56, height: 56 },
  placeholderLogo: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  storeTitle: { fontSize: 18, fontWeight: '700' },
  formGroup: { gap: 6 },
  formRow: { flexDirection: 'row', gap: 10 },
  formLabel: { fontSize: 12, fontWeight: '600' },
  formInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 42, fontSize: 14 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6, marginTop: 6 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  catPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  imagePreviewWrap: { marginTop: 6, borderRadius: 8, overflow: 'hidden', height: 110 },
  previewImage: { width: '100%', height: '100%' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, marginVertical: 8 },
  switchLabel: { fontSize: 13, fontWeight: '600' },
});
