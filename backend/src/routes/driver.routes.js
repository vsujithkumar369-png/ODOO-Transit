const express = require('express');
const driverController = require('../controllers/driver.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', roleMiddleware('Admin', 'Manager'), driverController.createDriver);
router.put('/:id', roleMiddleware('Admin', 'Manager'), driverController.updateDriver);
router.delete('/:id', roleMiddleware('Admin'), driverController.deleteDriver);

module.exports = router;
