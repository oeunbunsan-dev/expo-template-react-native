import { apiCore } from "../core";

class WishListService {
  getWishList = async (params?: any) => {
    const result = await apiCore.get("/wishlist", { params });
    return result.data;
  };

  addProductToWishlist = async ( payloadObject : any ) => {
    const result = await apiCore.post('/wishlist', payloadObject);
    return result.data;
  };

  removeProductFromWishlist = async (productId: string) => {
    const result = await apiCore.delete(`/wishlist/${productId}`);
    return result.data;
  };

  moveWishlistItemToCart = async (productId: string, variantId?: string) => {
    const result = await apiCore.post("/wishlist/move-to-cart", { productId, variantId });
    return result.data;
  }
};

export const wishListService = new WishListService();
