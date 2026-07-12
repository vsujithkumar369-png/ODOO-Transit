const reportRepository = require('../repositories/report.repository');

const getKPIs = async () => {
  return reportRepository.getDashboardKPIs();
};

module.exports = {
  getKPIs
};
