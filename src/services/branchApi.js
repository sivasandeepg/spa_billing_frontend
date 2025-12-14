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

const branchApi = {
  fetchBranches: async () => {
    const response = await axios.get(`${API_URL}/branches`, getAuthHeader());
    return response.data.data.branches;
  },
  addBranch: async (branchData) => {
    const response = await axios.post(`${API_URL}/branches`, branchData, getAuthHeader());
    return response.data.data.branch;
  },
  updateBranch: async (id, updates) => {
    const response = await axios.put(`${API_URL}/branches/${id}`, updates, getAuthHeader());
    return response.data.data.branch;
  },
  deleteBranch: async (id) => {
    await axios.delete(`${API_URL}/branches/${id}`, getAuthHeader());
    return { success: true };
  }
};

export default branchApi;