const { db } = require('../config/db');
const tripRepository = require('../repositories/trip.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const driverRepository = require('../repositories/driver.repository');

const createTripDraft = async (tripData) => {
  const vehicle = await vehicleRepository.findById(tripData.vehicle_id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 400;
    throw error;
  }

  const driver = await driverRepository.findById(tripData.driver_id);
  if (!driver) {
    const error = new Error('Driver not found');
    error.statusCode = 400;
    throw error;
  }

  if (parseFloat(tripData.cargo_weight) > parseFloat(vehicle.capacity)) {
    const error = new Error(`Cargo weight (${tripData.cargo_weight} kg) exceeds vehicle capacity (${vehicle.capacity} kg)`);
    error.statusCode = 400;
    throw error;
  }

  return tripRepository.create(tripData);
};

const getTrips = async () => {
  return tripRepository.findAll();
};

const getTripById = async (id) => {
  const trip = await tripRepository.findById(id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  return trip;
};

const updateTrip = async (id, tripData) => {
  const trip = await getTripById(id);
  if (trip.status !== 'Draft') {
    const error = new Error('Only Draft trips can be modified');
    error.statusCode = 400;
    throw error;
  }

  const vehicle = await vehicleRepository.findById(tripData.vehicle_id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 400;
    throw error;
  }

  if (parseFloat(tripData.cargo_weight) > parseFloat(vehicle.capacity)) {
    const error = new Error(`Cargo weight (${tripData.cargo_weight} kg) exceeds vehicle capacity (${vehicle.capacity} kg)`);
    error.statusCode = 400;
    throw error;
  }

  return tripRepository.update(id, tripData);
};

const deleteTrip = async (id) => {
  const trip = await getTripById(id);
  if (trip.status !== 'Draft' && trip.status !== 'Cancelled') {
    const error = new Error('Only Draft or Cancelled trips can be deleted');
    error.statusCode = 400;
    throw error;
  }
  return tripRepository.remove(id);
};

const dispatchTrip = async (id) => {
  const trip = await getTripById(id);

  if (trip.status !== 'Draft') {
    const error = new Error(`Cannot dispatch trip in ${trip.status} state`);
    error.statusCode = 400;
    throw error;
  }

  const vehicle = await vehicleRepository.findById(trip.vehicle_id);
  if (!vehicle || vehicle.status !== 'Available') {
    const error = new Error(`Assigned vehicle status is '${vehicle ? vehicle.status : 'Not Found'}'. Must be 'Available'`);
    error.statusCode = 400;
    throw error;
  }

  const driver = await driverRepository.findById(trip.driver_id);
  if (!driver || driver.status !== 'Available') {
    const error = new Error(`Assigned driver status is '${driver ? driver.status : 'Not Found'}'. Must be 'Available'`);
    error.statusCode = 400;
    throw error;
  }

  const isExpired = new Date(driver.license_expiry) <= new Date();
  if (isExpired) {
    const error = new Error('Assigned driver license has expired');
    error.statusCode = 400;
    throw error;
  }

  if (parseFloat(trip.cargo_weight) > parseFloat(vehicle.capacity)) {
    const error = new Error(`Cargo weight exceeds vehicle capacity`);
    error.statusCode = 400;
    throw error;
  }

  // SQLite transaction block
  try {
    db.prepare('BEGIN').run();

    const updatedTrip = await tripRepository.dispatch(id);
    await vehicleRepository.updateStatus(trip.vehicle_id, 'On Trip');
    await driverRepository.updateStatus(trip.driver_id, 'On Trip');

    db.prepare('COMMIT').run();
    return updatedTrip;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
};

const completeTrip = async (id) => {
  const trip = await getTripById(id);

  if (trip.status !== 'Dispatched') {
    const error = new Error(`Cannot complete trip in ${trip.status} state`);
    error.statusCode = 400;
    throw error;
  }

  try {
    db.prepare('BEGIN').run();

    const updatedTrip = await tripRepository.complete(id);
    await vehicleRepository.updateStatus(trip.vehicle_id, 'Available');
    await driverRepository.updateStatus(trip.driver_id, 'Available');

    db.prepare('COMMIT').run();
    return updatedTrip;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
};

const cancelTrip = async (id) => {
  const trip = await getTripById(id);

  if (trip.status !== 'Draft' && trip.status !== 'Dispatched') {
    const error = new Error(`Cannot cancel trip in ${trip.status} state`);
    error.statusCode = 400;
    throw error;
  }

  try {
    db.prepare('BEGIN').run();

    const updatedTrip = await tripRepository.cancel(id);

    if (trip.status === 'Dispatched') {
      await vehicleRepository.updateStatus(trip.vehicle_id, 'Available');
      await driverRepository.updateStatus(trip.driver_id, 'Available');
    }

    db.prepare('COMMIT').run();
    return updatedTrip;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
};

module.exports = {
  createTripDraft,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
};
