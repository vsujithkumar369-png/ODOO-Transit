const { db } = require('../config/db');
const maintenanceRepository = require('../repositories/maintenance.repository');
const vehicleRepository = require('../repositories/vehicle.repository');

const createMaintenanceLog = async (logData) => {
  const vehicle = await vehicleRepository.findById(logData.vehicle_id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (vehicle.status !== 'Available') {
    const error = new Error(`Vehicle status is '${vehicle.status}'. Must be 'Available' to open maintenance`);
    error.statusCode = 400;
    throw error;
  }

  try {
    db.prepare('BEGIN').run();

    const newLog = await maintenanceRepository.create(logData);
    await vehicleRepository.updateStatus(logData.vehicle_id, 'In Shop');

    db.prepare('COMMIT').run();
    return newLog;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
};

const getMaintenanceLogs = async () => {
  return maintenanceRepository.findAll();
};

const getMaintenanceLogById = async (id) => {
  const log = await maintenanceRepository.findById(id);
  if (!log) {
    const error = new Error('Maintenance log not found');
    error.statusCode = 404;
    throw error;
  }
  return log;
};

const closeMaintenanceLog = async (id, cost) => {
  const log = await getMaintenanceLogById(id);

  if (log.status !== 'Open') {
    const error = new Error('Maintenance log is already closed');
    error.statusCode = 400;
    throw error;
  }

  try {
    db.prepare('BEGIN').run();

    const updatedLog = await maintenanceRepository.close(id, cost);
    await vehicleRepository.updateStatus(log.vehicle_id, 'Available');

    db.prepare('COMMIT').run();
    return updatedLog;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
};

const deleteMaintenanceLog = async (id) => {
  const log = await getMaintenanceLogById(id);
  
  try {
    db.prepare('BEGIN').run();

    await maintenanceRepository.remove(id);
    if (log.status === 'Open') {
      await vehicleRepository.updateStatus(log.vehicle_id, 'Available');
    }

    db.prepare('COMMIT').run();
    return log;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
};

module.exports = {
  createMaintenanceLog,
  getMaintenanceLogs,
  getMaintenanceLogById,
  closeMaintenanceLog,
  deleteMaintenanceLog
};
