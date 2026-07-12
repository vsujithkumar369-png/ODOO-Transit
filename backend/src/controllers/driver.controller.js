const driverService = require('../services/driver.service');
const response = require('../utils/response');

const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getDrivers();
    return response.success(res, 'Drivers listed successfully', drivers);
  } catch (error) {
    next(error);
  }
};

const getAvailableDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAvailableDrivers();
    return response.success(res, 'Available drivers listed successfully', drivers);
  } catch (error) {
    next(error);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    return response.success(res, 'Driver details fetched successfully', driver);
  } catch (error) {
    next(error);
  }
};

const createDriver = async (req, res, next) => {
  try {
    const driver = await driverService.createDriver(req.body);
    return response.success(res, 'Driver created successfully', driver, 201);
  } catch (error) {
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    return response.success(res, 'Driver updated successfully', driver);
  } catch (error) {
    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const driver = await driverService.deleteDriver(req.params.id);
    return response.success(res, 'Driver deleted successfully', driver);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getAvailableDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};
