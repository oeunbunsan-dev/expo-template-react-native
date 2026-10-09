import { apiCore } from "../core";

class CategoryService {
  async getAllCategories() {
    const response = await apiCore.get('/categories');
    return response.data;
  };

  async createCategory(payload: { name: string; description?: string; image?: string;[key: string]: any }) {
    const response = await apiCore.post('/categories', payload);
    return response.data;
  };

  async getCategoryBySlug(slug: string) {
    const response = await apiCore.get(`/categories/${slug}`);
    return response.data;
  };

  async updateCategory(id: string | number, payload: { name?: string; description?: string; image?: string;[key: string]: any }) {
    const response = await apiCore.put(`/categories/${id}`, payload);
    return response.data;
  };

  async deleteCategory(id: string | number) {
    const response = await apiCore.delete(`/categories/${id}`);
    return response.data;
  };

}

export const categoryService = new CategoryService();
