import { apiCore } from '../core';

class CouponService {

  async getAllCoupons() {
    const response = await apiCore.get('/coupons/');
    return response.data;
  }


  async createCoupon(payload: { code: string; type: 'PERCENTAGE' | 'FIXED'; value: number; expiryDate: string; [key: string]: any }) {
    const response = await apiCore.post('/coupons/', payload);
    return response.data;
  }


  async applyCoupon(code: string, cartIdOrAmount: string | number) {
    const response = await apiCore.post('/coupons/apply', { code, cartIdOrAmount });
    return response.data;

  }
}

export const couponService = new CouponService();
