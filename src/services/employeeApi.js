// src/services/employeeApi.js

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

const employeeApi = {
    fetchEmployees: async () => {
        try {
            const response = await axios.get(`${API_URL}/employees`, getAuthHeader());
            return response.data.data.employees;
        } catch (error) {
            console.error('API call failed to fetch employees:', error);
            throw error;
        }
    },
    addEmployee: async (employeeData) => {
        try {
            const response = await axios.post(`${API_URL}/employees`, employeeData, getAuthHeader());
            return response.data.data.employee;
        } catch (error) {
            console.error('API call failed to add employee:', error);
            throw error;
        }
    },
    updateEmployee: async (id, updates) => {
        try {
            const response = await axios.put(`${API_URL}/employees/${id}`, updates, getAuthHeader());
            return response.data.data.employee;
        } catch (error) {
            console.error('API call failed to update employee:', error);
            throw error;
        }
    },
    deleteEmployee: async (id) => {
        try {
            await axios.delete(`${API_URL}/employees/${id}`, getAuthHeader());
            return { success: true };
        } catch (error) {
            console.error('API call failed to delete employee:', error);
            throw error;
        }
    }
};
  
export default employeeApi;