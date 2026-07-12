const express = require('express');
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { tripRules } = require('../validations/trip.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);

router.post('/', roleMiddleware('Admin', 'Manager', 'Operator'), tripRules, validationMiddleware, tripController.createTrip);
router.put('/:id', roleMiddleware('Admin', 'Manager', 'Operator'), tripRules, validationMiddleware, tripController.updateTrip);
router.delete('/:id', roleMiddleware('Admin'), tripController.deleteTrip);

// Trip lifecycle routes
router.put('/:id/dispatch', roleMiddleware('Admin', 'Manager', 'Operator'), tripController.dispatchTrip);
router.put('/:id/complete', roleMiddleware('Admin', 'Manager', 'Operator'), tripController.completeTrip);
router.put('/:id/cancel', roleMiddleware('Admin', 'Manager', 'Operator'), tripController.cancelTrip);

module.exports = router;
