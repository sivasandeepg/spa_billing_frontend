// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
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
  Bell,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const { sidebarCollapsed, setSidebarCollapsed } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if desktop view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile sidebar when screen becomes desktop
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(false);
    }
  }, [isDesktop]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
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
      ];
    } else if (user.role === 'manager') {
      return [
        { name: 'Dashboard', path: '/manager', icon: Home },
        { name: 'Services', path: '/manager/services', icon: Briefcase }, 
        { name: 'Staff', path: '/manager/staff', icon: Users },
        { name: 'Combo Packs', path: '/manager/combos', icon: Tag },
        { name: 'POS', path: '/manager/pos', icon: Monitor },
        { name: 'Reports', path: '/manager/reports', icon: BarChart3 },
      ];
    } else if (user.role === 'pos') {
      return [
        { name: 'Dashboard', path: '/pos', icon: Home },
        { name: 'Billing', path: '/pos/billing', icon: ShoppingCart },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  const getUserMenuItems = () => {
    const baseItems = [
      { name: 'Profile', path: `/${user.role}/profile`, icon: User }
    ];
    
    if (user.role === 'admin' || user.role === 'manager') {
      baseItems.push({ name: 'Settings', path: `/${user.role}/settings`, icon: Settings });
    }
    
    return baseItems;
  };

  const userMenuItems = getUserMenuItems();

  return (
    <>
      {/* Custom styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar { 
          display: none;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200/50 px-4 py-3 shadow-sm h-14">
        <div className="flex items-center justify-between h-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-2">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-7 w-7 object-contain rounded-lg ring-1 ring-gray-200"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {settings?.companyName?.charAt(0) || 'P'}
              </div>
            )}
            <h1 className="text-base font-bold text-gray-800 tracking-tight">
              {settings?.companyName || 'POS System'}
            </h1>
          </div>
          
          <button className="relative p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="h-14 lg:h-0" />
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-md border-r border-gray-200/60 shadow-xl transform transition-all duration-300 ease-in-out ${
        isDesktop ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
      } ${sidebarCollapsed && isDesktop ? 'w-16' : 'w-64'} overflow-y-auto hide-scrollbar`}>
        
        {/* Collapse Toggle Button - Desktop Only */}
        {isDesktop && (
          <div className="absolute -right-3 top-6 z-20">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-6 h-6 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 hover:scale-110 group"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <Maximize2 className="h-3 w-3 text-gray-600 group-hover:text-blue-600" />
              ) : (
                <Minimize2 className="h-3 w-3 text-gray-600 group-hover:text-blue-600" />
              )}
            </button>
          </div>
        )}

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-blue-50/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-9 h-9 object-contain rounded-xl shadow-md ring-2 ring-white"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-base ring-2 ring-white">
                {settings?.companyName?.charAt(0) || 'P'}
              </div>
            )}
            {!(sidebarCollapsed && isDesktop) && (
              <div>
                <h2 className="text-base font-bold text-gray-800 leading-tight">
                  {settings?.companyName || 'POS System'}
                </h2>
                <p className="text-xs text-gray-500 font-medium">Management System</p>
              </div>
            )}
          </div>
          {!isDesktop && (
            <button
              onClick={closeMobileSidebar}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2">
          <div className="space-y-1">
            {/* Main Navigation Items */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={`group relative flex items-center transition-all duration-200 ${
                      sidebarCollapsed && isDesktop
                        ? 'justify-center px-2 py-3' 
                        : 'space-x-3 px-3 py-2'
                    } text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100/50'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-blue-600'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full"></div>
                    )}
                    
                    <div className={`p-1 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100/70' 
                        : 'bg-gray-50/50 group-hover:bg-blue-50'
                    }`}>
                      <Icon className={`h-4 w-4 transition-all duration-200 ${
                        isActive 
                          ? 'text-blue-600' 
                          : 'text-gray-500 group-hover:text-blue-600'
                      }`} />
                    </div>
                    
                    {!(sidebarCollapsed && isDesktop) && (
                      <span className={`font-medium transition-all duration-200 ${
                        isActive ? 'text-blue-700' : 'group-hover:text-blue-600'
                      }`}>
                        {item.name}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && isDesktop && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* User Menu Items - Show when expanded */}
            {userMenuOpen && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <div key={item.path} className="relative group">
                      <Link
                        to={item.path}
                        onClick={() => {
                          closeMobileSidebar();
                          setUserMenuOpen(false);
                        }}
                        className={`group relative flex items-center transition-all duration-200 ${
                          sidebarCollapsed && isDesktop
                            ? 'justify-center px-2 py-3' 
                            : 'space-x-3 px-3 py-2'
                        } text-sm font-medium rounded-lg ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100/50'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-blue-600'
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full"></div>
                        )}
                        
                        <div className={`p-1 rounded-md transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-100/70' 
                            : 'bg-gray-50/50 group-hover:bg-blue-50'
                        }`}>
                          <Icon className={`h-4 w-4 transition-all duration-200 ${
                            isActive 
                              ? 'text-blue-600' 
                              : 'text-gray-500 group-hover:text-blue-600'
                          }`} />
                        </div>
                        
                        {!(sidebarCollapsed && isDesktop) && (
                          <span className={`font-medium transition-all duration-200 ${
                            isActive ? 'text-blue-700' : 'group-hover:text-blue-600'
                          }`}>
                            {item.name}
                          </span>
                        )}
                      </Link>

                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && isDesktop && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                          {item.name}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Logout Button */}
                <div className="relative group">
                  <button
                    onClick={handleLogout}
                    className={`group w-full relative flex items-center transition-all duration-200 ${
                      sidebarCollapsed && isDesktop
                        ? 'justify-center px-2 py-3' 
                        : 'space-x-3 px-3 py-2'
                    } text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700`}
                  >
                    <div className="p-1 rounded-md bg-gray-50/50 group-hover:bg-red-50 transition-all duration-200">
                      <LogOut className="h-4 w-4 transition-all duration-200 text-red-500 group-hover:text-red-600" />
                    </div>
                    
                    {!(sidebarCollapsed && isDesktop) && (
                      <span className="font-medium transition-all duration-200 group-hover:text-red-700">
                        Logout
                      </span>
                    )}
                  </button>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && isDesktop && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                      Logout
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Section at Bottom */}
        <div className="mt-auto p-2 border-t border-gray-100">
          <div className="relative group">
            <button
              onClick={toggleUserMenu}
              className={`group relative flex items-center transition-all duration-200 ${
                sidebarCollapsed && isDesktop
                  ? 'justify-center px-2 py-3 w-full' 
                  : 'space-x-3 px-3 py-2 w-full'
              } text-sm font-medium rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/40 hover:from-blue-50 hover:to-indigo-50/40 border border-gray-100/50`}
            >
              {/* User Icon - Always centered like other nav icons when collapsed */}
              <div className={`p-1 rounded-md transition-all duration-200 bg-gray-50/50 group-hover:bg-blue-50`}>
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-white rounded-full"></div>
                </div>
              </div>
              
              {/* User Info - Only show when expanded */}
              {!(sidebarCollapsed && isDesktop) && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize font-medium">{user.role}</p>
                  </div>
                  <div className="text-gray-400">
                    {userMenuOpen ? (
                      <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </div>
                </>
              )}
            </button>

            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && isDesktop && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                {user.name} ({user.role})
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}

            {/* User Menu Dropdown for Collapsed State */}
            {userMenuOpen && sidebarCollapsed && isDesktop && (
              <div className="absolute left-full bottom-0 ml-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="p-1.5">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setUserMenuOpen(false)}
                        className={`flex items-center space-x-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  <div className="my-1.5 border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar; 