import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Fleet Manager
import FMDashboard from '../pages/fleetManager/Dashboard';
import Vehicles from '../pages/fleetManager/Vehicles';
import Drivers from '../pages/fleetManager/Drivers';
import DispatchTrips from '../pages/fleetManager/DispatchTrips';
import DispatchHistory from '../pages/fleetManager/DispatchHistory';
import Maintenance from '../pages/fleetManager/Maintenance';
import FMFuelLogs from '../pages/fleetManager/FuelLogs';
import Expenses from '../pages/fleetManager/Expenses';
import Reports from '../pages/fleetManager/Reports';
import FMSettings from '../pages/fleetManager/Settings';

// Driver
import DriverDashboard from '../pages/driver/Dashboard';
import MyTrips from '../pages/driver/MyTrips';
import CurrentTrip from '../pages/driver/CurrentTrip';
import FuelLogs from '../pages/driver/FuelLogs';
import TripHistory from '../pages/driver/TripHistory';
import Profile from '../pages/driver/Profile';
import DriverSettings from '../pages/driver/Settings';

// Helper to handle role string normalization (e.g. "Fleet Manager" vs "FleetManager")
const normalizeRole = (role) => {
  if (!role) return '';
  return role.replace(/\s+/g, '').toLowerCase();
};

// Role-based redirect after login
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const normalized = normalizeRole(user.role);
  if (normalized === 'driver') return <Navigate to="/driver/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

// Protected route wrapper
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles) {
    const normalizedUserRole = normalizeRole(user.role);
    const hasRole = allowedRoles.some(role => normalizeRole(role) === normalizedUserRole);
    if (!hasRole) return <RoleRedirect />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Root redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Fleet Manager / Safety Officer / Financial Analyst */}
      <Route path="/dashboard" element={<PrivateRoute allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}><FMDashboard /></PrivateRoute>} />
      <Route path="/vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
      <Route path="/drivers" element={<PrivateRoute><Drivers /></PrivateRoute>} />
      <Route path="/dispatch" element={<PrivateRoute><DispatchTrips /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><DispatchHistory /></PrivateRoute>} />
      <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
      <Route path="/fuel" element={<PrivateRoute><FMFuelLogs /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><FMSettings /></PrivateRoute>} />

      {/* Driver */}
      <Route path="/driver/dashboard" element={<PrivateRoute allowedRoles={['Driver']}><DriverDashboard /></PrivateRoute>} />
      <Route path="/driver/my-trips" element={<PrivateRoute allowedRoles={['Driver']}><MyTrips /></PrivateRoute>} />
      <Route path="/driver/current-trip" element={<PrivateRoute allowedRoles={['Driver']}><CurrentTrip /></PrivateRoute>} />
      <Route path="/driver/fuel-logs" element={<PrivateRoute allowedRoles={['Driver']}><FuelLogs /></PrivateRoute>} />
      <Route path="/driver/trip-history" element={<PrivateRoute allowedRoles={['Driver']}><TripHistory /></PrivateRoute>} />
      <Route path="/driver/profile" element={<PrivateRoute allowedRoles={['Driver']}><Profile /></PrivateRoute>} />
      <Route path="/driver/settings" element={<PrivateRoute allowedRoles={['Driver']}><DriverSettings /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
