const reportRepository = require('../repositories/report.repository');

const getFuelEfficiencyReport = async () => {
  return reportRepository.getFuelEfficiency();
};

const getOperationalCostReport = async () => {
  return reportRepository.getOperationalCost();
};

const getFleetUtilizationReport = async () => {
  return reportRepository.getFleetUtilization();
};

const getVehicleROIReport = async () => {
  return reportRepository.getVehicleROI();
};

const exportReportToCSV = (data) => {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');

  const rows = data.map(row => {
    return headers.map(header => {
      const val = row[header];
      const stringVal = val === null || val === undefined ? '' : String(val);
      return `"${stringVal.replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
};

const getBudgetReport = async () => {
  return reportRepository.getBudgetReport();
};

module.exports = {
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getFleetUtilizationReport,
  getVehicleROIReport,
  getBudgetReport,
  exportReportToCSV
};
