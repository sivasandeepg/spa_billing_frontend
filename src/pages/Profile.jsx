import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  User, Mail, Shield, Edit, Save, X, Lock, Crown, Calendar, Building, BarChart3, ShoppingCart
} from 'lucide-react';
import { authService } from '../services/authApi';

const Profile = () => {
  const { user } = useAuth();
  const { branches } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    department: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const fetchedProfile = await authService.getProfile();
      if (fetchedProfile) {
        setProfileData(fetchedProfile);
        setFormData({
          name: fetchedProfile.name || '',
          email: fetchedProfile.email || '',
          phone: fetchedProfile.phone || '',
          company: 'POS Systems Inc.', // This can be fetched from a settings API
          address: fetchedProfile.address || '',
          department: 'Branch Operations', // This can be fetched from a settings API
        });
      }
      setLoading(false);
    };
    fetchProfileData();
  }, [user]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update user profile
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // TODO: Implement API call to change password
    alert('Password updated successfully!');
    setIsPasswordModalOpen(false);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!profileData) {
    return <div className="p-6">Error: Could not load profile data.</div>;
  }
  
  const branch = profileData.branchId ? branches.find(b => b.id === profileData.branchId) : null;
  const roleName = {
    'admin': 'Administrator',
    'manager': 'Branch Manager',
    'pos': 'POS Operator'
  };

  const roleIcon = {
    'admin': Crown,
    'manager': Crown,
    'pos': ShoppingCart
  };

  const stats = [
    { label: 'Role', value: roleName[profileData.role], icon: roleIcon[profileData.role], color: profileData.role === 'admin' ? 'purple' : 'blue', description: 'System role' },
    { label: 'Email', value: profileData.email, icon: Mail, color: 'gray', description: 'Email address' },
    { label: 'Branch Assigned', value: branch?.name || 'N/A', icon: Building, color: 'emerald', description: 'Current assignment' },
    { label: 'Account Status', value: profileData.status, icon: BarChart3, color: 'green', description: 'Account status' }
  ];
  
  const RoleIcon = roleIcon[profileData.role];
  const roleColor = profileData.role === 'admin' ? 'purple' : 'blue';

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {roleName[profileData.role]} Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(false)} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-r from-${roleColor}-600 to-blue-600 rounded-full flex items-center justify-center mr-6`}>
                  <RoleIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{profileData.name}</h3>
                  <p className={`text-${roleColor}-600 font-medium`}>{roleName[profileData.role]}</p>
                  <p className="text-sm text-gray-500">ID: #{profileData.id}</p>
                  {branch && <p className="text-sm text-gray-500">Branch: {branch.name}</p>}
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{profileData.name}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{profileData.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 bg-${stat.color}-100 rounded-lg mr-3`}>
                        <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`bg-gradient-to-r ${profileData.role === 'admin' ? 'from-purple-600 to-blue-600' : 'from-blue-500 to-purple-600'} rounded-xl shadow-sm p-6 text-white`}>
              <h3 className="text-lg font-semibold mb-2">Access Details</h3>
              <p className={`text-${profileData.role === 'admin' ? 'purple' : 'blue'}-100 text-sm mb-4`}>
                Your role grants you {profileData.role === 'admin' ? 'full administrative privileges' : 'manager-level access'} for {profileData.branch ? profileData.branch.name : 'all branches'}.
              </p>
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 mr-2" />
                <span>Security Level: {profileData.role === 'admin' ? 'Maximum' : 'Manager'}</span>
              </div>
            </div>
          </div>
        </div>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
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

export default Profile;  