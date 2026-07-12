const { body } = require('express-validator');

const fuelRules = [
  body('vehicle_id')
    .notEmpty().withMessage('Vehicle ID is required')
    .isInt().withMessage('Vehicle ID must be an integer'),
  body('driver_id')
    .optional({ nullable: true })
    .isInt().withMessage('Driver ID must be an integer'),
  body('fuel_quantity')
    .notEmpty().withMessage('Fuel quantity is required')
    .isFloat({ min: 0.01 }).withMessage('Fuel quantity must be a positive number'),
  body('cost')
    .notEmpty().withMessage('Cost is required')
    .isFloat({ min: 0.01 }).withMessage('Cost must be a positive number'),
  body('odometer_reading')
    .notEmpty().withMessage('Odometer reading is required')
    .isFloat({ min: 0.0 }).withMessage('Odometer reading must be a positive number'),
  body('log_date')
    .optional()
    .isISO8601().withMessage('Log date must be a valid date (YYYY-MM-DD)')
];

module.exports = {
  fuelRules
};
