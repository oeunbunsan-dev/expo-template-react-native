import { apiCore } from "../core";

class CartService {
  getCart = async () => {
    const res = await apiCore.get("/cart");
    return res.data;
  };

  addItemToCart = async (payload: any) => {
    const res = await apiCore.post("/cart", payload);
    return res.data;
  };

  updateCartItemQuantity = async (id: any, payload: any) => {
    const res = await apiCore.put(`/cart/items/${id}`, payload);
    return res.data;
  };

  removeItemFromCart = async (id: any) => {
    const res = await apiCore.delete(`/cart/items/${id}`);
    return res.data;
  };
};

export const cartService = new CartService();
