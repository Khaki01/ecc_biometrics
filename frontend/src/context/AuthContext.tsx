"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { isTokenValid, getTokenPayload } from "@/lib/jwt";

// Define the shape of your payload (adjust fields if needed)
interface UserPayload {
  sub?: string;
  exp?: number;
  auth_type?: string;
}

// Define the context state interface
interface AuthState {
  token: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create context with default undefined (we’ll add a provider)
const AuthContext = createContext<AuthState | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<
    Omit<AuthState, "login" | "logout">
  >({
    token: null,
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("faceToken");
    console.log("coinbte", token);
    if (token != undefined && isTokenValid(token)) {
      const user = getTokenPayload(token);
      setAuthState({
        token,
        user,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("faceToken", token);
    document.cookie = `faceToken=${token}; Path=/; Max-Age=${
      10 * 60
    }; SameSite=Lax`;
    const user = getTokenPayload(token);
    setAuthState({
      token,
      user,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("faceToken");
    document.cookie = `faceToken=; Path=/; Max-Age=0`;
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
