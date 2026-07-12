import { request } from './api';

const fallbackLogs = [
  {
    id: 1,
    vehicle_id: 3,
    description: "Engine tuning & filter replacement",
    cost: 0,
    status: "In Shop",
    created_at: "2026-07-12T08:00:00.000Z"
  }
];

export const maintenanceService = {
  async list() {
    return request('GET', '/maintenance', null, fallbackLogs);
  },

  async createLog(maintenanceData) {
    const fallback = {
      id: Math.floor(Math.random() * 1000) + 100,
      ...maintenanceData,
      status: "In Shop",
      created_at: new Date().toISOString()
    };
    return request('POST', '/maintenance', maintenanceData, fallback);
  },

  async closeLog(id, cost) {
    const fallback = {
      id,
      cost,
      status: "Closed",
      closed_at: new Date().toISOString()
    };
    return request('PUT', `/maintenance/${id}/close`, { cost }, fallback);
  }
};
