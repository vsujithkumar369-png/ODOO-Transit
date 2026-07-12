const response = require('../utils/response');

const getAllMaintenanceLogs = async (req, res, next) => {
  try {
    return response.success(res, 'Maintenance logs listed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceLogById = async (req, res, next) => {
  try {
    return response.success(res, 'Maintenance log details fetched', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const createMaintenanceLog = async (req, res, next) => {
  try {
    return response.success(res, 'Maintenance log created successfully', req.body, 201);
  } catch (error) {
    next(error);
  }
};

const updateMaintenanceLog = async (req, res, next) => {
  try {
    return response.success(res, 'Maintenance log updated successfully', { id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

const deleteMaintenanceLog = async (req, res, next) => {
  try {
    return response.success(res, 'Maintenance log deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
};
