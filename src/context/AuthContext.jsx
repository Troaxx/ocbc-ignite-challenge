import React, { createContext, useContext, useState, useEffect } from "react";
import databaseData from "../data/database.json";

const AuthContext = createContext();

const mockUser = databaseData.user;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ocbc_auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    if (email && password) {
      // Set localStorage first to ensure it's available immediately
      localStorage.setItem('ocbc_auth_user', JSON.stringify(mockUser));
      // Update state - React will batch this update
      setUser(mockUser);
      return mockUser;
    }
    const error = new Error("Invalid credentials");
    setError(error);
    throw error;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('ocbc_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);