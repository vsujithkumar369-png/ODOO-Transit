import { request } from './api';

const fallbackMaintenance = [
  { id: 1, vehicle: 'MH12AB1234', type: 'Engine Service', technician: 'Rajan Kumar', status: 'In Progress', cost: 1200, date: '2026-07-10' },
  { id: 2, vehicle: 'DL01XY7890', type: 'Brake Replacement', technician: 'Suresh Pillai', status: 'Completed', cost: 3500, date: '2026-07-08' },
  { id: 3, vehicle: 'KA03ZZ5555', type: 'Tire Rotation', technician: 'Anand Mohan', status: 'Scheduled', cost: 800, date: '2026-07-14' },
  { id: 4, vehicle: 'TN22BB9999', type: 'Oil Change', technician: 'Rajan Kumar', status: 'Completed', cost: 500, date: '2026-07-05' },
];

export const maintenanceService = {
  async list() {
    return request('GET', '/maintenance', null, fallbackMaintenance);
  },
  async createLog(data) {
    return request('POST', '/maintenance', data, { id: Date.now(), ...data, status: 'Scheduled' });
  },
  async closeLog(id, cost) {
    return request('PUT', `/maintenance/${id}/close`, { cost }, { id, cost, status: 'Completed' });
  }
};
