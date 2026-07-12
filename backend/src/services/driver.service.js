const driverRepository = require('../repositories/driver.repository');

const createDriver = async (driverData) => {
  const existing = await driverRepository.findByLicenseNumber(driverData.license_number);
  if (existing) {
    const error = new Error('Driver license number must be unique');
    error.statusCode = 400;
    throw error;
  }
  return driverRepository.create(driverData);
};

const getDrivers = async () => {
  return driverRepository.findAll();
};

const getDriverById = async (id) => {
  const driver = await driverRepository.findById(id);
  if (!driver) {
    const error = new Error('Driver not found');
    error.statusCode = 404;
    throw error;
  }
  return driver;
};

const updateDriver = async (id, driverData) => {
  await getDriverById(id); // Throws if not exists

  const existing = await driverRepository.findByLicenseNumber(driverData.license_number);
  if (existing && existing.id !== parseInt(id, 10)) {
    const error = new Error('Driver license number must be unique');
    error.statusCode = 400;
    throw error;
  }

  return driverRepository.update(id, driverData);
};

const deleteDriver = async (id) => {
  await getDriverById(id);
  return driverRepository.remove(id);
};

const getAvailableDrivers = async () => {
  return driverRepository.findAvailable();
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getAvailableDrivers
};
