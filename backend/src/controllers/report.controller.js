const reportService = require('../services/report.service');
const response = require('../utils/response');

const handleReportResponse = (res, format, filename, data) => {
  if (format === 'csv') {
    const csvContent = reportService.exportReportToCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
    return res.status(200).send(csvContent);
  }
  return response.success(res, 'Report generated successfully', data);
};

const getFuelEfficiencyReport = async (req, res, next) => {
  try {
    const data = await reportService.getFuelEfficiencyReport();
    return handleReportResponse(res, req.query.export, 'fuel_efficiency', data);
  } catch (error) {
    next(error);
  }
};

const getOperationalCostReport = async (req, res, next) => {
  try {
    const data = await reportService.getOperationalCostReport();
    return handleReportResponse(res, req.query.export, 'operational_costs', data);
  } catch (error) {
    next(error);
  }
};

const getFleetUtilizationReport = async (req, res, next) => {
  try {
    const data = await reportService.getFleetUtilizationReport();
    return handleReportResponse(res, req.query.export, 'fleet_utilization', data);
  } catch (error) {
    next(error);
  }
};

const getVehicleROIReport = async (req, res, next) => {
  try {
    const data = await reportService.getVehicleROIReport();
    return handleReportResponse(res, req.query.export, 'vehicle_roi', data);
  } catch (error) {
    next(error);
  }
};

const getBudgetReport = async (req, res, next) => {
  try {
    const data = await reportService.getBudgetReport();
    return handleReportResponse(res, req.query.export, 'budget_report', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getFleetUtilizationReport,
  getVehicleROIReport,
  getBudgetReport
};
