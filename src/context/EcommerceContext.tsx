import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  CartItem,
  Order,
  OrderStatus,
  PlatformMetrics,
  Product,
  ProductCategory,
  UserRole,
  Vendor,
} from '../types/ecommerce';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_VENDORS } from '../constants/mockData';

const ECOMMERCE_STORAGE_KEY = '@theme_sdk54_ecommerce_v1';

export interface EcommerceContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  placeOrder: (details: {
    recipientName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Vendor actions
  activeVendorId: string;
  vendorProducts: Product[];
  vendorOrders: Order[];
  vendorRevenue: number;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProductStock: (productId: string, stock: number) => void;
  deleteProduct: (productId: string) => void;
  // Admin actions
  vendors: Vendor[];
  toggleVendorStatus: (vendorId: string) => void;
  platformMetrics: PlatformMetrics;
}

const EcommerceContext = createContext<EcommerceContextValue | null>(null);

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('customer');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeVendorId = 'vendor-1';

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(ECOMMERCE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.role) setRoleState(parsed.role);
          if (parsed.cart) setCart(parsed.cart);
          if (parsed.wishlist) setWishlist(parsed.wishlist);
          if (parsed.products) setProducts(parsed.products);
          if (parsed.orders) setOrders(parsed.orders);
          if (parsed.vendors) setVendors(parsed.vendors);
        }
      } catch (e) {
        console.warn('Failed to load ecommerce state:', e);
      }
    })();
  }, []);

  // Save state updates
  const persistState = useCallback(
    async (updates: {
      role?: UserRole;
      cart?: CartItem[];
      wishlist?: string[];
      products?: Product[];
      orders?: Order[];
      vendors?: Vendor[];
    }) => {
      try {
        const currentRaw = await AsyncStorage.getItem(ECOMMERCE_STORAGE_KEY);
        const current = currentRaw ? JSON.parse(currentRaw) : {};
        await AsyncStorage.setItem(
          ECOMMERCE_STORAGE_KEY,
          JSON.stringify({ ...current, ...updates })
        );
      } catch (e) {
        console.warn('Failed to save ecommerce state:', e);
      }
    },
    []
  );

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style).catch(() => {});
    } catch {}
  };

  const setRole = useCallback(
    (newRole: UserRole) => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setRoleState(newRole);
      persistState({ role: newRole });
    },
    [persistState]
  );

  // Cart operations
  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      triggerHaptic();
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        let nextCart: CartItem[];
        if (existing) {
          nextCart = prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          nextCart = [...prev, { product, quantity }];
        }
        persistState({ cart: nextCart });
        return nextCart;
      });
    },
    [persistState]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      triggerHaptic();
      setCart((prev) => {
        const nextCart = prev.filter((item) => item.product.id !== productId);
        persistState({ cart: nextCart });
        return nextCart;
      });
    },
    [persistState]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      triggerHaptic();
      setCart((prev) => {
        let nextCart: CartItem[];
        if (quantity <= 0) {
          nextCart = prev.filter((item) => item.product.id !== productId);
        } else {
          nextCart = prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
        }
        persistState({ cart: nextCart });
        return nextCart;
      });
    },
    [persistState]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    persistState({ cart: [] });
  }, [persistState]);

  // Wishlist
  const toggleWishlist = useCallback(
    (productId: string) => {
      triggerHaptic();
      setWishlist((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        persistState({ wishlist: next });
        return next;
      });
    },
    [persistState]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  // Order Placement
  const placeOrder = useCallback(
    (details: {
      recipientName: string;
      phoneNumber: string;
      address: string;
      paymentMethod: string;
    }): Order => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: details.recipientName || 'Bunsan Doe',
        customerPhone: details.phoneNumber || '+855 12 345 678',
        address: details.address || 'Phnom Penh, Cambodia',
        items: [...cart],
        total: Math.round(totalAmount * 100) / 100,
        status: 'pending',
        date: 'Just now',
        paymentMethod: details.paymentMethod || 'ABA PAY',
        vendorId: cart[0]?.product.vendorId || 'vendor-1',
      };

      setOrders((prev) => {
        const next = [newOrder, ...prev];
        persistState({ orders: next });
        return next;
      });

      // Clear cart on successful order
      clearCart();
      return newOrder;
    },
    [cart, clearCart, persistState]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      triggerHaptic();
      setOrders((prev) => {
        const next = prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
        persistState({ orders: next });
        return next;
      });
    },
    [persistState]
  );

  // Vendor actions
  const addProduct = useCallback(
    (newProdData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      const created: Product = {
        ...newProdData,
        id: `prod-${Date.now()}`,
        rating: 5.0,
        reviewsCount: 1,
      };

      setProducts((prev) => {
        const next = [created, ...prev];
        persistState({ products: next });
        return next;
      });
    },
    [persistState]
  );

  const updateProductStock = useCallback(
    (productId: string, stock: number) => {
      triggerHaptic();
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === productId ? { ...p, stock } : p));
        persistState({ products: next });
        return next;
      });
    },
    [persistState]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      triggerHaptic();
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        persistState({ products: next });
        return next;
      });
    },
    [persistState]
  );

  // Admin actions
  const toggleVendorStatus = useCallback(
    (vendorId: string) => {
      triggerHaptic();
      setVendors((prev) => {
        const next = prev.map((v) => {
          if (v.id === vendorId) {
            const nextStatus: Vendor['status'] =
              v.status === 'active' ? 'suspended' : 'active';
            return { ...v, status: nextStatus };
          }
          return v;
        });
        persistState({ vendors: next });
        return next;
      });
    },
    [persistState]
  );

  // Computed metrics
  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      Math.round(
        cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) *
          100
      ) / 100,
    [cart]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat =
        selectedCategory === 'all' || prod.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        prod.titleEn.toLowerCase().includes(query) ||
        prod.titleKm.toLowerCase().includes(query) ||
        prod.vendorName.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  const vendorProducts = useMemo(
    () => products.filter((p) => p.vendorId === activeVendorId),
    [products, activeVendorId]
  );

  const vendorOrders = useMemo(
    () => orders.filter((o) => o.vendorId === activeVendorId || !o.vendorId),
    [orders, activeVendorId]
  );

  const vendorRevenue = useMemo(() => {
    return vendorOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [vendorOrders]);

  const platformMetrics = useMemo((): PlatformMetrics => {
    const totalGmv = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 118400.0);
    const activeV = vendors.filter((v) => v.status === 'active').length;
    return {
      totalGmv: Math.round(totalGmv * 100) / 100,
      totalOrders: orders.length + 1840,
      activeVendors: activeV,
      totalCustomers: 3420,
      commissionEarned: Math.round(totalGmv * 0.08 * 100) / 100,
    };
  }, [orders, vendors]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      products,
      filteredProducts,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      isInWishlist,
      orders,
      placeOrder,
      updateOrderStatus,
      activeVendorId,
      vendorProducts,
      vendorOrders,
      vendorRevenue,
      addProduct,
      updateProductStock,
      deleteProduct,
      vendors,
      toggleVendorStatus,
      platformMetrics,
    }),
    [
      role,
      setRole,
      products,
      filteredProducts,
      selectedCategory,
      searchQuery,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      isInWishlist,
      orders,
      placeOrder,
      updateOrderStatus,
      activeVendorId,
      vendorProducts,
      vendorOrders,
      vendorRevenue,
      addProduct,
      updateProductStock,
      deleteProduct,
      vendors,
      toggleVendorStatus,
      platformMetrics,
    ]
  );

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = (): EcommerceContextValue => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
