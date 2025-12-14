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

  useEffect(() => {
    const storedUser = localStorage.getItem('pos_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      const { user, token } = result;
      const userWithToken = { ...user, token };
      setUser(userWithToken);
      localStorage.setItem('pos_current_user', JSON.stringify(userWithToken));
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const createUser = (userData) => {
    // This should also be an API call in a production app.
    // For now, it's a static local function.
    const users = JSON.parse(localStorage.getItem('pos_users') || '[]');
    const newUser = { ...userData, id: Date.now().toString() };
    users.push(newUser);
    localStorage.setItem('pos_users', JSON.stringify(users));
    return newUser;
  };

  const value = {
    user,
    login,
    logout,
    createUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};   