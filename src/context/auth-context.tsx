"use client";

import React, { createContext, useContext } from "react";
import { SessionProvider } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";

// Tipado para el contexto de autenticación
interface AuthContextType {
  session: ReturnType<typeof useAuth>["session"];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;

  //  Métodos para recuperación de contraseña
  requestPasswordReset: (email: string) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

// Valor inicial para el contexto
const defaultContextValue: AuthContextType = {
  session: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, error: "AuthContext no inicializado" }),
  register: async () => ({
    success: false,
    error: "AuthContext no inicializado",
  }),
  logout: async () => {},
  hasPermission: () => false,
  hasRole: () => false,
  requestPasswordReset: async () => ({
    success: false,
    error: "AuthContext no inicializado",
  }),
  resetPassword: async () => ({
    success: false,
    error: "AuthContext no inicializado",
  }),
};

// Creamos el contexto con el valor por defecto
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Provider que será usado en el layout para SessionProvider de NextAuth
export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Provider que expone las funciones de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto de autenticación
export function useAuthContext() {
  return useContext(AuthContext);
}
