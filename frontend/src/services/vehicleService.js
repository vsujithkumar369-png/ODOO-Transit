import { request } from './api';

const fallbackVehicles = [
  {
    id: 1,
    plate_number: "MH12AB1234",
    model: "Tata Prima 2830",
    type: "Container Truck",
    capacity: 28000.00,
    region: "North",
    status: "Available",
    created_at: "2026-07-12T08:00:00.000Z"
  },
  {
    id: 2,
    plate_number: "DL01XY7890",
    model: "Mercedes Sprinter",
    type: "Van",
    capacity: 2000.00,
    region: "West",
    status: "On Trip",
    created_at: "2026-07-12T08:00:00.000Z"
  },
  {
    id: 3,
    plate_number: "KA03ZZ5555",
    model: "Volvo VNL 860",
    type: "Semi-Truck",
    capacity: 18000.00,
    region: "South",
    status: "In Shop",
    created_at: "2026-07-12T08:00:00.000Z"
  }
];

export const vehicleService = {
  async list(filters = '') {
    return request('GET', `/vehicles${filters}`, null, fallbackVehicles);
  },

  async create(vehicleData) {
    const fallback = {
      id: Math.floor(Math.random() * 1000) + 100,
      ...vehicleData,
      status: "Available",
      created_at: new Date().toISOString()
    };
    return request('POST', '/vehicles', vehicleData, fallback);
  },

  async delete(id) {
    const fallback = { id };
    return request('DELETE', `/vehicles/${id}`, null, fallback);
  }
};
