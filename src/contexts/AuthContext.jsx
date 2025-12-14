import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate the user state from local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('pos_current_user');
    if (storedUser) {
      try {
        const userWithToken = JSON.parse(storedUser);
        setUser(userWithToken);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('pos_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      const { user, token } = result;
      const userWithToken = { ...user, token };
      setUser(userWithToken);
      // Save the user and token to local storage
      localStorage.setItem('pos_current_user', JSON.stringify(userWithToken));
    }
    return result;
  };

  const logout = async () => {
    // Call the logout API on the backend first
    if (user?.token) {
        await authService.logout(user.token);
    }
    // Then clear local state and storage
    setUser(null);
    localStorage.removeItem('pos_current_user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};   