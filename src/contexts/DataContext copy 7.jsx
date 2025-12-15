import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import branchApi from '../services/branchApi.js';
import categoryApi from '../services/categoryApi.js';
import serviceApi from '../services/serviceApi.js';
import employeeApi from '../services/employeeApi.js';
import comboApi from '../services/comboApi.js';
import membershipApiService from '../services/membershipApi.js';
import posApi from '../services/posApi.js';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
     
export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [combos, setCombos] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [settings, setSettings] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

  // Initialize default data (for items not yet on API)
  const defaultProducts = [
    {
      id: '1', name: 'Samsung Galaxy S21', brand: 'Samsung', imageUrl: 'https://images.pexels.com/photos/5081398/pexels-photo-5081398.jpeg?auto=compress&cs=tinysrgb&w=300', categoryId: '1', stock: 10, price: 799.99, offerPrice: 699.99, finalPrice: 699.99, discountPercent: 12.5, branchIds: ['1'], barcode: '1234567890123'
    },
    {
      id: '2', name: 'Nike Air Max', brand: 'Nike', imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', categoryId: '2', stock: 15, price: 120.00, offerPrice: null, finalPrice: 120.00, discountPercent: 0, branchIds: ['1'], barcode: '1234567890124'
    },
    {
      id: '3', name: 'Coca Cola 500ml', brand: 'Coca-Cola', imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300', categoryId: '3', stock: 50, price: 2.50, offerPrice: 2.00, finalPrice: 2.00, discountPercent: 20, branchIds: ['1'], barcode: '1234567890125'
    }
  ];

  const defaultSettings = {
    companyName: 'DEMO SPA', logoUrl: '', tagline: 'Modern Point of Sale Solution', phone: '+1 (555) 123-4567', email: 'admin@pos.com', website: 'https://dev.com', address: '123 Business Street, City, State 12345', businessType: 'Retail Store', currency: 'USD', taxRate: 0, receiptFooter: 'Thank you for your business!', theme: 'light', primaryColor: '#8B5CF6', fontFamily: 'Inter', fontSize: 'medium', timezone: 'America/New_York', dateFormat: 'MM/DD/YYYY', stripePublishableKey: '', stripeSecretKey: '', paypalClientId: '', emailProvider: 'smtp', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', enableNotifications: true, enableInventoryAlerts: true, autoBackup: true, sessionTimeout: 30, enableTwoFactor: false, allowGuestCheckout: true, enableLoyaltyProgram: false
  };

  // Fixed fetchMemberships function without infinite loop
  const fetchMemberships = useCallback(async () => {
    if (membershipLoading) return memberships;
    
    setMembershipLoading(true);
    try {
      const fetchedMemberships = await membershipApiService.fetchMemberships();
      setMemberships(fetchedMemberships);
      return fetchedMemberships;
    } catch (error) {
      console.warn('Membership API not available or failed:', error);
      setMemberships([]);
      return [];
    } finally {
      setMembershipLoading(false);
    }
  }, []); // Empty dependency array to prevent infinite loop

  // Fixed main useEffect
  useEffect(() => {
    if (user) {
      // Initialize localStorage data
      if (!localStorage.getItem('pos_products')) {
        localStorage.setItem('pos_products', JSON.stringify(defaultProducts));
      }
      if (!localStorage.getItem('pos_transactions')) {
        localStorage.setItem('pos_transactions', JSON.stringify([]));
      }
      if (!localStorage.getItem('pos_customers')) {
        localStorage.setItem('pos_customers', JSON.stringify([]));
      }
      if (!localStorage.getItem('pos_settings')) {
        localStorage.setItem('pos_settings', JSON.stringify(defaultSettings));
      }
      if (!localStorage.getItem('pos_combos')) {
        localStorage.setItem('pos_combos', JSON.stringify([]));
      }

      const fetchData = async () => {
        try {
          // Fetch core data from the API
          const [fetchedBranches, fetchedCategories, fetchedServices, fetchedEmployees, fetchedCombos] = await Promise.all([
            branchApi.fetchBranches(),
            categoryApi.fetchCategories(),
            serviceApi.fetchServices(),
            employeeApi.fetchEmployees(),
            comboApi.fetchCombos(),
          ]);
          
          setBranches(fetchedBranches);
          setCategories(fetchedCategories);
          setServices(fetchedServices);
          setEmployees(fetchedEmployees);
          setCombos(fetchedCombos);

          // Fetch memberships separately with error handling
          try {
            const fetchedMemberships = await membershipApiService.fetchMemberships();
            setMemberships(fetchedMemberships);
          } catch (membershipError) {
            console.warn('Failed to fetch memberships:', membershipError);
            setMemberships([]);
          }

          // Fetch customers and transactions from API
          try {
            const [fetchedCustomers, fetchedTransactions] = await Promise.all([
              posApi.fetchCustomers(),
              posApi.fetchTransactions()
            ]);
            setCustomers(fetchedCustomers);
            setTransactions(fetchedTransactions);
          } catch (posError) {
            console.warn('Failed to fetch POS data from API, using localStorage:', posError);
            // Fallback to localStorage if API fails
            setTransactions(JSON.parse(localStorage.getItem('pos_transactions') || '[]'));
            setCustomers(JSON.parse(localStorage.getItem('pos_customers') || '[]'));
          }

        } catch (error) {
          console.error('Failed to fetch core data:', error);
        }

        // Load local storage data
        setProducts(JSON.parse(localStorage.getItem('pos_products') || '[]'));
        setSettings(JSON.parse(localStorage.getItem('pos_settings') || '{}'));
      };
      
      fetchData();
    }
  }, [user]); // Only depend on user

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Branch operations
  const addBranch = async (branchData) => {
    try {
      const newBranch = await branchApi.addBranch(branchData);
      setBranches((prev) => [...prev, newBranch]);
      return newBranch;
    } catch (error) {
      console.error('Failed to add branch:', error);
      return null;
    }
  };

  const updateBranch = async (id, updates) => {
    try {
      const updatedBranch = await branchApi.updateBranch(id, updates);
      setBranches((prev) =>
        prev.map(branch => (branch.id === id ? updatedBranch : branch))
      );
      return updatedBranch;
    } catch (error) {
      console.error('Failed to update branch:', error);
      return null;
    }
  };

  const deleteBranch = async (id) => {
    try {
      await branchApi.deleteBranch(id);
      setBranches((prev) => prev.filter(branch => branch.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete branch:', error);
      return { success: false, error };
    }
  };

  // Category operations
  const addCategory = async (categoryData) => {
    try {
      const newCategory = await categoryApi.addCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Failed to add category:', error);
      return null;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const updatedCategory = await categoryApi.updateCategory(id, updates);
      setCategories((prev) =>
        prev.map(cat => (cat.id === id ? updatedCategory : cat))
      );
      return updatedCategory;
    } catch (error) {
      console.error('Failed to update category:', error);
      return null;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter(cat => cat.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete category:', error);
      return { success: false, error };
    }
  };

  // Employee operations (API-driven)
  const fetchEmployeesManual = async () => {
    try {
      const fetchedEmployees = await employeeApi.fetchEmployees();
      setEmployees(fetchedEmployees);
      return fetchedEmployees;
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw error;
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      const dataToSend = {
        ...employeeData,
        salary: parseFloat(employeeData.salary)
      };
      const newEmployee = await employeeApi.addEmployee(dataToSend);
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } catch (error) {
      console.error('Failed to add employee:', error);
      return null;
    }
  };

  const updateEmployee = async (id, updates) => {
    try {
      const dataToSend = {
        ...updates,
        salary: parseFloat(updates.salary)
      };
      const updatedEmployee = await employeeApi.updateEmployee(id, dataToSend);
      setEmployees((prev) =>
        prev.map(employee => (employee.id === id ? updatedEmployee : employee))
      );
      return updatedEmployee;
    } catch (error) {
      console.error('Failed to update employee:', error);
      return null;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeApi.deleteEmployee(id);
      setEmployees((prev) => prev.filter(employee => employee.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete employee:', error);
      return { success: false, error };
    }
  };

  // Product operations (still local for now)
  const addProduct = (product) => {
    const finalPrice = product.offerPrice || product.price;
    const discountPercent = product.offerPrice
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100 * 100) / 100
      : 0;
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      finalPrice,
      discountPercent,
      barcode: product.barcode || Date.now().toString()
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveToStorage('pos_products', updated);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    const finalPrice = updates.offerPrice || updates.price;
    const discountPercent = updates.offerPrice
      ? Math.round(((updates.price - updates.offerPrice) / updates.price) * 100 * 100) / 100
      : 0;
    const updated = products.map(prod =>
      prod.id === id
        ? { ...prod, ...updates, finalPrice, discountPercent }
        : prod
    );
    setProducts(updated);
    saveToStorage('pos_products', updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter(prod => prod.id !== id);
    setProducts(updated);
    saveToStorage('pos_products', updated);
  };

  // Service operations (API-driven)
  const addService = async (serviceData) => {
    try {
      const newService = await serviceApi.addService(serviceData);
      setServices((prev) => [...prev, newService]);
      return newService;
    } catch (error) {
      console.error('Failed to add service:', error);
      return null;
    }
  };

  const updateService = async (id, updates) => {
    try {
      const updatedService = await serviceApi.updateService(id, updates);
      setServices((prev) =>
        prev.map(service => (service.id === id ? updatedService : service))
      );
      return updatedService;
    } catch (error) {
      console.error('Failed to update service:', error);
      return null;
    }
  };

  const deleteService = async (id) => {
    try {
      await serviceApi.deleteService(id);
      setServices((prev) => prev.filter(service => service.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete service:', error);
      return { success: false, error };
    }
  };

  // Membership operations (API-driven with proper error handling and loading state)
  const addMembership = async (membershipData) => {
    try {
      const newMembership = await membershipApiService.addMembership(membershipData);
      setMemberships((prev) => [...prev, newMembership]);
      return newMembership;
    } catch (error) {
      console.error('Failed to add membership:', error);
      return null;
    }
  };

  const updateMembership = async (id, updates) => {
    try {
      const updatedMembership = await membershipApiService.updateMembership(id, updates);
      setMemberships((prev) =>
        prev.map(membership => (membership.id === id ? updatedMembership : membership))
      );
      return updatedMembership;
    } catch (error) {
      console.error('Failed to update membership:', error);
      return null;
    }
  };

  const deleteMembership = async (id) => {
    try {
      await membershipApiService.deleteMembership(id);
      setMemberships((prev) => prev.filter(membership => membership.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete membership:', error);
      return { success: false, error };
    }
  };

  const getMembershipByCode = async (code) => {
    try {
      const membership = await membershipApiService.getMembershipByCode(code);
      return membership;
    } catch (error) {
      console.error('Failed to get membership by code:', error);
      return null;
    }
  };

  const getMembershipStats = async () => {
    try {
      const stats = await membershipApiService.getMembershipStats();
      return stats;
    } catch (error) {
      console.error('Failed to get membership stats:', error);
      return null;
    }
  };

  // Transaction and Customer operations (API-driven)
  const addTransaction = async (transaction) => {
    try {
      const response = await posApi.addTransaction(transaction);
      const newTransaction = response.data.transaction;
      setTransactions((prev) => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Failed to add transaction via API:', error);
      return null;
    }
  };

  const addCustomer = async (customer) => {
    try {
      const response = await posApi.addCustomer(customer);
      const newCustomer = response.data.customer;
      setCustomers((prev) => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Failed to add customer via API:', error);
      return null;
    }
  };

  // Combo operations
  const addCombo = async (comboData) => {
    try {
      console.log('addCombo called with data:', comboData);
      
      if (!comboData.serviceIds || !Array.isArray(comboData.serviceIds)) {
        throw new Error('serviceIds is required and must be an array');
      }

      if (comboData.serviceIds.length === 0) {
        throw new Error('At least one service must be selected');
      }

      const selectedServices = services.filter(s => comboData.serviceIds.includes(s.id));
      
      if (selectedServices.length === 0) {
        throw new Error('No valid services found for the selected service IDs');
      }

      const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
      const discountPrice = parseFloat(comboData.discountPrice);
      
      if (isNaN(discountPrice) || discountPrice < 0) {
        throw new Error('Invalid discount price');
      }
      
      const discountPercentage = totalPrice > 0 
        ? Math.round(((totalPrice - discountPrice) / totalPrice) * 100 * 100) / 100 
        : 0;

      const servicesForAPI = comboData.serviceIds.map(serviceId => ({
        serviceId: serviceId,
        quantity: 1
      }));

      const apiData = {
        name: comboData.name,
        description: comboData.description || '',
        totalPrice: totalPrice,
        discountPrice: discountPrice,
        discountPercentage: discountPercentage,
        validityDays: comboData.validityDays ? parseInt(comboData.validityDays) : null,
        status: comboData.status || 'ACTIVE',
        branchId: user?.role === 'admin' ? comboData.branchId : user?.branchId,
        services: servicesForAPI
      };

      const newCombo = await comboApi.addCombo(apiData);
      
      if (!newCombo) {
        throw new Error('Failed to create combo - no response from server');
      }

      const transformedCombo = {
        id: newCombo.id,
        name: newCombo.name,
        description: newCombo.description,
        price: newCombo.totalPrice,
        finalPrice: newCombo.discountPrice,
        totalPrice: newCombo.totalPrice,
        discountPrice: newCombo.discountPrice,
        discountPercentage: newCombo.discountPercentage,
        validityDays: newCombo.validityDays,
        status: newCombo.status,
        branchIds: [newCombo.branchId],
        branchId: newCombo.branchId,
        services: newCombo.services || [],
        createdAt: newCombo.createdAt,
        updatedAt: newCombo.updatedAt
      };

      setCombos((prev) => [...prev, transformedCombo]);
      return transformedCombo;
    } catch (error) {
      console.error('Failed to add combo:', error);
      throw error;
    }
  };

  const updateCombo = async (id, comboData) => {
    try {
      console.log('updateCombo called with data:', comboData);
      
      if (!comboData.serviceIds || !Array.isArray(comboData.serviceIds)) {
        throw new Error('serviceIds is required and must be an array');
      }

      if (comboData.serviceIds.length === 0) {
        throw new Error('At least one service must be selected');
      }

      const selectedServices = services.filter(s => comboData.serviceIds.includes(s.id));
      
      if (selectedServices.length === 0) {
        throw new Error('No valid services found for the selected service IDs');
      }

      const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
      const discountPrice = parseFloat(comboData.discountPrice);
      
      if (isNaN(discountPrice) || discountPrice < 0) {
        throw new Error('Invalid discount price');
      }
      
      const discountPercentage = totalPrice > 0 
        ? Math.round(((totalPrice - discountPrice) / totalPrice) * 100 * 100) / 100 
        : 0;

      const servicesForAPI = comboData.serviceIds.map(serviceId => ({
        serviceId: serviceId,
        quantity: 1
      }));

      const apiData = {
        name: comboData.name,
        description: comboData.description || '',
        totalPrice: totalPrice,
        discountPrice: discountPrice,
        discountPercentage: discountPercentage,
        validityDays: comboData.validityDays ? parseInt(comboData.validityDays) : null,
        status: comboData.status || 'ACTIVE',
        services: servicesForAPI
      };

      const updatedCombo = await comboApi.updateCombo(id, apiData);
      
      if (!updatedCombo) {
        throw new Error('Failed to update combo - no response from server');
      }

      const transformedCombo = {
        id: updatedCombo.id,
        name: updatedCombo.name,
        description: updatedCombo.description,
        price: updatedCombo.totalPrice,
        finalPrice: updatedCombo.discountPrice,
        totalPrice: updatedCombo.totalPrice,
        discountPrice: updatedCombo.discountPrice,
        discountPercentage: updatedCombo.discountPercentage,
        validityDays: updatedCombo.validityDays,
        status: updatedCombo.status,
        branchIds: [updatedCombo.branchId],
        branchId: updatedCombo.branchId,
        services: updatedCombo.services || [],
        createdAt: updatedCombo.createdAt,
        updatedAt: updatedCombo.updatedAt
      };

      setCombos((prev) =>
        prev.map(combo => combo.id === id ? transformedCombo : combo)
      );
      return transformedCombo;
    } catch (error) {
      console.error('Failed to update combo:', error);
      throw error;
    }
  };  

  const deleteCombo = async (id) => {
    try {
      await comboApi.deleteCombo(id);
      setCombos((prev) => prev.filter(combo => combo.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete combo:', error);
      return { success: false, error };
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveToStorage('pos_settings', newSettings);

    if (newSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.style.setProperty('--font-family', newSettings.fontFamily);
    document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);

    const fontSizeMap = { 'small': '14px', 'medium': '16px', 'large': '18px', 'extra-large': '20px' };
    document.documentElement.style.setProperty('--font-size-base', fontSizeMap[newSettings.fontSize]);
  };

  const value = {
    categories,
    products,
    services,
    branches,
    employees,
    transactions,
    customers,
    combos,
    memberships,
    settings,
    membershipLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addService,
    updateService,
    deleteService,
    addBranch,
    updateBranch,
    deleteBranch,
    fetchEmployees: fetchEmployeesManual, // Renamed to avoid confusion
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addTransaction,
    addCustomer,
    addCombo,
    updateCombo,
    deleteCombo,
    fetchMemberships, // This is now a regular function, not memoized
    addMembership,
    updateMembership,
    deleteMembership,
    getMembershipByCode,
    getMembershipStats,
    updateSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};   