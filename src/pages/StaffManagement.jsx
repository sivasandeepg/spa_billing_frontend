import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Save,
  Search,
  UserCheck,
  Building,
  Crown,
  ShoppingCart,
  Loader2
} from 'lucide-react';

const StaffManagement = () => {
  const { user } = useAuth();
  const { branches, employees, addEmployee, updateEmployee, deleteEmployee, fetchEmployees } = useData();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    position: 'cashier',
    salary: '',
    branchId: user?.branchId || ''
  });

  // Load employees only once when component mounts
  useEffect(() => {
    // Only fetch if employees array is empty to avoid redundant calls
    if (employees.length === 0) {
      setLoading(true);
      fetchEmployees()
        .catch(error => {
          console.error('Failed to fetch employees:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []); // Empty dependency array - only run once on mount

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || employee.position === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingEmployee) {
        // Update existing employee
        const success = await updateEmployee(editingEmployee.id, formData);
        if (success) {
          handleCloseModal();
        }
      } else {
        // Create new employee
        const success = await addEmployee(formData);
        if (success) {
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Failed to save employee:', error);
      // You might want to show an error message to the user here
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      position: employee.position,
      salary: employee.salary.toString(),
      branchId: employee.branchId || user?.branchId || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId);
      } catch (error) {
        console.error('Failed to delete employee:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      position: 'cashier',
      salary: '',
      branchId: user?.branchId || ''
    });
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unassigned';
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 'manager': return Crown;
      case 'cashier': return ShoppingCart;
      case 'sales_associate': return Users;
      default: return Users;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'manager': return 'purple';
      case 'cashier': return 'blue';
      case 'sales_associate': return 'green';
      default: return 'gray';
    }
  };

  const getPositionLabel = (position) => {
    switch (position) {
      case 'manager': return 'Manager';
      case 'cashier': return 'Cashier';
      case 'sales_associate': return 'Sales Associate';
      default: return position;
    }
  };

  if (employees.length === 0 && !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:pl-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="text-lg text-gray-600">Loading employees...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Staff Management
            </h1>
            <p className="text-gray-600 mt-2">Manage employees and their roles</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Employee
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Positions</option>
              <option value="manager">Managers</option>
              <option value="cashier">Cashiers</option>
              <option value="sales_associate">Sales Associates</option>
            </select>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {filteredEmployees.length} employee(s)
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => {
            const PositionIcon = getPositionIcon(employee.position);
            const positionColor = getPositionColor(employee.position);
            
            return (
              <div key={employee.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 bg-${positionColor}-100 rounded-lg mr-4`}>
                      <PositionIcon className={`h-6 w-6 text-${positionColor}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                      <p className={`text-sm font-medium text-${positionColor}-600`}>
                        {getPositionLabel(employee.position)}
                      </p>
                    </div>
                  </div>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{employee.employeeCode}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{getBranchName(employee.branchId)}</span>
                  </div>
                  <div className="text-gray-500">
                    {employee.email}
                  </div>
                  <div className="text-gray-500">
                    {employee.phone}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-${positionColor}-100 text-${positionColor}-800`}>
                    ${employee.salary}/month
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No employees found</p>
            <p className="text-gray-400 text-sm">Add your first employee to get started</p>
          </div>
        )}

        {/* Add/Edit Employee Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={submitting}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter full name"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  >
                    <option value="cashier">Cashier</option>
                    <option value="sales_associate">Sales Associate</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Salary *
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter monthly salary"
                    required
                    min="0"
                    step="0.01"
                    disabled={submitting}
                  />
                </div>

                {user?.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to Branch *
                    </label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      disabled={submitting}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {submitting ? 'Saving...' : (editingEmployee ? 'Update' : 'Create')} Employee
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

export default StaffManagement;