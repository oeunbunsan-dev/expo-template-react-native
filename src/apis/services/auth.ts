import { apiCore } from '@/src/apis/core';
import { tokenStorage } from '@/src/utils/token';

class AuthService {
  login = async (credential: any): Promise<any> => {
    const response = await apiCore.post('/auth/login', credential);

    const { tokens } = response.data.data;
    const { accessToken } = tokens;

    await tokenStorage.setAccessToken(accessToken);

    return response.data;
  };

  // Register Customer, Guest
  register = async (credential: any): Promise<any> => {
    const response = await apiCore.post('/auth/register', credential);
    return response.data;
  };

  registerVendor = async (payload: any) => {
    const res = await apiCore.post("/auth/register-vendor", payload);
    return res.data;
  };

  getProfile = async () => {
    const result = await apiCore.get("/auth/me");
    return result.data;
  };
  async refreshToken(payload: { refreshToken: string }) {
    const response = await apiCore.post('/auth/refresh', payload);
    return response.data;
  };

  async forgotPassword(payload: { email: string }) {
    const response = await apiCore.post('/auth/forgot-password', payload);
    return response.data;
  };

  async resetPassword(payload: any) {
    const response = await apiCore.post('/auth/reset-password', payload);
    return response.data;
  };

  async verifyEmail(params: { token: string }) {
    const response = await apiCore.get('/auth/verify-email', { params });
    return response.data;
  };

  async changePassword(payload: any) {
    const response = await apiCore.post('/auth/change-password', payload);
    return response.data;
  }
}



export const authService = new AuthService();
