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

  registerVendor = async (payload : any) => {
    const res = await apiCore.post("/auth/register-vendor", payload);
    return res.data;
  };

  getProfile = async () => {
    const result = await apiCore.get("/auth/me");
    return result.data;
  };
}



export const authService = new AuthService();
