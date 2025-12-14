import React, { useState } from 'react';
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
  User,
  MapPin,
  Briefcase,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  Activity,
  Shield,
  Loader2
} from 'lucide-react';

const BranchManagerStaffManagement = () => {
  // Mock user and data contexts for demo
  const user = { branchId: 'branch-1' };
  const branches = [
    { id: 'branch-1', name: 'Downtown Branch' },
    { id: 'branch-2', name: 'Mall Branch' }
  ];
  
  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'pos',
      branchId: 'branch-1',
      status: 'online',
      lastActive: '2 min ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      role: 'pos',
      branchId: 'branch-1',
      status: 'online',
      lastActive: '5 min ago'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      username: 'mikejohnson',
      email: 'mike@example.com',
      role: 'pos',
      branchId: 'branch-1',
      status: 'offline',
      lastActive: '1 hour ago'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      username: 'sarahwilson',
      email: 'sarah@example.com',
      role: 'pos',
      branchId: 'branch-1',
      status: 'online',
      lastActive: 'Just now'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role: 'pos',
    branchId: user.branchId
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      status: 'offline',
      lastActive: 'Never'
    };
    return newUser;
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingStaff) {
      const updatedStaff = staff.map(member => 
        member.id === editingStaff.id ? { ...member, ...formData } : member
      );
      setStaff(updatedStaff);
      showNotification('Staff member updated successfully!');
    } else {
      const newStaff = createUser(formData);
      if (newStaff) {
        setStaff([...staff, newStaff]);
        showNotification('New staff member created successfully!');
      }
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      username: member.username,
      password: '', 
      email: member.email,
      role: 'pos',
      branchId: user.branchId
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this POS operator?')) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStaff = staff.filter(member => member.id !== memberId);
      setStaff(updatedStaff);
      showNotification('Staff member deleted successfully!');
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      role: 'pos',
      branchId: user.branchId
    });
    setShowPassword(false);
  };

  const branch = branches.find(b => b.id === user.branchId);
  const onlineCount = staff.filter(s => s.status === 'online').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
                          transform transition-all duration-500 animate-[slideInRight_0.5s_ease-out]">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {notification}
            </div>
          </div>
        )}

        {/* Header Section with Enhanced Animations */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 
                         animate-[fadeInDown_0.8s_ease-out]">
          <div className="transform transition-all duration-500 hover:translate-x-3 group">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 
                          bg-clip-text text-transparent mb-2
                          bg-[length:200%_auto] animate-[gradient-x_3s_ease-in-out_infinite]">
              Branch Staff Management
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <p className="transition-colors duration-300 group-hover:text-gray-800">
                Manage all POS operators for{' '}
                <span className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300">
                  {branch?.name}
                </span>
              </p>
              <div className="flex items-center text-sm bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full
                             border border-white/20 shadow-sm">
                <Activity className="h-4 w-4 text-green-500 mr-2" />
                <span className="font-medium text-green-600">{onlineCount}</span>
                <span className="text-gray-600 ml-1">online</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="mt-6 lg:mt-0 group relative overflow-hidden flex items-center px-8 py-4 
                       bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white 
                       rounded-2xl shadow-xl transform transition-all duration-300 ease-out
                       hover:scale-105 hover:shadow-2xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700
                       active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                       before:translate-x-[-100%] before:transition-transform before:duration-700 
                       hover:before:translate-x-[100%]"
          >
            <Plus className="h-5 w-5 mr-3 transform transition-transform duration-300 
                            group-hover:rotate-90 group-hover:scale-110" />
            <span className="relative z-10 font-semibold">Add New Staff</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800/50 to-blue-800/50 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>
        </div>

        {/* Stats and Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 
                          border border-white/20 transform transition-all duration-500 
                          hover:shadow-xl hover:scale-[1.02] hover:bg-white/90
                          animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 
                                transition-all duration-300 group-hover:text-purple-500 
                                group-focus-within:text-purple-600 group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="Search staff members by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl 
                           transition-all duration-300 ease-out
                           focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                           focus:shadow-lg focus:bg-white hover:border-purple-400 hover:shadow-md
                           placeholder:text-gray-400 text-gray-700"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 
                              opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm rounded-2xl 
                          shadow-lg p-6 border border-white/20 transform transition-all duration-500 
                          hover:shadow-xl hover:scale-[1.02]
                          animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900">{filteredStaff.length}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  {onlineCount} currently active
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg
                             transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Staff Grid with Enhanced Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member, index) => (
              <div 
                key={member.id} 
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 
                           border border-white/20 transform transition-all duration-500 ease-out
                           hover:shadow-2xl hover:scale-105 hover:-translate-y-3 hover:border-purple-300/50
                           hover:bg-white cursor-pointer relative overflow-hidden
                           animate-[fadeInUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-indigo-600/5 
                                opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>

                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'online' 
                      ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                      : 'bg-gray-300'
                  } transition-all duration-300 group-hover:scale-125`}>
                    {member.status === 'online' && (
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>
                </div>

                {/* Header with Profile and Actions */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center">
                    <div className="relative p-4 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 
                                    rounded-2xl mr-4 shadow-inner transform transition-all duration-500 
                                    group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg
                                    before:absolute before:inset-0 before:bg-gradient-to-br 
                                    before:from-purple-200/50 before:before:to-blue-200/50 before:rounded-2xl 
                                    before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-300">
                      <Briefcase className="h-7 w-7 text-purple-600 relative z-10
                                            transition-all duration-300 group-hover:text-indigo-600" />
                    </div>
                    <div className="transform transition-all duration-300 group-hover:translate-x-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-1
                                     transition-colors duration-300 group-hover:text-purple-600">
                        {member.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-blue-600 
                                      transition-all duration-300 group-hover:text-purple-600">
                          POS Operator
                        </p>
                        <Shield className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 transform translate-x-6 opacity-0 
                                  transition-all duration-500 ease-out
                                  group-hover:translate-x-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(member);
                      }}
                      className="relative overflow-hidden p-3 rounded-xl text-purple-600 
                                 transition-all duration-300 hover:text-white hover:scale-110
                                 active:scale-95 group/btn bg-purple-50 hover:bg-purple-600
                                 shadow-md hover:shadow-lg"
                    >
                      <Edit className="h-4 w-4 relative z-10 transition-transform duration-300 
                                        group-hover/btn:rotate-12" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(member.id);
                      }}
                      disabled={isLoading}
                      className="relative overflow-hidden p-3 rounded-xl text-red-600 
                                 transition-all duration-300 hover:text-white hover:scale-110
                                 active:scale-95 group/btn bg-red-50 hover:bg-red-600
                                 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 relative z-10 transition-transform duration-300 
                                         group-hover/btn:rotate-12" />
                    </button>
                  </div>
                </div>

                {/* Staff Details */}
                <div className="space-y-4 text-sm text-gray-600 relative z-10">
                  <div className="flex items-center transform transition-all duration-300 
                                   hover:translate-x-3 hover:text-purple-600 cursor-pointer
                                   p-2 -mx-2 rounded-lg hover:bg-purple-50/50">
                    <UserCheck className="h-4 w-4 mr-3 text-gray-400 
                                          transition-all duration-300 hover:text-purple-500 flex-shrink-0" />
                    <span className="text-gray-800 font-mono transition-colors duration-300 
                                     group-hover:text-purple-600 truncate">
                      @{member.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center transform transition-all duration-300 
                                   hover:translate-x-3 hover:text-purple-600 cursor-pointer
                                   p-2 -mx-2 rounded-lg hover:bg-purple-50/50">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400 
                                        transition-all duration-300 hover:text-purple-500 flex-shrink-0" />
                    <span className="text-gray-800 transition-colors duration-300 
                                     group-hover:text-purple-600 truncate">
                      {branch?.name || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center transform transition-all duration-300 
                                   hover:translate-x-3 hover:text-purple-600 cursor-pointer
                                   p-2 -mx-2 rounded-lg hover:bg-purple-50/50">
                    <Mail className="h-4 w-4 mr-3 text-gray-400 
                                     transition-all duration-300 hover:text-purple-500 flex-shrink-0" />
                    <span className="text-gray-800 transition-colors duration-300 
                                     group-hover:text-purple-600 truncate">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center
                                 transform transition-all duration-300 group-hover:border-purple-200 relative z-10">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                       transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${
                      member.status === 'online'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 group-hover:from-green-200 group-hover:to-emerald-200'
                        : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 group-hover:from-gray-200 group-hover:to-slate-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        member.status === 'online' 
                          ? 'bg-green-500 animate-pulse' 
                          : 'bg-gray-400'
                      }`}></div>
                      {member.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-400 font-mono 
                                     transition-colors duration-300 group-hover:text-purple-400">
                      ID: {member.id.substring(0, 8)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {member.lastActive}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 col-span-full 
                             animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
              <div className="transform transition-all duration-500 hover:scale-110">
                <div className="relative">
                  <Building className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-gray-200 border-t-purple-400 
                                     rounded-full animate-spin opacity-20"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No staff found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {searchTerm 
                  ? `No staff members match "${searchTerm}"` 
                  : 'Add your first staff member to get started'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                             text-white rounded-xl hover:from-purple-700 hover:to-blue-700 
                             transform transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Staff Member
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50
                          animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto
                            transform transition-all duration-300 scale-95 opacity-0
                            animate-[modalSlideIn_0.4s_ease-out_forwards] border border-gray-200">
              
              {/* Modal Header */}
              <div className="relative flex justify-between items-center p-8 border-b border-gray-100
                              bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {editingStaff ? 'Update staff member information' : 'Create a new POS operator account'}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full
                             transition-all duration-300 hover:bg-gray-100 hover:scale-110
                             active:scale-95"
                >
                  <X className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
                </button>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 
                                rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Name Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3
                                     transition-colors duration-300 group-focus-within:text-purple-600">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl
                               transition-all duration-300 ease-out
                               focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                               focus:shadow-lg focus:bg-white hover:border-purple-400 hover:shadow-md
                               placeholder:text-gray-400"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Username Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3
                                     transition-colors duration-300 group-focus-within:text-purple-600">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl
                               transition-all duration-300 ease-out
                               focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                               focus:shadow-lg focus:bg-white hover:border-purple-400 hover:shadow-md
                               placeholder:text-gray-400 font-mono"
                    placeholder="Enter username"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3
                                     transition-colors duration-300 group-focus-within:text-purple-600">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl
                                 transition-all duration-300 ease-out
                                 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                                 focus:shadow-lg focus:bg-white hover:border-purple-400 hover:shadow-md
                                 placeholder:text-gray-400"
                      placeholder="Enter password"
                      required={!editingStaff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                 hover:text-purple-600 transition-all duration-300 hover:scale-110 p-1"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {editingStaff && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Leave blank to keep current password
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3
                                     transition-colors duration-300 group-focus-within:text-purple-600">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl
                               transition-all duration-300 ease-out
                               focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                               focus:shadow-lg focus:bg-white hover:border-purple-400 hover:shadow-md
                               placeholder:text-gray-400"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Branch Assignment Info */}
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 p-6 rounded-2xl 
                                border border-purple-100 transform transition-all duration-300 
                                hover:shadow-md hover:scale-[1.02] group/info">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg
                                     transition-transform duration-300 group-hover/info:scale-110">
                      <Building className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800 flex items-center mb-2">
                        <span>Branch Assignment</span>
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      </div>
                      <p className="text-purple-600 font-medium text-lg">{branch?.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        This staff member will be assigned to your branch with POS operator privileges.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isLoading}
                    className="px-8 py-4 text-gray-700 bg-gray-100 rounded-xl font-semibold
                               transition-all duration-300 hover:bg-gray-200 hover:scale-105
                               active:scale-95 hover:shadow-md disabled:opacity-50
                               border border-gray-200 hover:border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden flex items-center justify-center px-8 py-4 
                               bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white 
                               rounded-xl font-semibold transition-all duration-300 
                               hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700
                               hover:scale-105 hover:shadow-xl active:scale-95 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               before:absolute before:inset-0 before:bg-gradient-to-r 
                               before:from-white/20 before:to-transparent before:translate-x-[-100%] 
                               before:transition-transform before:duration-700 
                               hover:before:translate-x-[100%]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-3" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-3 transition-transform duration-300 
                                          group-hover:rotate-12 group-hover:scale-110" />
                        <span className="relative z-10">
                          {editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
                        </span>
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

export default BranchManagerStaffManagement;  