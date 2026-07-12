import { request } from './api';

export const safetyDashboardService = {
  async getKPIs() {
    // TODO: GET /api/dashboard/kpis — should return safety-specific KPI shape:
    //   { totalDrivers, activeDrivers, driversOnTrip, suspendedDrivers, licenseExpiringSoon, averageSafetyScore }
    return request('GET', '/dashboard/kpis', null, null);
  },

  async getAlerts() {
    // TODO: GET /api/dashboard/alerts — returns recent safety alerts
    return request('GET', '/dashboard/alerts', null, null);
  },

  async getActivity() {
    // TODO: GET /api/dashboard/activity — returns recent activity timeline
    return request('GET', '/dashboard/activity', null, null);
  },
};
