const dashboardService = require('../services/dashboard.service');
const response = require('../utils/response');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getKPIs();
    return response.success(res, 'Dashboard statistics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
