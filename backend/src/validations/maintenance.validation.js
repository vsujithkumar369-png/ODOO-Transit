const { body } = require('express-validator');

const maintenanceRules = [
  body('vehicle_id')
    .notEmpty().withMessage('Vehicle ID is required')
    .isInt().withMessage('Vehicle ID must be an integer'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('cost')
    .optional()
    .isFloat({ min: 0.0 }).withMessage('Cost must be a positive number')
];

module.exports = {
  maintenanceRules
};
