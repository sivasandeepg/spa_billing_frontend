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

const categoryApi = {
  fetchCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`, getAuthHeader());
    return response.data.data.categories;
  },
  addCategory: async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories`, categoryData, getAuthHeader());
    return response.data.data.category;
  },
  updateCategory: async (id, updates) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, updates, getAuthHeader());
    return response.data.data.category;
  },
  deleteCategory: async (id) => {
    await axios.delete(`${API_URL}/categories/${id}`, getAuthHeader());
    return { success: true };
  }
};

export default categoryApi;  