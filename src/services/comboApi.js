// src/services/comboApi.js
  
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

const comboApi = {
    fetchCombos: async () => {
        try {
            const response = await axios.get(`${API_URL}/combos`, getAuthHeader());
            return response.data.data.combos;
        } catch (error) {
            console.error('API call failed to fetch combos:', error);
            throw error;
        }
    },

    getComboById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/combos/${id}`, getAuthHeader());
            return response.data.data.combo;
        } catch (error) {
            console.error('API call failed to fetch combo:', error);
            throw error;
        }
    },

    addCombo: async (comboData) => {
        try {
            // Direct mapping since the updated component sends the correct format
            const apiComboData = {
                name: comboData.name,
                description: comboData.description,
                totalPrice: comboData.totalPrice,
                discountPrice: comboData.discountPrice,
                discountPercentage: comboData.discountPercentage,
                validityDays: comboData.validityDays,
                status: comboData.status || 'ACTIVE',
                branchId: comboData.branchId,
                services: comboData.services || []
            };

            const response = await axios.post(`${API_URL}/combos`, apiComboData, getAuthHeader());
            return response.data.data.combo;
        } catch (error) {
            console.error('API call failed to add combo:', error);
            if (error.response?.status === 409) {
                throw new Error('A combo with this name already exists in this branch.');
            } else if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'Invalid combo data provided.');
            }
            throw error;
        }
    },

    updateCombo: async (id, comboData) => {
        try {
            // Direct mapping since the updated component sends the correct format
            const apiComboData = {
                name: comboData.name,
                description: comboData.description,
                totalPrice: comboData.totalPrice,
                discountPrice: comboData.discountPrice,
                discountPercentage: comboData.discountPercentage,
                validityDays: comboData.validityDays,
                status: comboData.status || 'ACTIVE',
                services: comboData.services || []
            };

            const response = await axios.put(`${API_URL}/combos/${id}`, apiComboData, getAuthHeader());
            return response.data.data.combo;
        } catch (error) {
            console.error('API call failed to update combo:', error);
            if (error.response?.status === 409) {
                throw new Error('A combo with this name already exists in this branch.');
            } else if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'Invalid combo data provided.');
            } else if (error.response?.status === 403) {
                throw new Error('You can only update combos from your branch.');
            } else if (error.response?.status === 404) {
                throw new Error('Combo not found.');
            }
            throw error;
        }
    },

    updateComboStatus: async (id, status) => {
        try {
            const response = await axios.patch(`${API_URL}/combos/${id}/status`, { status }, getAuthHeader());
            return response.data.data.combo;
        } catch (error) {
            console.error('API call failed to update combo status:', error);
            if (error.response?.status === 400) {
                throw new Error('Invalid status. Must be ACTIVE, INACTIVE, or EXPIRED.');
            } else if (error.response?.status === 403) {
                throw new Error('You can only update combos from your branch.');
            } else if (error.response?.status === 404) {
                throw new Error('Combo not found.');
            }
            throw error;
        }
    },

    deleteCombo: async (id) => {
        try {
            await axios.delete(`${API_URL}/combos/${id}`, getAuthHeader());
            return { success: true };
        } catch (error) {
            console.error('API call failed to delete combo:', error);
            if (error.response?.status === 400) {
                throw new Error('Cannot delete combo that has been used in transactions.');
            } else if (error.response?.status === 403) {
                throw new Error('You can only delete combos from your branch.');
            } else if (error.response?.status === 404) {
                throw new Error('Combo not found.');
            }
            throw error;
        }
    }
};

export default comboApi;  