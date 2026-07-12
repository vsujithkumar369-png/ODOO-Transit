const fuelService = require('../services/fuel.service');
const response = require('../utils/response');

const getAllFuelLogs = async (req, res, next) => {
  try {
    const logs = await fuelService.getFuelLogs();
    return response.success(res, 'Fuel logs listed successfully', logs);
  } catch (error) {
    next(error);
  }
};

const getFuelLogById = async (req, res, next) => {
  try {
    const log = await fuelService.getFuelLogById(req.params.id);
    return response.success(res, 'Fuel log details fetched successfully', log);
  } catch (error) {
    next(error);
  }
};

const createFuelLog = async (req, res, next) => {
  try {
    const log = await fuelService.createFuelLog(req.body);
    return response.success(res, 'Fuel log created successfully', log, 201);
  } catch (error) {
    next(error);
  }
};

const updateFuelLog = async (req, res, next) => {
  try {
    const log = await fuelService.updateFuelLog(req.params.id, req.body);
    return response.success(res, 'Fuel log updated successfully', log);
  } catch (error) {
    next(error);
  }
};

const deleteFuelLog = async (req, res, next) => {
  try {
    const log = await fuelService.deleteFuelLog(req.params.id);
    return response.success(res, 'Fuel log deleted successfully', log);
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
