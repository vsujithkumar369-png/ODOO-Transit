const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/kpis', roleMiddleware('FleetManager', 'SafetyOfficer', 'FinancialAnalyst'), dashboardController.getDashboardStats);

module.exports = router;
