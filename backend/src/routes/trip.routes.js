const express = require('express');
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.post('/', roleMiddleware('Admin', 'Manager', 'Operator'), tripController.createTrip);
router.put('/:id', roleMiddleware('Admin', 'Manager', 'Operator'), tripController.updateTrip);
router.delete('/:id', roleMiddleware('Admin'), tripController.deleteTrip);

module.exports = router;
