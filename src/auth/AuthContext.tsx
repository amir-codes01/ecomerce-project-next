"use client";

import api from "@/api/axios";
import { LoginResponse, User } from "@/types/auth.types";
import { setupInterceptors } from "@/utils/interceptor";
import { useRouter } from "next/navigation"; // Use Next.js router instead of window.location
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Memoize interceptors setup to run only once
  useEffect(() => {
    setupInterceptors(
      () => accessToken,
      (token) => setAccessToken(token),
    );
  }, [accessToken]);

  const refreshSession = useCallback(async () => {
    try {
      const res = await api.post(
        "/users/refreshtoken",
        {},
        { withCredentials: true },
      );
      const { accessToken: newToken, user: userData } = res.data.data;

      localStorage.setItem("accessToken", newToken);
      setAccessToken(newToken);
      setUser(userData);
      return newToken;
    } catch (error) {
      localStorage.removeItem("accessToken");
      return null;
    }
  }, []);

  // ✅ Fix: Run only once on mount [] to avoid infinite loops
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        await refreshSession();
        setLoading(false);
        return;
      }

      try {
        setAccessToken(token);
        // If your refreshToken already returns user data, you can skip this call
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (error) {
        // Token might be expired, try refreshing once
        const refreshedToken = await refreshSession();
        if (!refreshedToken) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>("/users/login", {
        email,
        password,
      });
      const { accessToken: token, user: userData } = response.data.data;

      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      setUser(userData);
      router.push("/dashboard"); // Use router for SPA transitions
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message,
      );
      throw error; // Let the UI handle the error message
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout").catch(() => {}); // Silent fail on API logout
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  // Prevent unnecessary re-renders of the Provider's children
  const value = useMemo(
    () => ({
      accessToken,
      user,
      loading,
      login,
      logout,
    }),
    [accessToken, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
