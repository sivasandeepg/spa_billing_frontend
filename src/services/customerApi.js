// src/services/customerApi.js

import axios from 'axios';
import { API_URL } from '../config/config.js';

// Create axios instance for customer API
const customerApi = axios.create({
    baseURL: `${API_URL}/customers`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include auth token
customerApi.interceptors.request.use(
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
customerApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('pos_current_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const customerApiService = {
    // Verify customer by phone number
    verifyCustomerByPhone: async (phone) => {
        try {
            const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
            const response = await customerApi.get(`/verify-phone/${cleanPhone}`);
            return response.data.data;
        } catch (error) {
            console.error('Error verifying customer by phone:', error);
            throw error;
        }
    },

    // Add or update customer
    addOrUpdateCustomer: async (customerData) => {
        try {
            const response = await customerApi.post('/', customerData);
            return response.data.data;
        } catch (error) {
            console.error('Error adding/updating customer:', error);
            throw error;
        }
    },

    // Search customers by phone or name
    searchCustomers: async (searchParams) => {
        try {
            const queryString = new URLSearchParams(searchParams).toString();
            const response = await customerApi.get(`/search?${queryString}`);
            return response.data.data.customers;
        } catch (error) {
            console.error('Error searching customers:', error);
            throw error;
        }
    },

    // Get customer memberships
    getCustomerMemberships: async (customerId) => {
        try {
            const response = await customerApi.get(`/${customerId}/memberships`);
            return response.data.data.memberships;
        } catch (error) {
            console.error('Error getting customer memberships:', error);
            throw error;
        }
    },

    // Validate membership for transaction
    validateMembershipForTransaction: async (membershipId, serviceIds) => {
        try {
            const response = await customerApi.post('/validate-membership', {
                membershipId,
                serviceIds
            });
            return response.data.data;
        } catch (error) {
            console.error('Error validating membership:', error);
            throw error;
        }
    },

    // Legacy methods (updated to use new API endpoints)
    fetchCustomers: async () => {
        try {
            const response = await customerApi.get('/search?limit=100');
            return response.data.data.customers;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    // Add customer with service details (used by POS system)
    addCustomerWithService: async (customerData) => {
        try {
            const response = await customerApi.post('/', {
                ...customerData,
                visitCount: customerData.isExisting ? undefined : 1,
                lastVisit: new Date().toISOString()
            });
            return response.data.data.customer;
        } catch (error) {
            console.error('Error adding customer with service:', error);
            throw error;
        }
    }
};

export default customerApiService;   