import { apiCore } from "../core";

class StoreService {

  getPublicStoreProfile = async (slug: string) => {
    const res = await apiCore.get(`/stores/${slug}`);
    return res.data;
  };


  async getMyStores() {
    const response = await apiCore.get('/stores/my-stores');
    return response.data;
  }


  async createStore(payload: { name: string; description?: string; logo?: string;[key: string]: any }) {
    const response = await apiCore.post('/stores/', payload);
    return response.data;
  }


  async updateStore(id: string | number, payload: { name?: string; description?: string; logo?: string;[key: string]: any }) {
    const response = await apiCore.put(`/stores/${id}`, payload);
    return response.data;
  }
}

export const storeService = new StoreService();
