import { apiCore } from '../core';

class PaymentService {

  async checkout(payload: { orderId: string | number; paymentMethod: string; [key: string]: any }) {
    const response = await apiCore.post('/payments/checkout', payload);
    return response.data;

  }


  async handleWebhook(gateway: string, data: any) {
    const response = await apiCore.post(`/payments/webhook/${gateway}`, data);
    return response.data;
  }


  async getPaymentHistory() {
    const response = await apiCore.get('/payments/history');
    return response.data;
  }
}

export const paymentService = new PaymentService();
