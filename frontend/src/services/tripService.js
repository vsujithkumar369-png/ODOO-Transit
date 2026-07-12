import { request } from './api';

const fallbackTrips = [
  {
    id: 1,
    trip_number: "TRP-98745",
    vehicle_id: 1,
    driver_id: 2,
    cargo_weight: 15000.00,
    start_location: "Mumbai",
    end_location: "Delhi",
    status: "Draft",
    created_at: "2026-07-12T08:00:00.000Z"
  }
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
