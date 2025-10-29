import React, { createContext, useContext, useState, useEffect } from "react";
import { user as mockUser } from "../mock/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate a logged-in user
    setUser(mockUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    // Mock login logic
    if (email && password) {
      setUser(mockUser);
      return mockUser;
    }
    setError(new Error("Invalid credentials"));
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);