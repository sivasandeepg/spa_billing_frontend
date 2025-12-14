import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  Save,
  Briefcase,
  Layers,
  MapPin,
  IndianRupee,
  Tag,
  Building2,
  Sparkles
} from 'lucide-react';

const ServiceManagement = () => {
  const { user } = useAuth();
  const { services, categories, branches, addService, updateService, deleteService } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    branchIds: user?.role === 'admin' ? [] : [user?.branchId]
  });

  const filteredServices = useMemo(() => {
    let filtered = services;

    if (user?.role !== 'admin' && user?.branchId) {
      filtered = filtered.filter(s => s.branchIds && s.branchIds.includes(user.branchId));
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(s => s.categoryId === selectedCategory);
    }
    return filtered;
  }, [services, searchTerm, selectedCategory, user]);

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      categoryId: service.categoryId,
      branchIds: service.branchIds || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(serviceId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      branchIds: user?.role === 'admin' ? [] : [user?.branchId]
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getBranchNames = (branchIds) => {
    if (!branchIds || branchIds.length === 0) return 'No branches';
    const branchNames = branchIds.map(id => {
      const branch = branches.find(b => b.id === id);
      return branch ? branch.name : 'Unknown';
    });
    return branchNames.join(', ');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    handleCloseModal();
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 transform cursor-pointer group">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors duration-300">
              {service.name}
            </h3>
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(service);
            }}
            className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(service.id);
            }}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {service.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
      )}

      {/* Service Details */}
      <div className="space-y-3">
        {/* Price */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-green-100">
            <IndianRupee className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-lg font-bold text-green-600">
            ₹{service.price.toFixed(2)}
          </span>
        </div>

        {/* Category */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-blue-100">
            <Tag className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            {getCategoryName(service.categoryId)}
          </span>
        </div>

        {/* Branches - Only for Admin */}
        {user?.role === 'admin' && (
          <div className="flex items-start space-x-2">
            <div className="p-1 rounded-lg bg-orange-100 mt-0.5">
              <Building2 className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex flex-wrap gap-1">
              {service.branchIds && service.branchIds.length > 0 ? (
                service.branchIds.slice(0, 2).map(branchId => {
                  const branch = branches.find(b => b.id === branchId);
                  return branch ? (
                    <span key={branchId} className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      {branch.name}
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  No branches
                </span>
              )}
              {service.branchIds && service.branchIds.length > 2 && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  +{service.branchIds.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Service ID: {service.id}
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6 lg:pl-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ✨ Service Management
            </h1>
            <p className="text-gray-600 mt-2">Manage your salon services with style</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-300"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-300"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl px-4 py-3">
              <Layers className="h-5 w-5 mr-2 text-purple-600" />
              <span className="text-purple-700 font-medium">
                {filteredServices.length} service(s) found
              </span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <div className="p-6 rounded-full bg-gray-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-6">Create your first service to get started</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Service
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform scale-100 opacity-100">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {editingService ? '✏️ Edit Service' : '➕ Add New Service'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-300"
                    placeholder="e.g., Deep Tissue Massage"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-300"
                    placeholder="Describe your service..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-300"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-300"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                {user?.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Assign to Branches</label>
                    <div className="space-y-3 max-h-32 overflow-y-auto bg-gray-50 p-4 rounded-xl">
                      {branches.map(branch => (
                        <label key={branch.id} className="flex items-center hover:bg-white p-2 rounded-lg transition-colors duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.branchIds.includes(branch.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, branchIds: [...formData.branchIds, branch.id] });
                              } else {
                                setFormData({ ...formData, branchIds: formData.branchIds.filter(id => id !== branch.id) });
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-3 text-sm text-gray-700 font-medium">{branch.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingService ? 'Update' : 'Add'} Service
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

export default ServiceManagement;     