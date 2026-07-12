import { request } from './api';

export const safetyDriverService = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const path = query ? `/drivers?${query}` : '/drivers';
    return request('GET', path, null, null);
  },

  async getById(id) {
    return request('GET', `/drivers/${id}`, null, null);
  },

  async update(id, data) {
    return request('PUT', `/drivers/${id}`, data, null);
  },

  async updateSafetyScore(id, score, remarks) {
    // TODO: PATCH /api/drivers/:id/safety-score
    return request('PATCH', `/drivers/${id}/safety-score`, { score, remarks }, null);
  },

  async getHistory(id) {
    // TODO: GET /api/drivers/:id/history
    return request('GET', `/drivers/${id}/history`, null, null);
  },

  async suspend(id, reason) {
    // TODO: PATCH /api/drivers/:id/suspend
    return request('PATCH', `/drivers/${id}/suspend`, { reason }, null);
  },

  async activate(id) {
    // TODO: PATCH /api/drivers/:id/activate
    return request('PATCH', `/drivers/${id}/activate`, {}, null);
  },
};
