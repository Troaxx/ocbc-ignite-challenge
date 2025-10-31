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
      setUser(mockUser);
      localStorage.setItem('ocbc_auth_user', JSON.stringify(mockUser));
      return mockUser;
    }
    setError(new Error("Invalid credentials"));
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