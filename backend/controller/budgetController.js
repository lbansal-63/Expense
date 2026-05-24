const { error, success } = require('../utils/handler');
let budgetModel, expenseModel;
try { budgetModel = require('../db/budgetModel'); } catch (e) { budgetModel = null; }
try { expenseModel = require('../db/expenseModel'); } catch (e) { expenseModel = null; }

const mockBudgets = [];


const createBudget = async (req, res) => {
    try {
        const { userId, category, limitAmount, period, currency, alertThreshold } = req.body;

        if (!userId || !category || !limitAmount) {
            return res.send(error(401, "User ID, Category, and Limit Amount are required"));
        }

        // Check if budget already exists for this category
        if (useMock) {
            const existing = mockBudgets.find(b => b.userId === userId && b.category === category);
            if (existing) return res.send(error(401, 'Budget already exists for this category'));
            const newBudget = { _id: Date.now().toString(36), userId, category, limitAmount: Number(limitAmount), period: period || 'monthly', currency: currency || 'INR', alertThreshold: alertThreshold || 80, isActive: true };
            mockBudgets.push(newBudget);
            return res.send(success(200, newBudget));
        }

        const existingBudget = await budgetModel.findOne({ userId, category });
        if (existingBudget) {
            return res.send(error(401, "Budget already exists for this category"));
        }

        const newBudget = await budgetModel.create({
            userId,
            category,
            limitAmount,
            period: period || 'monthly',
            currency: currency || 'INR',
            alertThreshold: alertThreshold || 80
        });

        return res.send(success(200, newBudget));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

const updateBudget = async (req, res) => {
    try {
        const { budgetId, ...updateData } = req.body;

        if (useMock) {
            const idx = mockBudgets.findIndex(b => b._id === budgetId);
            if (idx === -1) return res.send(error(401, 'Budget not found'));
            mockBudgets[idx] = { ...mockBudgets[idx], ...updateData };
            return res.send(success(200, mockBudgets[idx]));
        }

        const updatedBudget = await budgetModel.findByIdAndUpdate(
            budgetId,
            updateData,
            { new: true }
        );

        return res.send(success(200, updatedBudget));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

const deleteBudget = async (req, res) => {
    try {
        const { budgetId } = req.body;

        if (useMock) {
            const idx = mockBudgets.findIndex(b => b._id === budgetId);
            if (idx === -1) return res.send(error(401, 'Budget not found'));
            mockBudgets.splice(idx,1);
            return res.send(success(200, { response: 'Budget deleted successfully' }));
        }

        await budgetModel.findByIdAndDelete(budgetId);
        return res.send(success(200, { response: 'Budget deleted successfully' }));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

const getBudgets = async (req, res) => {
    try {
        const { userId } = req.body;

        if (useMock) {
            const budgets = mockBudgets.filter(b => b.userId === userId && b.isActive !== false);
            return res.send(success(200, budgets));
        }

        const budgets = await budgetModel.find({ userId, isActive: true });
        return res.send(success(200, budgets));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

const checkBudgetStatus = async (req, res) => {
    try {
        const { userId } = req.body;

        const budgetStatus = [];
        let budgets = [];
        if (useMock) {
            budgets = mockBudgets.filter(b => b.userId === userId && b.isActive !== false);
        } else {
            budgets = await budgetModel.find({ userId, isActive: true });
        }

        for (let budget of budgets) {
            let expenses = [];
            if (useMock) {
                // in mock mode, expenses come from expenseModel mock in expenseController; we can't access it here, so assume 0
                expenses = [];
            } else {
                expenses = await expenseModel.find({ usersid: userId, category: budget.category });
            }

            const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
            const percentageUsed = (totalSpent / Number(budget.limitAmount || 1)) * 100;
            const isAlertTriggered = percentageUsed >= (budget.alertThreshold || 80);

            budgetStatus.push({
                budget,
                totalSpent,
                percentageUsed: Number(percentageUsed).toFixed(2),
                remainingBudget: Number((Number(budget.limitAmount || 0) - totalSpent)).toFixed(2),
                isAlertTriggered,
                isExceeded: totalSpent > Number(budget.limitAmount || 0)
            });
        }

        return res.send(success(200, budgetStatus));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

module.exports = {
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgets,
    checkBudgetStatus
};
