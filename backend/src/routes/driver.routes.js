const express = require('express');
const driverController = require('../controllers/driver.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { driverRules } = require('../validations/driver.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('FleetManager', 'SafetyOfficer'), driverController.getAllDrivers);
router.get('/available', roleMiddleware('FleetManager', 'SafetyOfficer'), driverController.getAvailableDrivers);
router.get('/:id', roleMiddleware('FleetManager', 'SafetyOfficer'), driverController.getDriverById);

router.post('/', roleMiddleware('FleetManager', 'SafetyOfficer'), driverRules, validationMiddleware, driverController.createDriver);
router.put('/:id', roleMiddleware('FleetManager', 'SafetyOfficer'), driverRules, validationMiddleware, driverController.updateDriver);
router.delete('/:id', roleMiddleware('FleetManager'), driverController.deleteDriver);

module.exports = router;
