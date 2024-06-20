import React, { createContext, useContext, useState, useEffect } from "react";

import { auth } from "../config/firebaseConfig"; 
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    setUser(auth.currentUser);
  };
  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);