const express = require('express');
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const { expenseRules } = require('../validations/expense.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);

router.post('/', roleMiddleware('Admin', 'Manager', 'Operator', 'Driver'), expenseRules, validationMiddleware, expenseController.createExpense);
router.put('/:id', roleMiddleware('Admin', 'Manager', 'Operator'), expenseRules, validationMiddleware, expenseController.updateExpense);
router.delete('/:id', roleMiddleware('Admin'), expenseController.deleteExpense);

module.exports = router;
