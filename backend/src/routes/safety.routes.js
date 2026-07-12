const express = require('express');
const safetyController = require('../controllers/safetyController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/incidents', roleMiddleware('SafetyOfficer', 'FleetManager'), safetyController.getIncidents);
router.post('/incidents', roleMiddleware('SafetyOfficer', 'FleetManager'), safetyController.createIncident);
router.get('/compliance', roleMiddleware('SafetyOfficer', 'FleetManager'), safetyController.getDriverCompliance);
router.get('/vehicle-safety', roleMiddleware('SafetyOfficer', 'FleetManager'), safetyController.getVehicleSafety);

module.exports = router;
