import axios from 'axios';
import { API_URL } from '../config/config.js';

// Helper function to get the authorization header from local storage
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

const posApi = {
  // Add a new customer
  addCustomer: async (customerData) => {
    try {
      const response = await axios.post(`${API_URL}/pos/customers`, customerData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('API call failed to add customer:', error);
      throw error;
    }
  },

  // Fetch all customers
  fetchCustomers: async () => {
    try {
      const response = await axios.get(`${API_URL}/pos/customers`, getAuthHeader());
      return response.data.data.customers;
    } catch (error) {
      console.error('API call failed to fetch customers:', error);
      throw error;
    }
  },
  
  // Add a new transaction
  addTransaction: async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/pos/transactions`, transactionData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('API call failed to add transaction:', error);
      throw error;
    }
  },

  // Fetch all transactions
  fetchTransactions: async () => {
    try {
      const response = await axios.get(`${API_URL}/pos/transactions`, getAuthHeader());
      return response.data.data.transactions;
    } catch (error) {
      console.error('API call failed to fetch transactions:', error);
      throw error;
    }
  } 
};
 
export default posApi;  