const response = require('../utils/response');

const getAllFuelLogs = async (req, res, next) => {
  try {
    return response.success(res, 'Fuel logs listed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getFuelLogById = async (req, res, next) => {
  try {
    return response.success(res, 'Fuel log details fetched', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const createFuelLog = async (req, res, next) => {
  try {
    return response.success(res, 'Fuel log created successfully', req.body, 201);
  } catch (error) {
    next(error);
  }
};

const updateFuelLog = async (req, res, next) => {
  try {
    return response.success(res, 'Fuel log updated successfully', { id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

const deleteFuelLog = async (req, res, next) => {
  try {
    return response.success(res, 'Fuel log deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog
};
