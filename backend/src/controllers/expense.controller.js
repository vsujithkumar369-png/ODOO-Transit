const response = require('../utils/response');

const getAllExpenses = async (req, res, next) => {
  try {
    return response.success(res, 'Expenses listed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    return response.success(res, 'Expense details fetched', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    return response.success(res, 'Expense created successfully', req.body, 201);
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    return response.success(res, 'Expense updated successfully', { id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    return response.success(res, 'Expense deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
