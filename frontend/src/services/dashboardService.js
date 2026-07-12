import { request } from './api';

const fallbackKPIs = {
  totalVehicles: 8,
  availableVehicles: 5,
  vehiclesInShop: 1,
  activeTrips: 3,
  pendingTrips: 2,
  driversOnDuty: 4,
  fleetUtilization: 37.5,
  totalFuelCost: 4800.00,
  totalMaintenanceCost: 1250.00
};

export const dashboardService = {
  async getKPIs() {
    return request('GET', '/dashboard/kpis', null, fallbackKPIs);
  }
};
