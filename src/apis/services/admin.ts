
import { apiCore } from '../core';

class AdminService {
  async getDashboardData() {
    const response = await apiCore.get('/admin/dashboard');
    return response.data;
  };

  async getVendors() {
    const response = await apiCore.get('/admin/vendors');
    return response.data;
  };

  async updateVendorStatus(id: string | number, status: 'APPROVED' | 'SUSPENDED' | 'PENDING' | string) {
    const response = await apiCore.patch(`/admin/vendors/${id}/status`, { status });
    return response.data;
  };

  async getOrders() {
    const response = await apiCore.get('/admin/orders');
    return response.data;
  };

  async getUsers() {
    const response = await apiCore.get('/admin/users');
    return response.data;
  };
}

export const adminService = new AdminService();
