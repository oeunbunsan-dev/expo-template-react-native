import React, { createContext, useContext, useEffect, useState } from 'react';

// --- Types ---
export interface CartItemVariant {
  id: string;
  title: string;
  sku: string;
  price: string;
  comparePrice?: string | null;
  attributes?: Record<string, any>;
}

export interface CartItem {
  cartItemId: string; // Unique ID composed of product.id + variant?.id
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  variant?: CartItemVariant | null;
  maxStock?: number;
}

interface AddToCartPayload {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: string;
    images?: { url: string; isCover?: boolean }[];
  };
  variant?: CartItemVariant | null;
  quantity?: number;
  maxStock?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (payload: AddToCartPayload) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@app_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 1. Load initial cart from AsyncStorage (if available)
  useEffect(() => {
    const loadCart = async () => {
      try {
        let AsyncStorage;
        try {
          AsyncStorage = require('@react-native-async-storage/async-storage').default;
        } catch {
          // AsyncStorage not installed; continue with in-memory state
        }

        if (AsyncStorage) {
          const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.warn('Failed to load cart from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCart();
  }, []);

  // 2. Persist cart changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveCart = async () => {
      try {
        let AsyncStorage;
        try {
          AsyncStorage = require('@react-native-async-storage/async-storage').default;
        } catch {
          return;
        }

        if (AsyncStorage) {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
      } catch (error) {
        console.warn('Failed to persist cart:', error);
      }
    };

    saveCart();
  }, [items, isLoaded]);

  // Add product/variant to cart
  const addToCart = ({
    product,
    variant = null,
    quantity = 1,
    maxStock,
  }: AddToCartPayload) => {
    const uniqueKey = variant ? `${product.id}-${variant.id}` : `${product.id}-default`;
    const unitPrice = variant ? parseFloat(variant.price) : parseFloat(product.basePrice);
    const coverUrl =
      product.images?.find((img) => img.isCover)?.url || product.images?.[0]?.url;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === uniqueKey);

      if (existingIndex > -1) {
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            const nextQuantity = item.quantity + quantity;
            const finalQty =
              maxStock !== undefined ? Math.min(nextQuantity, maxStock) : nextQuantity;

            return { ...item, quantity: finalQty };
          }
          return item;
        });
      }

      const newItem: CartItem = {
        cartItemId: uniqueKey,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: unitPrice,
        image: coverUrl,
        quantity,
        variant,
        maxStock,
      };

      return [...prevItems, newItem];
    });
  };

  // Update item quantity directly (removes if qty <= 0)
  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          const validQuantity =
            item.maxStock !== undefined
              ? Math.min(newQuantity, item.maxStock)
              : newQuantity;
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  // Remove single line item
  const removeFromCart = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  // Empty cart
  const clearCart = () => {
    setItems([]);
  };

  // Derived calculations
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- Custom Hook ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;
