import { wishListService } from '@/src/apis/services/wishlist';
import { create } from 'zustand';

interface WishlistItemData {
  id?: string;
  productId: string;
  product?: any;
  [key: string]: any;
}

interface WishlistState {
  items: WishlistItemData[];
  wishlistIds: Set<string>;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  moveToCart: (productId: string, variantId?: string) => Promise<boolean>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  wishlistIds: new Set<string>(),
  isLoading: false,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const res = await wishListService.getWishList();
      const data = res?.data || res || [];
      const itemsList = Array.isArray(data) ? data : data?.items || [];

      const ids = new Set<string>();
      itemsList.forEach((item: any) => {
        const pId = item.productId || item.product?.id || item.id;
        if (pId) ids.add(String(pId));
      });

      set({
        items: itemsList,
        wishlistIds: ids,
        isLoading: false,
      });
    } catch (error) {
      console.warn('Error fetching wishlist:', error);
      set({ isLoading: false });
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.has(String(productId));
  },

  addToWishlist: async (productId: string) => {
    try {
      set({ isLoading: true });
      await wishListService.addProductToWishlist({ productId });
      await get().fetchWishlist();
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      set({ isLoading: false });
      return false;
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      set({ isLoading: true });
      await wishListService.removeProductFromWishlist(productId);
      await get().fetchWishlist();
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      set({ isLoading: false });
      return false;
    }
  },

  toggleWishlist: async (productId: string) => {
    const isSaved = get().isInWishlist(productId);
    if (isSaved) {
      return await get().removeFromWishlist(productId);
    } else {
      return await get().addToWishlist(productId);
    }
  },

  moveToCart: async (productId: string, variantId?: string) => {
    try {
      set({ isLoading: true });
      await wishListService.moveWishlistItemToCart(productId, variantId);
      await get().fetchWishlist();
      return true;
    } catch (error) {
      console.error('Error moving wishlist item to cart:', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
