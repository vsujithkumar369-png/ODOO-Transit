const vehicleService = require('../services/vehicle.service');
const response = require('../utils/response');

const getAllVehicles = async (req, res, next) => {
  try {
    const { status, type, region } = req.query;
    const vehicles = await vehicleService.getVehicles({ status, type, region });
    return response.success(res, 'Vehicles listed successfully', vehicles);
  } catch (error) {
    next(error);
  }
};

const getAvailableVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();
    return response.success(res, 'Available vehicles listed successfully', vehicles);
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    return response.success(res, 'Vehicle details fetched successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    return response.success(res, 'Vehicle created successfully', vehicle, 201);
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    return response.success(res, 'Vehicle updated successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.deleteVehicle(req.params.id);
    return response.success(res, 'Vehicle deleted successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getAvailableVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
