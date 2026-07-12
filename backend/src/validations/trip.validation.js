const { body } = require('express-validator');

const tripRules = [
  body('trip_number')
    .trim()
    .notEmpty().withMessage('Trip number is required')
    .isLength({ max: 50 }).withMessage('Trip number must not exceed 50 characters'),
  body('vehicle_id')
    .notEmpty().withMessage('Vehicle ID is required')
    .isInt().withMessage('Vehicle ID must be an integer'),
  body('driver_id')
    .notEmpty().withMessage('Driver ID is required')
    .isInt().withMessage('Driver ID must be an integer'),
  body('cargo_weight')
    .notEmpty().withMessage('Cargo weight is required')
    .isFloat({ min: 0.01 }).withMessage('Cargo weight must be a positive number'),
  body('start_location')
    .trim()
    .notEmpty().withMessage('Start location is required'),
  body('end_location')
    .trim()
    .notEmpty().withMessage('End location is required')
];

module.exports = {
  tripRules
};
