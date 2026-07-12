const response = require('../utils/response');

const getAllDrivers = async (req, res, next) => {
  try {
    return response.success(res, 'Drivers listed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    return response.success(res, 'Driver details fetched', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const createDriver = async (req, res, next) => {
  try {
    return response.success(res, 'Driver created successfully', req.body, 201);
  } catch (error) {
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    return response.success(res, 'Driver updated successfully', { id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    return response.success(res, 'Driver deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};
