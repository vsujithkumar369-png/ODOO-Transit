const response = require('../utils/response');

const getAllVehicles = async (req, res, next) => {
  try {
    return response.success(res, 'Vehicles listed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    return response.success(res, 'Vehicle details fetched', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    return response.success(res, 'Vehicle created successfully', req.body, 201);
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    return response.success(res, 'Vehicle updated successfully', { id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    return response.success(res, 'Vehicle deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
