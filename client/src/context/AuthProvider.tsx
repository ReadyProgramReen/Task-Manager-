"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getUserFromToken } from "@/lib/authHelpers";

// User type
interface User {
  id: number;
  name: string;
  email: string;
}

// Context shape
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch token and user on first load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const userFromToken = getUserFromToken();
      if (userFromToken) {
        setUser(userFromToken);
      }
    }

    setLoading(false);
  }, []);

  // Login function
  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
