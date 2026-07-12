import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export const TripsContext = createContext(null);

const TRIPS_KEY = 'transitops_trips';
const FUEL_KEY = 'transitops_fuel_logs';

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
const todayStr = () => new Date().toISOString().split('T')[0];

const DEMO_TRIPS = [
  { id: 'TRP-001', source: 'Chennai', destination: 'Bangalore', vehicle: 'TN-01-AB-1234', cargoType: 'Electronics', cargoWeight: 2500, startDate: '2025-07-01', endDate: '2025-07-01', status: 'Completed', distance: 346, progress: 100, createdAt: '2025-07-01' },
  { id: 'TRP-002', source: 'Bangalore', destination: 'Mumbai', vehicle: 'TN-02-CD-5678', cargoType: 'Textiles', cargoWeight: 3200, startDate: '2025-07-05', endDate: '2025-07-06', status: 'Completed', distance: 984, progress: 100, createdAt: '2025-07-05' },
  { id: 'TRP-003', source: 'Chennai', destination: 'Hyderabad', vehicle: 'TN-01-AB-1234', cargoType: 'Auto Parts', cargoWeight: 1800, startDate: '2025-07-10', endDate: '2025-07-10', status: 'Active', distance: 627, progress: 45, createdAt: '2025-07-10' },
  { id: 'TRP-004', source: 'Coimbatore', destination: 'Delhi', vehicle: 'TN-03-EF-9012', cargoType: 'FMCG', cargoWeight: 4500, startDate: '2025-07-12', endDate: '2025-07-14', status: 'Pending', distance: 2181, progress: 0, createdAt: '2025-07-12' },
  { id: 'TRP-005', source: 'Madurai', destination: 'Pune', vehicle: 'TN-04-GH-3456', cargoType: 'Machinery', cargoWeight: 6000, startDate: '2025-07-15', endDate: '2025-07-17', status: 'Pending', distance: 1486, progress: 0, createdAt: '2025-07-15' },
  { id: 'TRP-006', source: 'Chennai', destination: 'Kolkata', vehicle: 'TN-01-AB-1234', cargoType: 'Chemicals', cargoWeight: 3000, startDate: '2025-06-20', endDate: '2025-06-22', status: 'Cancelled', distance: 1671, progress: 0, createdAt: '2025-06-20' },
];

const DEMO_FUEL = [
  { id: 'FL-001', vehicle: 'TN-01-AB-1234', driverName: 'Alex Driver', quantity: 85, cost: 7735, station: 'IOCL Chennai', date: '2025-07-01', remarks: 'Full tank before long trip' },
  { id: 'FL-002', vehicle: 'TN-02-CD-5678', driverName: 'Alex Driver', quantity: 120, cost: 10920, station: 'BPCL Bangalore', date: '2025-07-05', remarks: '' },
  { id: 'FL-003', vehicle: 'TN-01-AB-1234', driverName: 'Alex Driver', quantity: 60, cost: 5460, station: 'HP Hyderabad', date: '2025-07-10', remarks: 'Mid-trip refuel' },
];

function seedData() {
  if (!localStorage.getItem(TRIPS_KEY)) localStorage.setItem(TRIPS_KEY, JSON.stringify(DEMO_TRIPS));
  if (!localStorage.getItem(FUEL_KEY)) localStorage.setItem(FUEL_KEY, JSON.stringify(DEMO_FUEL));
}
seedData();

// eslint-disable-next-line react-refresh/only-export-components
export const useTrips = () => {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be inside TripsProvider');
  return ctx;
};

const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    try { return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]'); } catch { return []; }
  });

  const [fuelLogs, setFuelLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FUEL_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(TRIPS_KEY, JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem(FUEL_KEY, JSON.stringify(fuelLogs)); }, [fuelLogs]);

  const addTrip = useCallback((tripData) => {
    const newTrip = { ...tripData, id: generateId('TRP'), status: tripData.status || 'Pending', progress: 0, createdAt: todayStr() };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  }, []);

  const updateTrip = useCallback((id, updates) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTrip = useCallback((id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  const startTrip = useCallback((id) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status: 'Active', progress: 0, startedAt: todayStr() } : t));
  }, []);

  const updateProgress = useCallback((id, progress) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, progress: Math.min(100, Math.max(0, progress)) } : t));
  }, []);

  const completeTrip = useCallback((id) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed', progress: 100, completedAt: todayStr() } : t));
  }, []);

  const cancelTrip = useCallback((id) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status: 'Cancelled' } : t));
  }, []);

  const addFuelLog = useCallback((logData) => {
    const newLog = { ...logData, id: generateId('FL'), createdAt: todayStr() };
    setFuelLogs(prev => [newLog, ...prev]);
    return newLog;
  }, []);

  const updateFuelLog = useCallback((id, updates) => {
    setFuelLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const deleteFuelLog = useCallback((id) => {
    setFuelLogs(prev => prev.filter(l => l.id !== id));
  }, []);

  const activeTrip = trips.find(t => t.status === 'Active') || null;

  const stats = {
    pending: trips.filter(t => t.status === 'Pending').length,
    active: trips.filter(t => t.status === 'Active').length,
    completed: trips.filter(t => t.status === 'Completed').length,
    cancelled: trips.filter(t => t.status === 'Cancelled').length,
    totalDistance: trips.filter(t => t.status === 'Completed').reduce((s, t) => s + (Number(t.distance) || 0), 0),
    totalFuelLogs: fuelLogs.length,
    totalFuelQty: fuelLogs.reduce((s, l) => s + (Number(l.quantity) || 0), 0),
    totalFuelCost: fuelLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0),
  };

  return (
    <TripsContext.Provider value={{
      trips, fuelLogs, activeTrip, stats,
      addTrip, updateTrip, deleteTrip, startTrip, updateProgress, completeTrip, cancelTrip,
      addFuelLog, updateFuelLog, deleteFuelLog,
    }}>
      {children}
    </TripsContext.Provider>
  );
};

export default TripsProvider;
