import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService } from '../apis/services/auth';
import { tokenStorage } from '../utils/token';


interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credential: any) => Promise<any>;
  signUp: (credential: any) => Promise<any>;
  signUpVendor: (credential: any) => Promise<any>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<any>;
}

// 2. Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// 3. Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load persisted session token and user data on initialization
  useEffect(() => {
    async function loadAuthState() {
      try {
        setIsLoading(true);
        const token = await tokenStorage.getAccessToken();

        if (Boolean(token)) {
          fetchProfile();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthState();
  }, []);

  const signUp = async (credential: any) => {
    const res = await authService.register(credential);
    return res;
  };


  const signUpVendor = async (credential: any) => {
    const res = await authService.registerVendor(credential);
    return res;
  };

  const signIn = async (credential: any) => {
    const res = await authService.login(credential);
    fetchProfile();
    setIsAuthenticated(true);
    return res;
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await tokenStorage.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Sign out storage error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    const res = await authService.getProfile();
    setUser(res);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signUpVendor, signIn, signOut, fetchProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Custom Hook for consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
