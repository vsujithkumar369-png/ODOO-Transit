const express = require('express');
const fuelController = require('../controllers/fuel.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { fuelRules } = require('../validations/fuel.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('FleetManager', 'Driver', 'FinancialAnalyst'), fuelController.getAllFuelLogs);
router.get('/:id', roleMiddleware('FleetManager', 'Driver', 'FinancialAnalyst'), fuelController.getFuelLogById);

router.post('/', roleMiddleware('FleetManager', 'Driver'), fuelRules, validationMiddleware, fuelController.createFuelLog);
router.put('/:id', roleMiddleware('FleetManager'), fuelRules, validationMiddleware, fuelController.updateFuelLog);
router.delete('/:id', roleMiddleware('FleetManager'), fuelController.deleteFuelLog);

module.exports = router;
