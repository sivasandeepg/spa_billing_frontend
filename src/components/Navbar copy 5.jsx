// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLayout } from '../contexts/LayoutContext';
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
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const { sidebarCollapsed, setSidebarCollapsed } = useLayout();
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
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Top Header Bar (Desktop) - Fixed height and proper spacing */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200/50 px-6 py-3 shadow-sm h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-8 w-8 object-contain rounded-lg ring-1 ring-gray-200"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {settings?.companyName?.charAt(0) || 'P'}  
              </div>
            )} 
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              {settings?.companyName || 'DEMO SPA'} 
            </h1>
          </div>
          
          <div className="flex items-center space-x-3"> 

          
            {/* Notifications */}
            <button className="relative p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100 transition-colors group">
              <Bell className="h-4 w-4 text-gray-600 group-hover:text-gray-700" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize leading-tight">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
                </div>
                <div className="p-1.5">
                  <Link
                    to={`/${user.role}/profile`}
                    className="flex items-center space-x-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                  {(user.role === 'admin' || user.role === 'manager') && (
                    <Link
                      to={`/${user.role}/settings`}
                      className="flex items-center space-x-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  )}
                  <div className="my-1.5 border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Mobile menu button - Fixed height */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200/50 px-4 py-3 shadow-sm h-14">
        <div className="flex items-center justify-between h-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-2">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-8 w-8 object-contain rounded-lg ring-1 ring-gray-200"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {settings?.companyName?.charAt(0) || 'P'}
              </div>
            )}
            <h1 className="text-base font-bold text-gray-800 tracking-tight">
              {settings?.companyName || 'Luxe Aura'}
            </h1>
          </div>
          
          <button className="relative p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Proper Spacers - Fixed heights to match header heights */}
      <div className="h-14 lg:h-16" />
      
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Enhanced with proper top positioning and collapse functionality */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-md border-r border-gray-200/60 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} w-64 overflow-y-auto hide-scrollbar`} 
      style={{ top: window.innerWidth >= 1024 ? '64px' : '0px' }}>
        
        {/* Collapse Toggle Button (Desktop Only) */}
        <div className="hidden lg:block absolute -right-4 top-8 z-20">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 bg-white border-2 border-blue-200 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-105 group"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
            )}
          </button>
        </div>

        {/* Logo Header (Mobile Only) - Enhanced */}
        <div className="lg:hidden p-5 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-10 h-10 object-contain rounded-xl shadow-md ring-2 ring-white"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-base ring-2 ring-white">
                {settings?.companyName?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight">
                {settings?.companyName || 'Luxe Aura'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation - Enhanced with collapse functionality */}
        <nav className="py-4 px-3 flex-1">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center transition-all duration-200 ${
                      item.mobileOnly ? 'lg:hidden' : ''
                    } ${
                      item.hideOnDesktop ? 'lg:hidden' : ''
                    } ${
                      sidebarCollapsed 
                        ? 'justify-center px-3 py-3' 
                        : 'space-x-3 px-3 py-2.5'
                    } text-sm font-medium rounded-xl ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100/50'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-blue-600 hover:translate-x-1'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full shadow-sm"></div>
                    )}
                    
                    <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100/70 shadow-sm' 
                        : 'bg-gray-50/50 group-hover:bg-blue-50 group-hover:shadow-sm'
                    }`}>
                      <Icon className={`h-4 w-4 transition-all duration-200 ${
                        isActive 
                          ? 'text-blue-600' 
                          : 'text-gray-500 group-hover:text-blue-600'
                      }`} />
                    </div>
                    
                    {!sidebarCollapsed && (
                      <span className={`font-medium transition-all duration-200 ${
                        isActive ? 'text-blue-700' : 'group-hover:text-blue-600'
                      }`}>
                        {item.name}
                      </span>
                    )}

                    {/* Subtle hover effect */}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${
                      !isActive ? 'group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:to-blue-50/20' : ''
                    }`}></div>
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User info and logout - Enhanced Mobile Only */}
        <div className={`lg:hidden mt-auto p-3 border-t border-gray-100 ${sidebarCollapsed ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/40 rounded-xl p-3 border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize font-medium">{user.role} Account</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105 group"
                  title="Switch Account"
                >
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105 group"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;  