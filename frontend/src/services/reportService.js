import { request } from './api';

const fallbackFuelReports = [
  { date: "2026-07-08", vehicle: "V-001", efficiency: "8.5 km/l" },
  { date: "2026-07-09", vehicle: "V-002", efficiency: "7.2 km/l" },
  { date: "2026-07-10", vehicle: "V-003", efficiency: "6.8 km/l" }
];

export const reportService = {
  async getFuelEfficiency(query = '') {
    return request('GET', `/reports/fuel-efficiency${query}`, null, fallbackFuelReports);
  },

  async getOperationalCost() {
    return request('GET', '/reports/operational-costs', null, []);
  },

  async getFleetUtilization() {
    return request('GET', '/reports/fleet-utilization', null, []);
  },

  async getVehicleROI() {
    return request('GET', '/reports/vehicle-roi', null, []);
  },

  async getBudget() {
    return request('GET', '/reports/budget', null, []);
  }
};
