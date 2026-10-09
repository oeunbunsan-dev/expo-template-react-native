import { cartService } from '@/src/apis/services/cart';
import { productService } from '@/src/apis/services/product';
import { wishListService } from '@/src/apis/services/wishlist';
import { useLoadingStore } from '@/src/stores/use-loading-store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView, StyleSheet,
  Text,
  View
} from 'react-native';
import ProductCart from '../components/ProductCard';

const ProductView = () => {
  const router = useRouter();
  const { startLoading, dismissLoading } = useLoadingStore();

  // 1. ប្តូរតម្លៃដំបូងទៅជា Array ទទេ [] ដើម្បីការពារកុំឱ្យ Crash ពេល map
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await productService.getAllProducts();
      setProducts(result.data || []); // ការពារបើ result.data គ្មានតម្លៃ
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 2. បន្ថែមមុខងារ Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const onPressProduct = async (productObj: any) => {
    const { slug } = productObj;
    router.push(`/(customer)/product/${slug}`);
  };

  // 3. បន្ថែមមុខងារ Add to Cart (បំពេញផ្នែកដែលបាត់)
  const onAddToCart = async ( productObj: any ) => {
    startLoading("Adding to cart...");

    const { id, inventory } = productObj;

    try {

      const payload = {
        productId: id,
        quantity: 1,
      };

      // alert(JSON.stringify(inventory))


      await cartService.addItemToCart(payload)




    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      dismissLoading();
    }
  };

  const onWishlistClick = async (productObj: any) => {
    startLoading("Adding...");
    try {
      const { id } = productObj;
      const payload = { 'productId': id };
      await wishListService.addProductToWishlist(payload);
    } catch (error: any) {
      alert(JSON.stringify(error));
    } finally {
      dismissLoading();
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* បង្ហាញសារបើគ្មាន Product */}
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {products.map((item) => (
            <ProductCart
              key={item.id}
              productObj={item}
              onPressProduct={onPressProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default ProductView;
