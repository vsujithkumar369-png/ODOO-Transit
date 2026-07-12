const tripService = require('../services/trip.service');
const response = require('../utils/response');

const getAllTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTrips();
    return response.success(res, 'Trips listed successfully', trips);
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    return response.success(res, 'Trip details fetched successfully', trip);
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTripDraft(req.body);
    return response.success(res, 'Trip draft created successfully', trip, 201);
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body);
    return response.success(res, 'Trip updated successfully', trip);
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await tripService.deleteTrip(req.params.id);
    return response.success(res, 'Trip deleted successfully', trip);
  } catch (error) {
    next(error);
  }
};

const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    return response.success(res, 'Trip dispatched successfully', trip);
  } catch (error) {
    next(error);
  }
};

const completeTrip = async (req, res, next) => {
  try {
    const trip = await tripService.completeTrip(req.params.id);
    return response.success(res, 'Trip completed successfully', trip);
  } catch (error) {
    next(error);
  }
};

const cancelTrip = async (req, res, next) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    return response.success(res, 'Trip cancelled successfully', trip);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
};
