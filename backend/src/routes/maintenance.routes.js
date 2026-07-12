const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { maintenanceRules } = require('../validations/maintenance.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('FleetManager', 'SafetyOfficer', 'FinancialAnalyst'), maintenanceController.getAllMaintenanceLogs);
router.get('/:id', roleMiddleware('FleetManager', 'SafetyOfficer', 'FinancialAnalyst'), maintenanceController.getMaintenanceLogById);

router.post('/', roleMiddleware('FleetManager', 'SafetyOfficer'), maintenanceRules, validationMiddleware, maintenanceController.createMaintenanceLog);
router.put('/:id/close', roleMiddleware('FleetManager', 'SafetyOfficer'), maintenanceController.updateMaintenanceLog);
router.delete('/:id', roleMiddleware('FleetManager'), maintenanceController.deleteMaintenanceLog);

module.exports = router;
