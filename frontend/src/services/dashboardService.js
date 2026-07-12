import { request } from './api';

const fallbackKPIs = {
  totalVehicles: 42,
  availableVehicles: 25,
  vehiclesInShop: 5,
  activeTrips: 12,
  pendingTrips: 2,
  driversOnDuty: 12,
  fleetUtilization: 28.57,
  totalFuelCost: 15000.00,
  totalMaintenanceCost: 6250.00
};

export const dashboardService = {
  async getKPIs() {
    return request('GET', '/dashboard/kpis', null, fallbackKPIs);
  }
};
