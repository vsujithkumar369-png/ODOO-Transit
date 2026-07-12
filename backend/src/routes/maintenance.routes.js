const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { maintenanceRules } = require('../validations/maintenance.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', maintenanceController.getAllMaintenanceLogs);
router.get('/:id', maintenanceController.getMaintenanceLogById);

router.post('/', roleMiddleware('Admin', 'Manager'), maintenanceRules, validationMiddleware, maintenanceController.createMaintenanceLog);
router.put('/:id/close', roleMiddleware('Admin', 'Manager'), maintenanceController.updateMaintenanceLog);
router.delete('/:id', roleMiddleware('Admin'), maintenanceController.deleteMaintenanceLog);

module.exports = router;
