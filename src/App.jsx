import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LayoutProvider, useLayout } from './contexts/LayoutContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BranchManagerDashboard from './pages/BranchManagerDashboard';
import POSDashboard from './pages/POSDashboard';
import CategoryManagement from './pages/CategoryManagement';
import BranchManagement from './pages/BranchManagement';
import Reports from './pages/Reports';
import POS from './pages/POS';
import StaffManagement from './pages/StaffManagement';
import AdminProfile from './pages/AdminProfile';
import BranchManagerStaffManagement from './pages/BranchManagerStaffManagement';
import BranchManagerProfile from './pages/BranchManagerProfile';
import ComboManagement from './pages/ComboManagement';
import AdminSettings from './pages/AdminSettings';
import BrandManagement from './pages/BrandManagement';
import POSProfile from './pages/POSProfile';
import ServiceManagement from './pages/ServiceManagement';
import { useAuth } from './contexts/AuthContext';
import Profile from './pages/Profile';
import UserMembership from './pages/UserMembership';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <LayoutProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navbar />
              <MainContent />
            </div>
          </LayoutProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

const MainContent = () => {
  const { user } = useAuth();
  const { sidebarCollapsed } = useLayout();
  const location = useLocation();

  const shouldShowSidebar = user && location.pathname !== '/login';
  
  // Dynamic margin based on sidebar state
  const getMainContentClass = () => {
    if (!shouldShowSidebar) return '';
    
    if (sidebarCollapsed) {
      return 'lg:ml-16'; // Collapsed sidebar width
    } else {
      return 'lg:ml-64'; // Full sidebar width
    }
  };

  return (
    <div className={`${getMainContentClass()} transition-all duration-300 ease-in-out`}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
              
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="services" element={<ServiceManagement />} /> 
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="branches" element={<BranchManagement />} />
                <Route path="brands" element={<BrandManagement />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="usermembership" element={<UserMembership />} />  
                <Route path="combos" element={<ComboManagement />} />
                <Route path="profile" element={ <Profile/>} />    
                <Route path="settings" element={<AdminSettings />} />
                <Route path="reports" element={<Reports />} />
              </Routes>
            </PrivateRoute>
          } 
        />
              
        {/* Branch Manager Routes */}
        <Route 
          path="/manager/*" 
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Routes>
                <Route index element={<BranchManagerDashboard />} />
                <Route path="services" element={<ServiceManagement />} />
                <Route path="staff" element={<BranchManagerStaffManagement />} />
                <Route path="profile" element={<Profile />} />
                <Route path="combos" element={<ComboManagement />} />
                <Route path="reports" element={<Reports />} />
                <Route path="pos" element={<POS />} />
              </Routes>
            </PrivateRoute>
          } 
        />
              
        {/* POS User Routes */}
        <Route 
          path="/pos/*" 
          element={
            <PrivateRoute allowedRoles={['pos']}>
              <Routes>
                <Route index element={<POSDashboard />} />
                <Route path="billing" element={<POS />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </PrivateRoute>
          } 
        />

        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-3xl text-gray-500">404: Page Not Found</h1>
          </div>
        } />
      </Routes>
    </div>
  );  
};

export default App;  