const db = require('../config/db');
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

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const newLog = await maintenanceRepository.create(logData, client);
    await vehicleRepository.updateStatus(logData.vehicle_id, 'In Shop', client);

    await client.query('COMMIT');
    return newLog;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
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

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const updatedLog = await maintenanceRepository.close(id, cost, client);
    await vehicleRepository.updateStatus(log.vehicle_id, 'Available', client);

    await client.query('COMMIT');
    return updatedLog;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteMaintenanceLog = async (id) => {
  const log = await getMaintenanceLogById(id);
  
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    await maintenanceRepository.remove(id, client);
    // If the maintenance log was open, restore vehicle status
    if (log.status === 'Open') {
      await vehicleRepository.updateStatus(log.vehicle_id, 'Available', client);
    }

    await client.query('COMMIT');
    return log;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createMaintenanceLog,
  getMaintenanceLogs,
  getMaintenanceLogById,
  closeMaintenanceLog,
  deleteMaintenanceLog
};
