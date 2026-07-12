const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { registerRules, loginRules } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', registerRules, validationMiddleware, authController.register);
router.post('/login', loginRules, validationMiddleware, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
