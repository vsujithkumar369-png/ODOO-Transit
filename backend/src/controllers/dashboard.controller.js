const response = require('../utils/response');

const getDashboardStats = async (req, res, next) => {
  try {
    // Empty stats object to avoid hardcoding any mock stats data
    const stats = {};
    return response.success(res, 'Dashboard statistics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
