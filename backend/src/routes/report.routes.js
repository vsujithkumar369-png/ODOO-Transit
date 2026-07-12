const express = require('express');
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('Admin', 'Manager'));

router.get('/fuel-efficiency', reportController.getFuelEfficiencyReport);
router.get('/operational-costs', reportController.getOperationalCostReport);
router.get('/fleet-utilization', reportController.getFleetUtilizationReport);
router.get('/vehicle-roi', reportController.getVehicleROIReport);

module.exports = router;
