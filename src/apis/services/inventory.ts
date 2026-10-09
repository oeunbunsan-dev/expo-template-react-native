import { apiCore } from "../core";

class InventoryService {
  async getInventory() {
    const response = await apiCore.get('/vendor/inventory/');
    return response.data;
  }

  async getInventoryAlerts() {
    const response = await apiCore.get('/vendor/inventory/alerts');
    return response.data;
  }

  async adjustInventory(payload: { productId: string | number; variantId?: string | number; quantity: number; reason?: string; [key: string]: any }) {
    const response = await apiCore.post('/vendor/inventory/adjust', payload);
    return response.data;
  }

  async getInventoryHistory(id: string | number) {
    const response = await apiCore.get(`/vendor/inventory/${id}/history`);
    return response.data;
  }
}

export const inventoryService = new InventoryService();
