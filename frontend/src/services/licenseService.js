import { request } from './api';

export const licenseService = {
  async list(params = {}) {
    // TODO: GET /api/license-expiry
    const query = new URLSearchParams(params).toString();
    const path = query ? `/license-expiry?${query}` : '/license-expiry';
    return request('GET', path, null, null);
  },

  async getById(id) {
    // TODO: GET /api/license-expiry/:id
    return request('GET', `/license-expiry/${id}`, null, null);
  },

  async sendReminder(id) {
    // TODO: POST /api/license-expiry/:id/reminder
    return request('POST', `/license-expiry/${id}/reminder`, {}, null);
  },
};
