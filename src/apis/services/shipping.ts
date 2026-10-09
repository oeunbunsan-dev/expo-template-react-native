import { apiCore } from '../core';

class ShippingService {

  async getShippingMethods() {
    const response = await apiCore.get('/shipping/methods');
    return response.data;

  }


  async trackShipment(trackingNumber: string) {
    const response = await apiCore.get(`/shipping/track/${trackingNumber}`);
    return response.data;
  }

  async updateShipmentStatus(id: string | number, status: string) {
    const response = await apiCore.patch(`/shipping/shipments/${id}/status`, { status });
    return response.data;
  }
}

export const shippingService = new ShippingService();
