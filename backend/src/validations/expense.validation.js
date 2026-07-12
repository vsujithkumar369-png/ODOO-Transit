const { body } = require('express-validator');

const expenseRules = [
  body('vehicle_id')
    .optional({ nullable: true })
    .isInt().withMessage('Vehicle ID must be an integer'),
  body('trip_id')
    .optional({ nullable: true })
    .isInt().withMessage('Trip ID must be an integer'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 100 }).withMessage('Category must not exceed 100 characters'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('expense_date')
    .optional()
    .isISO8601().withMessage('Expense date must be a valid date (YYYY-MM-DD)')
];

module.exports = {
  expenseRules
};
