import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { AuthState, LoginCredentials, RegisterData, UserProfile } from '../types/auth';
import { UserRole } from '../types/ecommerce';

const AUTH_STORAGE_KEY = '@theme_sdk54_auth_v1';

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  customer: {
    id: 'usr-customer-1',
    name: 'Sophea Sok',
    nameKm: 'សុភា សុខ',
    email: 'customer@example.com',
    phone: '+855 12 345 678',
    role: 'customer',
    avatarColor: '#2563EB',
    avatarInitial: 'S',
    joinedDate: 'Jan 2025',
    address: 'St 2004, Sen Sok, Phnom Penh',
  },
  vendor: {
    id: 'usr-vendor-1',
    name: 'Sokha Meng',
    nameKm: 'សុខា ម៉េង',
    email: 'vendor@angkorcrafts.com',
    phone: '+855 12 889 900',
    role: 'vendor',
    storeName: 'Angkor Heritage Crafts',
    avatarColor: '#F59E0B',
    avatarInitial: 'M',
    joinedDate: 'Jan 2025',
    address: 'Street 08, Svay Dangkum, Siem Reap',
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Bunsan Oeun',
    nameKm: 'ប៊ុនសាន អឿន',
    email: 'admin@moderncommerce.com',
    phone: '+855 98 765 432',
    role: 'admin',
    avatarColor: '#8B5CF6',
    avatarInitial: 'B',
    joinedDate: 'Oct 2024',
    address: 'BKK1, Chamkarmon, Phnom Penh',
  },
};

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginAsPreset: (role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  onRoleSync?: (role: UserRole) => void;
}> = ({ children, onRoleSync }) => {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.customer); // Start signed in as Customer demo
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          onRoleSync?.(parsed.role);
        } else {
          // Default initial session
          setUser(DEMO_USERS.customer);
          onRoleSync?.('customer');
        }
      } catch (err) {
        console.warn('Failed to load auth session:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [onRoleSync]);

  const saveUser = useCallback(async (newUser: UserProfile | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Failed to persist auth session:', err);
    }
  }, []);

  const triggerHaptic = (type = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(type).catch(() => {});
    } catch {}
  };

  const login = useCallback(
    async ({ email, role }: LoginCredentials): Promise<boolean> => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

      // Check if matches one of demo presets
      let matchedUser: UserProfile | undefined;
      if (role && DEMO_USERS[role]) {
        matchedUser = DEMO_USERS[role];
      } else {
        const lower = email.trim().toLowerCase();
        matchedUser = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === lower);
      }

      if (!matchedUser) {
        // Create generic authenticated customer from email
        matchedUser = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0] || 'Marketplace Member',
          email: email.trim(),
          phone: '+855 12 000 111',
          role: role || 'customer',
          avatarColor: '#2563EB',
          avatarInitial: (email[0] || 'U').toUpperCase(),
          joinedDate: 'Oct 2026',
        };
      }

      setUser(matchedUser);
      await saveUser(matchedUser);
      onRoleSync?.(matchedUser.role);
      return true;
    },
    [onRoleSync, saveUser]
  );

  const loginAsPreset = useCallback(
    async (presetRole: UserRole) => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      const targetUser = DEMO_USERS[presetRole];
      setUser(targetUser);
      await saveUser(targetUser);
      onRoleSync?.(presetRole);
    },
    [onRoleSync, saveUser]
  );

  const register = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: data.name.trim() || 'New Member',
        email: data.email.trim(),
        phone: data.phone.trim() || '+855 12 000 000',
        role: data.role,
        storeName: data.role === 'vendor' ? data.storeName || `${data.name}'s Store` : undefined,
        avatarColor: data.role === 'vendor' ? '#F59E0B' : data.role === 'admin' ? '#8B5CF6' : '#2563EB',
        avatarInitial: (data.name[0] || 'U').toUpperCase(),
        joinedDate: 'Today',
      };

      setUser(newUser);
      await saveUser(newUser);
      onRoleSync?.(newUser.role);
      return true;
    },
    [onRoleSync, saveUser]
  );

  const logout = useCallback(async () => {
    triggerHaptic();
    setUser(null);
    await saveUser(null);
  }, [saveUser]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      triggerHaptic();
      setUser((prev) => {
        if (!prev) return null;
        const next = { ...prev, ...updates };
        saveUser(next);
        if (updates.role) onRoleSync?.(updates.role);
        return next;
      });
    },
    [onRoleSync, saveUser]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginAsPreset,
      register,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, loginAsPreset, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
