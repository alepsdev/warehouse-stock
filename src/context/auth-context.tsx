
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }
    
    const user: User = {
      username,
      password: "",
      isAuthenticated: true
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    toast.success(`Welcome, ${username}!`);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
