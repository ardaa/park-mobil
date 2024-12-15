import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    // Store token in secure storage (implement this later)
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove token from secure storage (implement this later)
    setIsAuthenticated(false);
    router.replace('/auth/welcome-screen');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 