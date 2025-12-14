import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Save,
  Search,
  ShoppingBag,
  Percent,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ComboManagement = () => {
  const { user } = useAuth();
  const { services, combos, addCombo, updateCombo, deleteCombo, branches } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceIds: [],
    totalPrice: 0,
    discountPrice: '',
    validityDays: '',
    status: 'ACTIVE',
    branchId: user.role === 'admin' ? '' : user.branchId
  });

  // Get available services for current user
  const availableServices = useMemo(() => {
    if (user.role === 'admin') return services.filter(s => s.status === 'ACTIVE');
    return services.filter(s => 
      s.status === 'ACTIVE' && 
      s.branchIds && 
      s.branchIds.includes(user.branchId)
    );
  }, [services, user.role, user.branchId]);

  // Filter combos based on user role, search, and status
  const filteredCombos = useMemo(() => {
    let filtered = combos;

    // Filter by branch for non-admin users
    if (user.role !== 'admin' && user.branchId) {
      filtered = filtered.filter(c => c.branchId === user.branchId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.services?.some(s => s.service.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    return filtered;
  }, [combos, searchTerm, statusFilter, user.role, user.branchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.serviceIds.length < 2) {
      alert('Please select at least 2 services for the combo');
      setIsLoading(false);
      return;
    }

    try {
      const selectedServices = availableServices.filter(s => 
        formData.serviceIds.includes(s.id)
      );
      
      const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
      const discountPrice = parseFloat(formData.discountPrice) || totalPrice;
      const discountPercentage = totalPrice > 0 
        ? Math.round(((totalPrice - discountPrice) / totalPrice) * 100 * 100) / 100
        : 0;

      const comboData = {
        name: formData.name,
        description: formData.description,
        totalPrice: totalPrice,
        discountPrice: discountPrice,
        discountPercentage: discountPercentage,
        validityDays: formData.validityDays ? parseInt(formData.validityDays) : null,
        status: formData.status,
        branchId: user.role === 'admin' ? formData.branchId : user.branchId,
        services: formData.serviceIds.map(serviceId => ({
          serviceId: serviceId,
          quantity: 1
        }))
      };

      let result;
      if (editingCombo) {
        result = await updateCombo(editingCombo.id, comboData);
      } else {
        result = await addCombo(comboData);
      }

      if (result) {
        handleCloseModal();
      } else {
        alert('Failed to save combo. Please try again.');
      }
    } catch (error) {
      console.error('Error saving combo:', error);
      alert('Failed to save combo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (combo) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      description: combo.description || '',
      serviceIds: combo.services?.map(s => s.service.id) || [],
      totalPrice: combo.totalPrice,
      discountPrice: combo.discountPrice,
      validityDays: combo.validityDays || '',
      status: combo.status,
      branchId: combo.branchId
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (comboId) => {
    if (window.confirm('Are you sure you want to delete this combo? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        const result = await deleteCombo(comboId);
        if (!result.success) {
          alert('Failed to delete combo. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting combo:', error);
        alert('Failed to delete combo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCombo(null);
    setFormData({
      name: '',
      description: '',
      serviceIds: [],
      totalPrice: 0,
      discountPrice: '',
      validityDays: '',
      status: 'ACTIVE',
      branchId: user.role === 'admin' ? '' : user.branchId
    });
  };

  const toggleService = (serviceId) => {
    const newServiceIds = formData.serviceIds.includes(serviceId)
      ? formData.serviceIds.filter(id => id !== serviceId)
      : [...formData.serviceIds, serviceId];
    
    setFormData({ ...formData, serviceIds: newServiceIds });
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const calculatePreview = () => {
    const selectedServices = availableServices.filter(s => 
      formData.serviceIds.includes(s.id)
    );
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const discountPrice = parseFloat(formData.discountPrice) || totalPrice;
    const savings = totalPrice - discountPrice;
    const savingsPercent = totalPrice > 0 
      ? Math.round((savings / totalPrice) * 100 * 100) / 100 
      : 0;

    return { selectedServices, totalPrice, discountPrice, savings, savingsPercent };
  };

  const preview = calculatePreview();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'INACTIVE':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'EXPIRED':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Service Combo Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage service combo packages with special pricing</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            disabled={isLoading}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Service Combo
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search combos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg mr-3">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{combo.name}</h3>
                    <p className="text-sm text-gray-500">
                      {combo.services?.length || 0} services
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(combo.status)}`}>
                    {getStatusIcon(combo.status)}
                    <span className="ml-1">{combo.status}</span>
                  </span>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(combo)}
                      className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(combo.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                {combo.description && (
                  <p className="text-sm text-gray-600 mb-3">{combo.description}</p>
                )}
                
                {/* Services in combo */}
                <div className="space-y-1 mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase">Includes:</p>
                  {combo.services?.map((comboService, index) => (
                    <div key={comboService.service.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {comboService.service.name}
                        {comboService.quantity > 1 && ` (x${comboService.quantity})`}
                      </span>
                      <span className="text-gray-500">${comboService.service.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Individual total:</span>
                    <span className="text-sm text-gray-400 line-through">
                      ${combo.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">Combo Price:</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-green-600">
                        ${combo.discountPrice?.toFixed(2)}
                      </span>
                      {combo.discountPercentage > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          Save {combo.discountPercentage}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {combo.validityDays && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Valid for:
                      </span>
                      <span>{combo.validityDays} days</span>
                    </div>
                  )}
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                  <strong>Branch:</strong> {getBranchName(combo.branchId)}
                </div>
              )}

              {combo.discountPercentage > 0 && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Percent className="h-3 w-3 mr-1" />
                    {combo.discountPercentage}% Savings
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCombos.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No service combos found</p>
            <p className="text-gray-400 text-sm">Create your first service combo to offer bundled deals</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCombo ? 'Edit Service Combo' : 'Create New Service Combo'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Combo Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Relaxation Package"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Describe the combo package benefits..."
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Combo Price *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                          disabled={isLoading}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Validity (Days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.validityDays}
                          onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="30"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={isLoading}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="EXPIRED">Expired</option>
                        </select>
                      </div>

                      {user.role === 'admin' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch *
                          </label>
                          <select
                            value={formData.branchId}
                            onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                            disabled={isLoading}
                          >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                              <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Service Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Services (minimum 2) *
                      </label>
                      <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                        {availableServices.map(service => (
                          <label key={service.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={formData.serviceIds.includes(service.id)}
                              onChange={() => toggleService(service.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              disabled={isLoading}
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-900">{service.name}</span>
                                <span className="text-sm text-gray-600">${service.price.toFixed(2)}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {service.category?.name} • {service.duration ? `${service.duration} min` : 'No duration set'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {formData.serviceIds.length} services
                      </p>
                    </div>

                    {/* Preview */}
                    {formData.serviceIds.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Pricing Preview
                        </h4>
                        <div className="space-y-2 text-sm">
                          {preview.selectedServices.map(service => (
                            <div key={service.id} className="flex justify-between">
                              <span className="text-gray-700">{service.name}</span>
                              <span className="text-gray-600">${service.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-gray-600">
                              <span>Individual Total:</span>
                              <span>${preview.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900">
                              <span>Combo Price:</span>
                              <span className="text-green-600">${preview.discountPrice.toFixed(2)}</span>
                            </div>
                            {preview.savings > 0 && (
                              <div className="flex justify-between text-green-600 font-medium">
                                <span>Customer Saves:</span>
                                <span>${preview.savings.toFixed(2)} ({preview.savingsPercent}%)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formData.serviceIds.length < 2 || isLoading}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingCombo ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingCombo ? 'Update' : 'Create'} Combo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboManagement;  