const { body } = require('express-validator');

const driverRules = [
  body('user_id')
    .optional({ nullable: true })
    .isInt().withMessage('User ID must be an integer'),
  body('license_number')
    .trim()
    .notEmpty().withMessage('License number is required')
    .isLength({ max: 50 }).withMessage('License number must not exceed 50 characters'),
  body('license_expiry')
    .notEmpty().withMessage('License expiry date is required')
    .isISO8601().withMessage('License expiry must be a valid date (YYYY-MM-DD)'),
  body('safety_score')
    .optional()
    .isFloat({ min: 0.0, max: 100.0 }).withMessage('Safety score must be between 0.0 and 100.0'),
  body('status')
    .optional()
    .isIn(['Available', 'On Trip', 'Suspended']).withMessage('Invalid status value')
];

module.exports = {
  driverRules
};
