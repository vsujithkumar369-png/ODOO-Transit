const { body } = require('express-validator');

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .toLowerCase(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 30 }).withMessage('Password must be between 8 and 30 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('Password must contain at least one special character'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst']).withMessage('Role must be one of: FleetManager, Driver, SafetyOfficer, FinancialAnalyst')
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .toLowerCase(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

module.exports = {
  registerRules,
  loginRules
};
