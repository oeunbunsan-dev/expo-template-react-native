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

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      setUser(res);
      return res;
    } catch (error) {
      console.error('Fetch profile error:', error);
      return null;
    }
  };

  // Load persisted session token and user data on initialization
  useEffect(() => {
    async function loadAuthState() {
      try {
        setIsLoading(true);
        const token = await tokenStorage.getAccessToken();

        if (Boolean(token)) {
          const profile = await fetchProfile();
          if (profile) {
            setIsAuthenticated(true);
          } else {
            await tokenStorage.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
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
    await fetchProfile();
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
