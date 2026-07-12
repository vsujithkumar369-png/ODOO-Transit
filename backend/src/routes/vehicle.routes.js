const express = require('express');
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { vehicleRules } = require('../validations/vehicle.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('FleetManager', 'SafetyOfficer', 'FinancialAnalyst'), vehicleController.getAllVehicles);
router.get('/available', roleMiddleware('FleetManager', 'SafetyOfficer'), vehicleController.getAvailableVehicles);
router.get('/:id', roleMiddleware('FleetManager', 'SafetyOfficer', 'FinancialAnalyst'), vehicleController.getVehicleById);

router.post('/', roleMiddleware('FleetManager'), vehicleRules, validationMiddleware, vehicleController.createVehicle);
router.put('/:id', roleMiddleware('FleetManager'), vehicleRules, validationMiddleware, vehicleController.updateVehicle);
router.delete('/:id', roleMiddleware('FleetManager'), vehicleController.deleteVehicle);

module.exports = router;
