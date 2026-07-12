const express = require('express');
const fuelController = require('../controllers/fuel.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', fuelController.getAllFuelLogs);
router.get('/:id', fuelController.getFuelLogById);
router.post('/', roleMiddleware('Admin', 'Manager', 'Operator', 'Driver'), fuelController.createFuelLog);
router.put('/:id', roleMiddleware('Admin', 'Manager', 'Operator'), fuelController.updateFuelLog);
router.delete('/:id', roleMiddleware('Admin'), fuelController.deleteFuelLog);

module.exports = router;
