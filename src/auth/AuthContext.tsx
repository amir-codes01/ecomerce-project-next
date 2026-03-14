"use client";

import api from "@/api/axios";
import { LoginResponse, User } from "@/types/auth.types";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<LoginResponse>("/users/login", {
      email,
      password,
    });
    const token = response.data.data.accessToken;
    const userData = response.data.data.user;

    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/users/logout");

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        setAccessToken,
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
