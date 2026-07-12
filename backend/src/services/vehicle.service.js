const vehicleRepository = require('../repositories/vehicle.repository');

const createVehicle = async (vehicleData) => {
  const existing = await vehicleRepository.findByPlateNumber(vehicleData.plate_number);
  if (existing) {
    const error = new Error('Vehicle plate number must be unique');
    error.statusCode = 400;
    throw error;
  }
  return vehicleRepository.create(vehicleData);
};

const getVehicles = async (filters = {}) => {
  return vehicleRepository.findAll(filters);
};

const getVehicleById = async (id) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
  return vehicle;
};

const updateVehicle = async (id, vehicleData) => {
  await getVehicleById(id); // Throws if not exists or retired

  const existing = await vehicleRepository.findByPlateNumber(vehicleData.plate_number);
  if (existing && existing.id !== parseInt(id, 10)) {
    const error = new Error('Vehicle plate number must be unique');
    error.statusCode = 400;
    throw error;
  }

  return vehicleRepository.update(id, vehicleData);
};

const deleteVehicle = async (id) => {
  await getVehicleById(id);
  return vehicleRepository.softDelete(id);
};

const getAvailableVehicles = async () => {
  return vehicleRepository.findAvailable();
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles
};
