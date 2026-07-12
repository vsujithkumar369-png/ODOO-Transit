const fuelRepository = require('../repositories/fuel.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const driverRepository = require('../repositories/driver.repository');

const createFuelLog = async (logData) => {
  const vehicle = await vehicleRepository.findById(logData.vehicle_id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (logData.driver_id) {
    const driver = await driverRepository.findById(logData.driver_id);
    if (!driver) {
      const error = new Error('Driver not found');
      error.statusCode = 404;
      throw error;
    }
  }

  return fuelRepository.create(logData);
};

const getFuelLogs = async () => {
  return fuelRepository.findAll();
};

const getFuelLogById = async (id) => {
  const log = await fuelRepository.findById(id);
  if (!log) {
    const error = new Error('Fuel log not found');
    error.statusCode = 404;
    throw error;
  }
  return log;
};

const updateFuelLog = async (id, logData) => {
  await getFuelLogById(id);

  const vehicle = await vehicleRepository.findById(logData.vehicle_id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (logData.driver_id) {
    const driver = await driverRepository.findById(logData.driver_id);
    if (!driver) {
      const error = new Error('Driver not found');
      error.statusCode = 404;
      throw error;
    }
  }

  return fuelRepository.update(id, logData);
};

const deleteFuelLog = async (id) => {
  await getFuelLogById(id);
  return fuelRepository.remove(id);
};

module.exports = {
  createFuelLog,
  getFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog
};
