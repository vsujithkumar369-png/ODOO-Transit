const express = require('express');
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { vehicleRules } = require('../validations/vehicle.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', vehicleController.getAllVehicles);
router.get('/available', vehicleController.getAvailableVehicles);
router.get('/:id', vehicleController.getVehicleById);

router.post('/', roleMiddleware('Admin', 'Manager'), vehicleRules, validationMiddleware, vehicleController.createVehicle);
router.put('/:id', roleMiddleware('Admin', 'Manager'), vehicleRules, validationMiddleware, vehicleController.updateVehicle);
router.delete('/:id', roleMiddleware('Admin'), vehicleController.deleteVehicle);

module.exports = router;
