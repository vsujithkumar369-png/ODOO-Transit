const expenseRepository = require('../repositories/expense.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const tripRepository = require('../repositories/trip.repository');

const createExpense = async (expenseData) => {
  if (expenseData.vehicle_id) {
    const vehicle = await vehicleRepository.findById(expenseData.vehicle_id);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
  }

  if (expenseData.trip_id) {
    const trip = await tripRepository.findById(expenseData.trip_id);
    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }
  }

  return expenseRepository.create(expenseData);
};

const getExpenses = async () => {
  return expenseRepository.findAll();
};

const getExpenseById = async (id) => {
  const expense = await expenseRepository.findById(id);
  if (!expense) {
    const error = new Error('Expense not found');
    error.statusCode = 404;
    throw error;
  }
  return expense;
};

const updateExpense = async (id, expenseData) => {
  await getExpenseById(id);

  if (expenseData.vehicle_id) {
    const vehicle = await vehicleRepository.findById(expenseData.vehicle_id);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
  }

  if (expenseData.trip_id) {
    const trip = await tripRepository.findById(expenseData.trip_id);
    if (!trip) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }
  }

  return expenseRepository.update(id, expenseData);
};

const deleteExpense = async (id) => {
  await getExpenseById(id);
  return expenseRepository.remove(id);
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
