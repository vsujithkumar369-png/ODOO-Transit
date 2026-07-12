const response = require('../utils/response');

const getTripReport = async (req, res, next) => {
  try {
    return response.success(res, 'Trip report request processed successfully', []);
  } catch (error) {
    next(error);
  }
};

const getExpenseReport = async (req, res, next) => {
  try {
    return response.success(res, 'Expense report request processed successfully', []);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTripReport,
  getExpenseReport
};
