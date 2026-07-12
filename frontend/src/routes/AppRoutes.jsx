import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Fleet Manager Pages
import Dashboard from '../pages/fleetManager/Dashboard';
import Vehicles from '../pages/fleetManager/Vehicles';
import Drivers from '../pages/fleetManager/Drivers';
import DispatchTrips from '../pages/fleetManager/DispatchTrips';
import DispatchHistory from '../pages/fleetManager/DispatchHistory';
import Maintenance from '../pages/fleetManager/Maintenance';
import FuelLogs from '../pages/fleetManager/FuelLogs';
import Expenses from '../pages/fleetManager/Expenses';
import Reports from '../pages/fleetManager/Reports';
import Settings from '../pages/fleetManager/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/dispatch" element={<DispatchTrips />} />
      <Route path="/history" element={<DispatchHistory />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/fuel" element={<FuelLogs />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};
export default AppRoutes;
