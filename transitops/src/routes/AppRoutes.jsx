import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/fleetManager/Dashboard';
import Vehicles from '../pages/fleetManager/Vehicles';
import Drivers from '../pages/fleetManager/Drivers';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/drivers" element={<Drivers />} />
      {/* Other routes can be mapped similarly */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};
export default AppRoutes;
