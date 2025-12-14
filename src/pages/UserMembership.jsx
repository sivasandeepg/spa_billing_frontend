import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Save,
  Search,
  UserCheck,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  DollarSign,
  Percent,
  Award,
  IndianRupee
} from 'lucide-react';

const MembershipManagement = () => {
  const { user } = useAuth();
  const { customers, employees, memberships, addMembership, updateMembership, deleteMembership, fetchMemberships } = useData();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [viewingMembership, setViewingMembership] = useState(null);
  const [formData, setFormData] = useState({
    membershipCode: '',
    customerId: '',
    type: 'BRONZE',
    price: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    referredByEmployeeId: '',
    benefits: {
      freeServices: true,
      priorityBooking: true,
      specialOffers: true
    }
  });

  useEffect(() => {
    const loadMemberships = async () => {
      try {
        setLoading(true);
        await fetchMemberships();
      } catch (error) {
        console.error('Error loading memberships:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadMemberships();
    }
  }, [user, fetchMemberships]);

  const filteredMemberships = memberships?.filter(membership =>
    membership.membershipCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membership.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membership.customer?.phone?.includes(searchTerm) ||
    membership.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const generateMembershipCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `MEM${timestamp}`;
  };

const handleEdit = (membership) => {
  console.log('Editing membership:', membership); // Debug log
  
  setEditingMembership(membership);
  
  // More robust data extraction with fallbacks
  const formDataToSet = {
    membershipCode: membership.membershipCode || '',
    customerId: membership.customerId || '',
    type: membership.type || 'BRONZE',
    price: membership.price ? membership.price.toString() : '',
    discountPercentage: membership.discountPercentage ? membership.discountPercentage.toString() : '',
    startDate: membership.startDate ? membership.startDate.split('T')[0] : '',
    endDate: membership.endDate ? membership.endDate.split('T')[0] : '',
    status: membership.status || 'ACTIVE',
    referredByEmployeeId: membership.referredByEmployeeId || '',
    benefits: {
      freeServices: membership.benefits?.freeServices ?? true,
      priorityBooking: membership.benefits?.priorityBooking ?? true,
      specialOffers: membership.benefits?.specialOffers ?? true
    }
  };
  
  console.log('Form data being set:', formDataToSet); // Debug log
  setFormData(formDataToSet);
  setIsModalOpen(true);
};

// Also add this helper function to validate the form before opening modal
const validateFormData = (data) => {
  const requiredFields = ['customerId', 'type', 'price', 'discountPercentage', 'startDate', 'endDate'];
  const missingFields = requiredFields.filter(field => !data[field] || data[field] === '');
  
  if (missingFields.length > 0) {
    console.warn('Missing required fields:', missingFields);
    return false;
  }
  
  return true;
};

// Enhanced handleSubmit with better debugging
const handleSubmit = async () => {
  try {
    console.log('Current form data before submit:', formData); // Debug log
    
    // Validation before sending
    if (!formData.customerId || !formData.type || !formData.price || !formData.discountPercentage || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

      

    // Additional validation
    const priceValue = parseFloat(formData.price);
    const discountValue = parseFloat(formData.discountPercentage);
    
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Price must be a valid number greater than 0.');
      return;
    }
   
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      alert('Discount percentage must be a valid number between 0 and 100.');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('End date must be after start date.');
      return;
    }

    const membershipData = {
      membershipCode: formData.membershipCode || generateMembershipCode(),
      customerId: formData.customerId,
      type: formData.type,
      price: priceValue,
      discountPercentage: discountValue,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      referredByEmployeeId: formData.referredByEmployeeId || null,
      benefits: formData.benefits
    };

    console.log('Sending membership data:', membershipData); // Debug log

    if (editingMembership) {
      console.log('Updating membership with ID:', editingMembership.id);
      const updatedMembership = await updateMembership(editingMembership.id, membershipData);
      if (!updatedMembership) {
        alert('Failed to update membership. Please try again.');
        return;
      }
      console.log('Membership updated successfully:', updatedMembership);
    } else {
      console.log('Creating new membership');
      const newMembership = await addMembership(membershipData);
      if (!newMembership) {
        alert('Failed to create membership. Please try again.');
        return;
      }
      console.log('Membership created successfully:', newMembership);
    }

    handleCloseModal();
  } catch (error) {
    console.error('Error saving membership:', error);
    console.error('Error details:', error.response?.data);
    
    // More detailed error handling
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else if (error.message) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Error saving membership. Please try again.');
    }
  }
};   

  const handleView = (membership) => {
    setViewingMembership(membership);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (membershipId) => {
    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        const result = await deleteMembership(membershipId);
        if (!result.success) {
          alert('Failed to delete membership. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting membership:', error);
        alert('Error deleting membership. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMembership(null);
    setFormData({
      membershipCode: '',
      customerId: '',
      type: 'BRONZE',
      price: '',
      discountPercentage: '',
      startDate: '',
      endDate: '',
      status: 'ACTIVE',
      referredByEmployeeId: '',
      benefits: {
        freeServices: true,
        priorityBooking: true,
        specialOffers: true
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'INACTIVE':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'SUSPENDED':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeColor = (type) => {
    switch (type) {
      case 'PLATINUM':
        return 'bg-gray-900 text-white';
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'SILVER':
        return 'bg-gray-100 text-gray-800';
      case 'BRONZE':
        return 'bg-orange-100 text-orange-800';
      case 'ANNUAL':
        return 'bg-blue-100 text-blue-800';
      case 'LIFETIME':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:pl-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading memberships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Membership Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer memberships and benefits across all branches
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Membership
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {memberships?.filter(m => m.status === 'ACTIVE').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {memberships?.filter(m => m.status === 'EXPIRED').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {memberships?.filter(m => m.type === 'GOLD').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg mr-4">
                <Award className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Platinum</p>
                <p className="text-2xl font-bold text-gray-900">
                  {memberships?.filter(m => m.type === 'PLATINUM').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{memberships?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search memberships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <CreditCard className="h-4 w-4 mr-2" />
            {filteredMemberships.length} membership(s)
          </div>
        </div>

        {/* Memberships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMemberships.map((membership) => (
            <div key={membership.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{membership.membershipCode}</h3>
                    <p className="text-sm text-gray-600">{membership.customer?.name}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(membership)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(membership)}
                    className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(membership.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div className="flex items-center">
                    {getStatusIcon(membership.status)}
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(membership.status)}`}>
                      {membership.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipTypeColor(membership.type)}`}>
                    {membership.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-gray-900 font-medium">₹{membership.price?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600 font-medium">{membership.discountPercentage}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="text-gray-900">{membership.customer?.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="text-gray-900">{new Date(membership.endDate).toLocaleDateString()}</span>
                </div>

                {membership.status === 'ACTIVE' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days Left:</span>
                    <span className="text-green-600 font-medium">
                      {calculateDaysRemaining(membership.endDate)} days
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                {membership.referredByEmployee && (
                  <div className="text-xs text-gray-500 mb-1">
                    Referred by: {membership.referredByEmployee.name}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Customer: {membership.customer?.customerCode}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMemberships.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No memberships found</p>
            <p className="text-gray-400 text-sm">Add your first membership to get started</p>
          </div>
        )}

        {/* Add/Edit Membership Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingMembership ? 'Edit Membership' : 'Add New Membership'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Membership Code
                    </label>
                    <input
                      type="text"
                      value={formData.membershipCode}
                      onChange={(e) => setFormData({ ...formData, membershipCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a customer</option>
                      {customers?.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Membership Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="BRONZE">Bronze</option>
                      <option value="SILVER">Silver</option>
                      <option value="GOLD">Gold</option>
                      <option value="PLATINUM">Platinum</option>
                      <option value="ANNUAL">Annual</option>
                      <option value="LIFETIME">Lifetime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage *
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referred By Employee
                    </label>
                    <select
                      value={formData.referredByEmployeeId}
                      onChange={(e) => setFormData({ ...formData, referredByEmployeeId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">No referral</option>
                      {employees?.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Membership Benefits
                  </label>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="freeServices"
                        checked={formData.benefits.freeServices}
                        onChange={(e) => setFormData({
                          ...formData,
                          benefits: { ...formData.benefits, freeServices: e.target.checked }
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="freeServices" className="ml-2 block text-sm text-gray-900">
                        Free Services at All Branches
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="priorityBooking"
                        checked={formData.benefits.priorityBooking}
                        onChange={(e) => setFormData({
                          ...formData,
                          benefits: { ...formData.benefits, priorityBooking: e.target.checked }
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="priorityBooking" className="ml-2 block text-sm text-gray-900">
                        Priority Booking
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="specialOffers"
                        checked={formData.benefits.specialOffers}
                        onChange={(e) => setFormData({
                          ...formData,
                          benefits: { ...formData.benefits, specialOffers: e.target.checked }
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="specialOffers" className="ml-2 block text-sm text-gray-900">
                        Special Offers & Discounts
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Important:</strong> Members with active memberships can use services at any branch without additional charges.
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    The discount percentage will be applied to all services during billing.
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingMembership ? 'Update' : 'Create'} Membership
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Membership Modal */}
        {isViewModalOpen && viewingMembership && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Membership Details
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-purple-600 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{viewingMembership.membershipCode}</h3>
                  <p className="text-purple-600 font-medium">{viewingMembership.type} Membership</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium text-gray-900">{viewingMembership.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Code:</span>
                    <span className="font-medium text-gray-900">{viewingMembership.customer?.customerCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{viewingMembership.customer?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{viewingMembership.customer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(viewingMembership.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingMembership.status)}`}>
                        {viewingMembership.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-gray-900">₹{viewingMembership.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-bold text-green-600">{viewingMembership.discountPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">{new Date(viewingMembership.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">{new Date(viewingMembership.endDate).toLocaleDateString()}</span>
                  </div>
                  {viewingMembership.status === 'ACTIVE' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className="font-bold text-green-600">
                        {calculateDaysRemaining(viewingMembership.endDate)} days
                      </span>
                    </div>
                  )}
                  {viewingMembership.referredByEmployee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Referred By:</span>
                      <span className="font-medium text-gray-900">{viewingMembership.referredByEmployee.name}</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Membership Benefits</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {viewingMembership.benefits?.freeServices && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Free access to all branch services
                      </li>
                    )}
                    {viewingMembership.benefits?.priorityBooking && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Priority booking and support
                      </li>
                    )}
                    {viewingMembership.benefits?.specialOffers && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Special offers and discounts
                      </li>
                    )}
                    <li className="flex items-center">
                      <Percent className="h-4 w-4 mr-2" />
                      {viewingMembership.discountPercentage}% discount on all services
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Cross-Branch Access</h4>
                  <p className="text-sm text-green-800">
                    This membership is valid at all branches. Customer can avail services at any location without additional charges.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipManagement;    