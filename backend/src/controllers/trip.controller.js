const response = require('../utils/response');

const getAllTrips = async (req, res, next) => {
  try {
    return response.success(res, 'Trips listed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    return response.success(res, 'Trip details fetched', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    return response.success(res, 'Trip created successfully', req.body, 201);
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    return response.success(res, 'Trip updated successfully', { id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    return response.success(res, 'Trip deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
};
