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
  MapPin
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
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Service Management
            </h1>
            <p className="text-gray-600 mt-2">Manage your salon services</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex items-center text-sm text-gray-600">
              <Layers className="h-4 w-4 mr-2" />
              {filteredServices.length} service(s) found
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branches</th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getCategoryName(service.categoryId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{service.price.toFixed(2)}</td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getBranchNames(service.branchIds)}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No services found</p>
              <p className="text-gray-400 text-sm">Create your first service to get started</p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter service description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Branches</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {branches.map(branch => (
                        <label key={branch.id} className="flex items-center">
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
                          <span className="ml-2 text-sm text-gray-700">{branch.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                    <Save className="h-4 w-4 mr-2" />
                    {editingService ? 'Update' : 'Add'} Service
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

export default ServiceManagement;  