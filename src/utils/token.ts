import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

// ពិនិត្យមើលថាតើកូដកំពុងដំណើរការនៅលើ Browser ពិតប្រាកដមែនឬទេ
const isWeb = typeof window !== 'undefined' && window.localStorage !== undefined;

const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return await AsyncStorage.getItem(key);
};

const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const removeItem = async (key: string): Promise<void> => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await getItem(TOKEN_KEY.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    try {
      await setItem(TOKEN_KEY.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Error setting access token:', error);
    }
  },

  async removeAccessToken(): Promise<void> {
    try {
      await removeItem(TOKEN_KEY.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error removing access token:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await getItem(TOKEN_KEY.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await setItem(TOKEN_KEY.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await removeItem(TOKEN_KEY.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await removeItem(TOKEN_KEY.ACCESS_TOKEN);
      await removeItem(TOKEN_KEY.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },
};
