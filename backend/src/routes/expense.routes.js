const express = require('express');
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { expenseRules } = require('../validations/expense.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('FleetManager', 'FinancialAnalyst'), expenseController.getAllExpenses);
router.get('/:id', roleMiddleware('FleetManager', 'FinancialAnalyst'), expenseController.getExpenseById);

router.post('/', roleMiddleware('FleetManager', 'FinancialAnalyst'), expenseRules, validationMiddleware, expenseController.createExpense);
router.put('/:id', roleMiddleware('FleetManager', 'FinancialAnalyst'), expenseRules, validationMiddleware, expenseController.updateExpense);
router.delete('/:id', roleMiddleware('FleetManager'), expenseController.deleteExpense);

module.exports = router;
