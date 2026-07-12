const express = require('express');
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', roleMiddleware('Admin', 'Manager', 'Operator', 'Driver'), expenseController.createExpense);
router.put('/:id', roleMiddleware('Admin', 'Manager', 'Operator'), expenseController.updateExpense);
router.delete('/:id', roleMiddleware('Admin'), expenseController.deleteExpense);

module.exports = router;
