const { body } = require('express-validator');

const vehicleRules = [
  body('plate_number')
    .trim()
    .notEmpty().withMessage('Plate number is required')
    .isLength({ max: 20 }).withMessage('Plate number must not exceed 20 characters'),
  body('model')
    .trim()
    .notEmpty().withMessage('Model is required')
    .isLength({ max: 100 }).withMessage('Model must not exceed 100 characters'),
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required'),
  body('capacity')
    .notEmpty().withMessage('Capacity is required')
    .isFloat({ min: 0.01 }).withMessage('Capacity must be a positive number'),
  body('status')
    .optional()
    .isIn(['Available', 'On Trip', 'In Shop', 'Retired']).withMessage('Invalid status value')
];

module.exports = {
  vehicleRules
};
