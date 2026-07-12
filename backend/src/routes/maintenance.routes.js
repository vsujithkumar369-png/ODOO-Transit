const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', maintenanceController.getAllMaintenanceLogs);
router.get('/:id', maintenanceController.getMaintenanceLogById);
router.post('/', roleMiddleware('Admin', 'Manager'), maintenanceController.createMaintenanceLog);
router.put('/:id', roleMiddleware('Admin', 'Manager'), maintenanceController.updateMaintenanceLog);
router.delete('/:id', roleMiddleware('Admin'), maintenanceController.deleteMaintenanceLog);

module.exports = router;
