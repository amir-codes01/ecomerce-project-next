"use client";

import api from "@/api/axios";
import { LoginResponse, User } from "@/types/auth.types";
import React, { createContext, useContext, useEffect, useState } from "react";

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

  // ✅ 1. Restore session on refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAccessToken(token);

        // ✅ fetch current user
        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);

        setUser(res.data.data);
      } catch (error) {
        console.error("Auth restore failed", error);
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ 2. Login
  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<LoginResponse>("/users/login", {
      email,
      password,
    });

    const token = response.data.data.accessToken;
    const userData = response.data.data.user;

    // ✅ persist token
    localStorage.setItem("accessToken", token);

    setAccessToken(token);
    setUser(userData);
  };

  // ✅ 3. Logout
  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (e) {
      console.warn("Logout API failed");
    }

    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
