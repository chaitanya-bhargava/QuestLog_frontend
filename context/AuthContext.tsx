"use client"; // Mark this as a Client Component

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Check if the user is already logged in
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    // Redirect to the backend's Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/google?provider=google`;
  };

  const logout = async () => {
    try {
      // Redirect to the home page first
      router.push("/");
      // Perform the logout request
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/logout?provider=google`, {
        withCredentials: true, // Include credentials (cookies) if needed
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};