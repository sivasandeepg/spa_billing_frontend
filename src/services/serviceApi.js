import axios from 'axios';
import { API_URL } from '../config/config.js';

const getAuthHeader = () => {
  const storedUser = localStorage.getItem('pos_current_user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    return {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
  }
  return {};
};

const serviceApi = {
  fetchServices: async () => {
    const response = await axios.get(`${API_URL}/services`, getAuthHeader());
    return response.data.data.services;
  },
  addService: async (serviceData) => {
    const response = await axios.post(`${API_URL}/services`, serviceData, getAuthHeader());
    return response.data.data.service;
  },
  updateService: async (id, updates) => {
    const response = await axios.put(`${API_URL}/services/${id}`, updates, getAuthHeader());
    return response.data.data.service;
  },
  deleteService: async (id) => {
    await axios.delete(`${API_URL}/services/${id}`, getAuthHeader());
    return { success: true };
  }
};

export default serviceApi;  