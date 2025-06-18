"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

console.log("====================================");
console.log("API_BASE_URL", API_BASE_URL);
console.log("====================================");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming your backend returns user data and token
        const userData = {
          id: data.user?.id || data.id,
          email: data.user?.email || data.email,
          name: data.user?.name || data.name,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Store token if provided
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return {
          success: false,
          error: data.message || data.error || "Login failed",
        };
      }
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      console.log("====================================");
      console.log("data", data);
      console.log("====================================");

      if (response.ok) {
        // Assuming your backend returns user data and token
        const userData = {
          id: data.user?.id || data.id,
          email: data.user?.email || data.email,
          name: data.user?.name || data.name,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Store token if provided
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return {
          success: false,
          error: data.message || data.error || "Registration failed",
        };
      }
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
