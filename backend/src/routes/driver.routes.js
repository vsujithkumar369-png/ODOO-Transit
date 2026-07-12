const express = require('express');
const driverController = require('../controllers/driver.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { driverRules } = require('../validations/driver.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', driverController.getAllDrivers);
router.get('/available', driverController.getAvailableDrivers);
router.get('/:id', driverController.getDriverById);

router.post('/', roleMiddleware('Admin', 'Manager'), driverRules, validationMiddleware, driverController.createDriver);
router.put('/:id', roleMiddleware('Admin', 'Manager'), driverRules, validationMiddleware, driverController.updateDriver);
router.delete('/:id', roleMiddleware('Admin'), driverController.deleteDriver);

module.exports = router;
