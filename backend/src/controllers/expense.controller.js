const expenseService = require('../services/expense.service');
const response = require('../utils/response');

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpenses();
    return response.success(res, 'Expenses listed successfully', expenses);
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    return response.success(res, 'Expense details fetched successfully', expense);
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    return response.success(res, 'Expense created successfully', expense, 201);
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);
    return response.success(res, 'Expense updated successfully', expense);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.deleteExpense(req.params.id);
    return response.success(res, 'Expense deleted successfully', expense);
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
