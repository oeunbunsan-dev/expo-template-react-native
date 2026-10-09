import { apiCore } from "@/src/apis/core";
class BrandService {

  async getAllBrands() {
    try {
      const response = await apiCore.get('/brands');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createBrand(payload: { name: string; description?: string; logo?: string; [key: string]: any }) {
    try {
      const response = await apiCore.post('/brands', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBrandBySlug(slug: string) {
    try {
      const response = await apiCore.get(`/brands/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(id: string | number, payload: { name?: string; description?: string; logo?: string; [key: string]: any }) {
    try {
      const response = await apiCore.put(`/brands/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteBrand(id: string | number) {
    try {
      const response = await apiCore.delete(`/brands/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const brandService = new BrandService();
