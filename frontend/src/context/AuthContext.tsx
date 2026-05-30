import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { setAuthToken, apiClient } from '../services/api';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';

interface User {
  name: string;
  email: string;
  uid?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const DEFAULT_MOCK_USER: User = {
  name: 'Kehinde',
  email: 'k@sholadoye.com',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_MOCK_USER,
  loading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_MOCK_USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleApiError = (err: unknown) => {
    const msg = (err as Error)?.message || 'An unexpected error occurred';
    setError(msg);
    throw err;
  };

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const firebaseToken = 'mock-firebase-token';
      const res = await apiClient.login(firebaseToken);
      setAuthToken(res.token);
      setUser({ name: email.split('@')[0], email, uid: res.user?.id });
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const firebaseToken = 'mock-signup-token';
      const res = await apiClient.login(firebaseToken);
      setAuthToken(res.token);
      setUser({ name, email, uid: res.user?.id });
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth || !googleProvider) {
        throw new Error("Firebase Auth is not initialized. Check your VITE_FIREBASE_API_KEY in .env");
      }
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Use the Firebase ID token as bearer token for all backend requests
      setAuthToken(idToken);
      
      // Verify with backend — sends the token in Authorization header
      const res = await apiClient.login(idToken);
      
      setUser({
        name: result.user.displayName || result.user.email?.split('@')[0] || 'Google User',
        email: result.user.email || '',
        uid: res.user?.uid || result.user.uid
      });
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      
      // Only fall back to mock if Firebase is genuinely not configured (not for real auth errors)
      if (err?.message?.includes("not initialized") || err?.code === 'auth/configuration-not-found') {
        console.warn("Firebase not configured. Using offline mock for development.");
        setAuthToken("mock-backend-token");
        setUser({ name: 'Dev User (Offline)', email: 'nigerian.dev@gmail.com', uid: 'user-123' });
      } else {
        // Real auth error — surface it to the user
        const msg = err?.message || 'Google sign-in failed. Please try again.';
        setError(msg);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);


  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient.logout();
    } catch {
      // Logout locally even if API fails
    } finally {
      setAuthToken(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, loginWithGoogle, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
