import { request } from './api';

export const safetyReportService = {
  async getFleetUtilization(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/reports/fleet-utilization${query ? '?' + query : ''}`, null, null);
  },

  async getFuelEfficiency(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/reports/fuel-efficiency${query ? '?' + query : ''}`, null, null);
  },

  async getOperationalCost(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/reports/operational-cost${query ? '?' + query : ''}`, null, null);
  },

  async getVehicleROI(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/reports/vehicle-roi${query ? '?' + query : ''}`, null, null);
  },

  async exportCSV() {
    return request('GET', '/reports/export?type=csv', null, null);
  },
};
