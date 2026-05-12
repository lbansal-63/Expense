const { createBudget, updateBudget, deleteBudget, getBudgets, checkBudgetStatus } = require('../controller/budgetController');

const router = require('express').Router();

router.post('/create', createBudget);
router.post('/update', updateBudget);
router.post('/delete', deleteBudget);
router.post('/get', getBudgets);
router.post('/status', checkBudgetStatus);

module.exports = router;
