const maintenanceService = require('../services/maintenance.service');
const response = require('../utils/response');

const getAllMaintenanceLogs = async (req, res, next) => {
  try {
    const logs = await maintenanceService.getMainMaintenanceLogs();
    return response.success(res, 'Maintenance logs listed successfully', logs);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceLogById = async (req, res, next) => {
  try {
    const log = await maintenanceService.getMaintenanceLogById(req.params.id);
    return response.success(res, 'Maintenance log details fetched successfully', log);
  } catch (error) {
    next(error);
  }
};

const createMaintenanceLog = async (req, res, next) => {
  try {
    const log = await maintenanceService.createMaintenanceLog(req.body);
    return response.success(res, 'Maintenance log created successfully', log, 201);
  } catch (error) {
    next(error);
  }
};

const updateMaintenanceLog = async (req, res, next) => {
  try {
    const cost = req.body.cost;
    const log = await maintenanceService.closeMaintenanceLog(req.params.id, cost);
    return response.success(res, 'Maintenance log updated/closed successfully', log);
  } catch (error) {
    next(error);
  }
};

const deleteMaintenanceLog = async (req, res, next) => {
  try {
    const log = await maintenanceService.deleteMaintenanceLog(req.params.id);
    return response.success(res, 'Maintenance log deleted successfully', log);
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
