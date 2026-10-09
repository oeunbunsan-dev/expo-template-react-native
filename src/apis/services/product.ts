import { apiCore } from "../core";

class ProductService {
  getAllProducts = async (params ? : any) => {
    const res = await apiCore.get("/products", { params });
    return res.data;
  };

  getProductBySlug = async ( slug : string ) => {
    const res = await apiCore.get(`/products/${slug}`);
    return res.data;
  }
};

export const productService = new ProductService();
