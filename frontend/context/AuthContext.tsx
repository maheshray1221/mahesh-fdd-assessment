"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";

// ─── Axios Global Config ──────────────────────────────────
// withCredentials: true → cookies automatically send hongi har request mein
axios.defaults.withCredentials = true;

// ─── Types ───────────────────────────────────────────────
interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean; // initial auth check chal raha hai
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // app open hote hi check karo

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ── Check karo ki cookie valid hai ya nahi (page refresh pe) ──
  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/check-auth`);
      setUser(res.data.data.user);
    } catch {
      setUser(null); // cookie expired ya nahi hai
    } finally {
      setIsLoading(false);
    }
  }, [API]);

  // App mount hone pe ek baar check karo
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Login ─────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      // throws on error — calling component handle karega
      const res = await axios.post(`${API}/login`, { email, password });
      // cookies browser ne khud set kar li (httpOnly)
      // user object response body mein bhi aaya
      setUser(res.data.data.user);
    },
    [API]
  );

  // ── Logout ────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API}/admin/logout`);
    } catch {
      // server error pe bhi local state clear karo
    } finally {
      setUser(null);
    }
  }, [API]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}