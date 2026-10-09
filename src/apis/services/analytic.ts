import { apiCore } from '../core';

class AnalyticsService {

  async getAdminAnalytics() {
    const response = await apiCore.get('/analytics/admin');
    return response.data;

  }


  async getVendorAnalytics() {
    const response = await apiCore.get('/analytics/vendor');
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
