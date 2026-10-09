import { cartService } from '@/src/apis/services/cart';
import { create } from 'zustand';

interface CartItemData {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice?: string | number;
  product?: any;
  [key: string]: any;
}

interface CartState {
  items: CartItemData[];
  cartData: any | null;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, variantId?: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartData: null,
  totalItems: 0,
  subtotal: 0,
  isLoading: false,
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await cartService.getCart();
      const data = res?.data || res || {};
      const itemsList = Array.isArray(data) ? data : data?.items || [];

      const total = itemsList.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      const sub = itemsList.reduce((acc: number, item: any) => {
        const price = Number(item.unitPrice || item.product?.basePrice || 0);
        return acc + price * (item.quantity || 1);
      }, 0);

      set({
        cartData: data,
        items: itemsList,
        totalItems: total,
        subtotal: sub,
        isLoading: false,
      });
    } catch (error) {
      console.warn('Error fetching cart:', error);
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity = 1, variantId?: string) => {
    try {
      set({ isLoading: true });
      const payload: any = { productId, quantity };
      if (variantId) payload.variantId = variantId;

      await cartService.addItemToCart(payload);
      await get().fetchCart();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ isLoading: false });
      return false;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        return await get().removeItem(itemId);
      }
      set({ isLoading: true });
      await cartService.updateCartItemQuantity(itemId, { quantity });
      await get().fetchCart();
      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      set({ isLoading: false });
      return false;
    }
  },

  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true });
      await cartService.removeItemFromCart(itemId);
      await get().fetchCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      set({ isLoading: false });
      return false;
    }
  },

  clearCart: () => {
    set({ items: [], cartData: null, totalItems: 0, subtotal: 0 });
  },
}));
