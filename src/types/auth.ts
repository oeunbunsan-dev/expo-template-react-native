import { UserRole } from './ecommerce';

export interface UserProfile {
  id: string;
  name: string;
  nameKm?: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarColor: string;
  avatarInitial: string;
  storeName?: string;
  joinedDate: string;
  address?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  storeName?: string;
}
