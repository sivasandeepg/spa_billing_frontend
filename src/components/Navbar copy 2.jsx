// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut,
  Layers,
  Building2,
  Monitor,
  Briefcase,
  Tag,
  Search,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (location.pathname === '/login' || !user) {
    return null;
  }

  const getNavigationItems = () => {
    if (user.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin', icon: Home },
        { name: 'Services', path: '/admin/services', icon: Briefcase }, 
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: 'Branches', path: '/admin/branches', icon: Building2 }, 
        { name: 'Staff', path: '/admin/staff', icon: Users },
        { name: 'User Membership', path: '/admin/usermembership', icon: Users }, 
        { name: 'Combo Packs', path: '/admin/combos', icon: Tag },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { name: 'Settings', path: '/admin/settings', icon: Settings, hideOnDesktop: true },
        { name: 'Profile', path: '/admin/profile', icon: User, mobileOnly: true },
      ];
    } else if (user.role === 'manager') {
      return [
        { name: 'Dashboard', path: '/manager', icon: Home },
        { name: 'Services', path: '/manager/services', icon: Briefcase }, 
        { name: 'Staff', path: '/manager/staff', icon: Users },
        { name: 'Combo Packs', path: '/manager/combos', icon: Tag },
        { name: 'POS', path: '/manager/pos', icon: Monitor },
        { name: 'Reports', path: '/manager/reports', icon: BarChart3 },
        { name: 'Profile', path: '/manager/profile', icon: User, mobileOnly: true },
      ];
    } else if (user.role === 'pos') {
      return [
        { name: 'Dashboard', path: '/pos', icon: Home },
        { name: 'Billing', path: '/pos/billing', icon: ShoppingCart },
        { name: 'Profile', path: '/pos/profile', icon: User, mobileOnly: true },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Add custom styles for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
      `}</style>

      {/* Top Header Bar (Desktop) - Mini like health dashboard */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-8 w-8 object-contain rounded-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {settings?.companyName?.charAt(0) || ''}  
              </div>
            )} 
            <h1 className="text-lg font-bold text-gray-900">
              {settings?.companyName || ''} 
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
      
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to={`/${user.role}/profile`}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    {(user.role === 'admin' || user.role === 'manager') && (
                      <Link
                        to={`/${user.role}/settings`}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-8 w-8 object-contain rounded-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {settings?.companyName?.charAt(0) || 'P'}
              </div>
            )}
            <h1 className="text-lg font-bold text-gray-900">
              {settings?.companyName || 'POS System'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacers */}
      <div className="h-14 lg:h-16" />
      
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with hidden scrollbar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-sm transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto hide-scrollbar lg:top-16`}>
        
        {/* Logo Header (Mobile Only) */}
        <div className="lg:hidden p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-12 h-12 object-contain rounded-xl shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-lg">
                {settings?.companyName?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {settings?.companyName || 'POS System'}
              </h2>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-6 px-4 flex-1">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.mobileOnly ? 'lg:hidden' : ''
                  } ${
                    item.hideOnDesktop ? 'lg:hidden' : ''
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:translate-x-1'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                  )}
                  
                  <Icon className={`h-5 w-5 transition-all duration-200 ${
                    isActive 
                      ? 'text-blue-600 scale-110' 
                      : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-105'
                  }`} />
                  <span className={`font-medium transition-all duration-200 ${
                    isActive ? 'text-blue-700' : ''
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout - ONLY VISIBLE ON MOBILE */}
        <div className="lg:hidden mt-auto p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize font-medium">{user.role} Account</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 group"
                title="Logout"
              >
                <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;    