import { request } from './api';

export const incidentService = {
  async list(params = {}) {
    // TODO: GET /api/incidents
    const query = new URLSearchParams(params).toString();
    const path = query ? `/incidents?${query}` : '/incidents';
    return request('GET', path, null, null);
  },

  async getById(id) {
    // TODO: GET /api/incidents/:id
    return request('GET', `/incidents/${id}`, null, null);
  },

  async create(data) {
    // TODO: POST /api/incidents
    return request('POST', '/incidents', data, null);
  },

  async updateStatus(id, data) {
    // TODO: PUT /api/incidents/:id
    return request('PUT', `/incidents/${id}`, data, null);
  },
};
