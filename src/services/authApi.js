// src/services/authApi.js

import axios from 'axios';
import { API_URL } from '../config/config';

// Helper to get the authorization header from local storage
const getAuthHeader = () => {
  const storedUser = localStorage.getItem('pos_current_user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
  return {};
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { user, token } = response.data.data;
    // We get the token and user from the API response
    return { success: true, user, token };
  } catch (error) {
    if (error.response?.data?.data?.message) {
      return { success: false, error: error.response.data.data.message };
    }
    return { success: false, error: 'Network error or server unavailable.' };
  }
};

const logout = async () => {
  try {
    const headers = getAuthHeader();
    if (headers.headers) {
      await axios.post(`${API_URL}/auth/logout`, {}, headers);
    }
    // Clear local storage regardless of backend response
    localStorage.removeItem('pos_current_user');
  } catch (error) {
    console.error('Logout failed:', error);
    localStorage.removeItem('pos_current_user');
  }
};

const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, getAuthHeader());
    return response.data.data.user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
};

export const authService = {
  login,
  logout,
  getProfile
}; 