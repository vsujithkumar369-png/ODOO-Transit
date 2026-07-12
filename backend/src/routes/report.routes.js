const express = require('express');
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/trips', roleMiddleware('Admin', 'Manager'), reportController.getTripReport);
router.get('/expenses', roleMiddleware('Admin', 'Manager'), reportController.getExpenseReport);

module.exports = router;
