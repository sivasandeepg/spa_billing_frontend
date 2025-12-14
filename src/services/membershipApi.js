// src/services/membershipApi.js

import axios from 'axios';
import { API_URL } from '../config/config.js'; // <-- Import the dynamic URL

// Create axios instance for membership API
const membershipApi = axios.create({
  baseURL: `${API_URL}/memberships`, // <-- Use the imported API_URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token
membershipApi.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('pos_current_user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
membershipApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('pos_current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const membershipApiService = {
  // Fetch all memberships
  fetchMemberships: async () => {
    try {
      const response = await membershipApi.get('/');
      return response.data.data.memberships;
    } catch (error) {
      console.error('Error fetching memberships:', error);
      throw error;
    }
  },

  // Add new membership
  addMembership: async (membershipData) => {
    try {
      const response = await membershipApi.post('/', membershipData);
      return response.data.data.membership;
    } catch (error) {
      console.error('Error adding membership:', error);
      throw error;
    }
  },

  // Update membership
  updateMembership: async (id, membershipData) => {
    try {
      const response = await membershipApi.put(`/${id}`, membershipData);
      return response.data.data.membership;
    } catch (error) {
      console.error('Error updating membership:', error);
      throw error;
    }
  },

  // Delete membership
  deleteMembership: async (id) => {
    try {
      const response = await membershipApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership:', error);
      throw error;
    }
  },

  // Get membership by code
  getMembershipByCode: async (code) => {
    try {
      const response = await membershipApi.get(`/code/${code}`);
      return response.data.data.membership;
    } catch (error) {
      console.error('Error fetching membership by code:', error);
      throw error;
    }
  },

  // Get membership statistics
  getMembershipStats: async () => {
    try {
      const response = await membershipApi.get('/stats');
      return response.data.data.stats;
    } catch (error) {
      console.error('Error fetching membership stats:', error);
      throw error;
    }
  }
};

export default membershipApiService;   