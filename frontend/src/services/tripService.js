import { request } from './api';

const fallbackTrips = [
  {
    id: 1, trip_number: 'TRP-1001', vehicle_id: 1, driver_id: 2,
    cargo_weight: 8500.00, start_location: 'Chennai', end_location: 'Bangalore', status: 'On Trip', created_at: '2026-07-12'
  },
  {
    id: 2, trip_number: 'TRP-1002', vehicle_id: 2, driver_id: 3,
    cargo_weight: 6200.00, start_location: 'Mumbai', end_location: 'Pune', status: 'Completed', created_at: '2026-07-11'
  },
  {
    id: 3, trip_number: 'TRP-1003', vehicle_id: 3, driver_id: 1,
    cargo_weight: 11000.00, start_location: 'Delhi', end_location: 'Jaipur', status: 'Draft', created_at: '2026-07-12'
  },
  {
    id: 4, trip_number: 'TRP-1004', vehicle_id: 4, driver_id: 4,
    cargo_weight: 4800.00, start_location: 'Hyderabad', end_location: 'Vizag', status: 'Pending', created_at: '2026-07-12'
  },
];

export const tripService = {
  async list() {
    return request('GET', '/trips', null, fallbackTrips);
  },

  async createDraft(tripData) {
    const fallback = {
      id: Math.floor(Math.random() * 1000) + 100,
      ...tripData,
      status: "Draft",
      created_at: new Date().toISOString()
    };
    return request('POST', '/trips', tripData, fallback);
  },

  async dispatch(id) {
    const fallback = {
      success: true,
      message: "Trip dispatched successfully",
      data: { id, status: "On Trip" }
    };
    return request('POST', `/trips/${id}/dispatch`, null, fallback.data);
  },

  async complete(id) {
    const fallback = {
      success: true,
      message: "Trip completed successfully",
      data: { id, status: "Completed" }
    };
    return request('POST', `/trips/${id}/complete`, null, fallback.data);
  },

  async cancel(id) {
    const fallback = {
      success: true,
      message: "Trip cancelled successfully",
      data: { id, status: "Cancelled" }
    };
    return request('POST', `/trips/${id}/cancel`, null, fallback.data);
  }
};
