const controller = require('../controller/expenseController');

// Log available controller exports for debugging
try {
	const keys = Object.keys(controller || {});
	console.log('ExpenseController exports:', keys);
} catch (e) {
	console.error('Failed to inspect ExpenseController exports', e.message);
}

const router = require('express').Router();

// Helper: return a stub handler when a controller function is missing
const stub = (name) => (req, res) => {
	console.error(`Missing handler for ${name} in expenseController`);
	res.status(500).send({ status: 'error', statusCode: 500, message: `Handler ${name} not implemented` });
};

const createExpense = controller.createExpense || stub('createExpense');
const updateExpense = controller.updateExpense || stub('updateExpense');
const deleteExpense = controller.deleteExpense || stub('deleteExpense');
const getCategoryExpense = controller.getCategoryExpense || stub('getCategoryExpense');
const getAllExpenses = controller.getAllExpenses || stub('getAllExpenses');
const getFilteredExpenses = controller.getFilteredExpenses || stub('getFilteredExpenses');
const getExpenseStats = controller.getExpenseStats || stub('getExpenseStats');
const sendExpenseReport = controller.sendExpenseReport || stub('sendExpenseReport');
const sendSplitInvites = controller.sendSplitInvites || stub('sendSplitInvites');

router.post('/addExpense', createExpense);
router.post('/updateExpense', updateExpense);
router.post('/deleteExpense', deleteExpense);
router.post('/categoryExpense', getCategoryExpense);
router.post('/allExpenses', getAllExpenses);
router.post('/filteredExpenses', getFilteredExpenses);
router.post('/stats', getExpenseStats);
router.post('/sendEmail', sendExpenseReport);
router.post('/sendSplitInvites', sendSplitInvites);

module.exports = router;