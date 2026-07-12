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

router.post('/', roleMiddleware('FleetManager', 'SafetyOfficer'), tripRules, validationMiddleware, tripController.createTrip);
router.put('/:id', roleMiddleware('FleetManager', 'SafetyOfficer'), tripRules, validationMiddleware, tripController.updateTrip);
router.delete('/:id', roleMiddleware('FleetManager'), tripController.deleteTrip);

// Trip lifecycle routes - updated to POST as requested
router.post('/:id/dispatch', roleMiddleware('FleetManager', 'SafetyOfficer'), tripController.dispatchTrip);
router.post('/:id/complete', roleMiddleware('FleetManager', 'SafetyOfficer'), tripController.completeTrip);
router.post('/:id/cancel', roleMiddleware('FleetManager', 'SafetyOfficer'), tripController.cancelTrip);

module.exports = router;
