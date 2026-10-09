import { apiCore } from '../core';

class OrderService {

  async createOrder(payload: { items: any[]; shippingAddressId?: string; paymentMethod: string; [key: string]: any }) {
    const response = await apiCore.post('/orders/', payload);
    return response.data;

  }

  async getOrders() {
    const response = await apiCore.get('/orders/');
    return response.data;
  }


  async getOrderById(id: string | number) {
    const response = await apiCore.get(`/orders/${id}`);
    return response.data;
  }

  async cancelOrder(id: string | number, reason?: string) {
    const response = await apiCore.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  }

  async updateOrderStatus(id: string | number, status: string) {
    const response = await apiCore.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
}

export const orderService = new OrderService();
