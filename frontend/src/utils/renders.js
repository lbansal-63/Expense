import { axiosClient } from "./axiosClient";
import { toast } from 'react-hot-toast';

// ============ EXPENSE UTILITIES ============
export const getUserExpenses = async (userId) => {
    try {
        const response = await axiosClient.post('/expenses/allExpenses', { userId });
        const msg = response?.data?.message;
        const list = Array.isArray(msg) ? msg : [];
        const exp = list.sort((a, b) => new Date(b.date) - new Date(a.date));
        return exp;
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to fetch expenses');
    }
};

export const createExpense = async (expInfo) => {
    try {
        const response = await axiosClient.post('/expenses/addExpense', expInfo);
        if (response.data.statusCode !== 200) {
            toast.error(`${response.data.message}`);
            return;
        }
        toast.success('Expense created successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to create expense');
    }
};

export const updateExpense = async (expenseId, userId, updateData) => {
    try {
        const response = await axiosClient.post('/expenses/updateExpense', {
            expenseId,
            userId,
            ...updateData
        });
        if (response.data.statusCode !== 200) {
            toast.error(`${response.data.message}`);
            return;
        }
        toast.success('Expense updated successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to update expense');
    }
};

export const deleteExpense = async (data) => {
    try {
        const { expenseId, userId } = data;
        const response = await axiosClient.post('/expenses/deleteExpense', {
            expenseId,
            userId
        });
        if (response.data.statusCode !== 201) {
            toast.error(`${response.data.message}`);
            return;
        }
        toast.success('Expense deleted successfully');
        window.location.reload();
        return;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to delete expense');
    }
};

export const getFilteredExpenses = async (filters) => {
    try {
        const response = await axiosClient.post('/expenses/filteredExpenses', filters);
        return response.data.message;
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to fetch filtered expenses');
    }
};

export const getExpenseStats = async (userId, days = 30) => {
    try {
        const response = await axiosClient.post('/expenses/stats', { userId, days });
        return response.data.message;
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to fetch statistics');
    }
};

// ============ BUDGET UTILITIES ============
export const createBudget = async (budgetData) => {
    try {
        const response = await axiosClient.post('/budgets/create', budgetData);
        if (response.data.statusCode !== 200) {
            toast.error(`${response.data.message}`);
            return;
        }
        toast.success('Budget created successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to create budget');
    }
};

export const getBudgets = async (userId) => {
    try {
        const response = await axiosClient.post('/budgets/get', { userId });
        const msg = response?.data;
        if (msg && msg.status === 'success' && Array.isArray(msg.message)) return msg.message;
        return [];
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to fetch budgets');
    }
};

export const updateBudget = async (budgetId, updateData) => {
    try {
        const response = await axiosClient.post('/budgets/update', {
            budgetId,
            ...updateData
        });
        toast.success('Budget updated successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to update budget');
    }
};

export const deleteBudget = async (budgetId) => {
    try {
        const response = await axiosClient.post('/budgets/delete', { budgetId });
        toast.success('Budget deleted successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to delete budget');
    }
};

export const checkBudgetStatus = async (userId) => {
    try {
        const response = await axiosClient.post('/budgets/status', { userId });
        const msg = response?.data;
        if (msg && msg.status === 'success' && Array.isArray(msg.message)) return msg.message;
        return [];
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to check budget status');
    }
};

// ============ TAG UTILITIES ============
export const createTag = async (tagData) => {
    try {
        const response = await axiosClient.post('/tags/create', tagData);
        toast.success('Tag created successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to create tag');
    }
};

export const getTags = async (userId) => {
    try {
        const response = await axiosClient.post('/tags/get', { userId });
        const msg = response?.data;
        if (msg && msg.status === 'success' && Array.isArray(msg.message)) return msg.message;
        return [];
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

export const updateTag = async (tagId, updateData) => {
    try {
        const response = await axiosClient.post('/tags/update', {
            tagId,
            ...updateData
        });
        toast.success('Tag updated successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to update tag');
    }
};

export const deleteTag = async (tagId) => {
    try {
        const response = await axiosClient.post('/tags/delete', { tagId });
        toast.success('Tag deleted successfully');
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to delete tag');
    }
};

// ============ EXPORT UTILITIES ============
export const exportToCSV = (expenses, filename = 'expenses.csv') => {
    try {
        if (expenses.length === 0) {
            toast.error('No expenses to export');
            return;
        }

        const headers = ['Amount', 'Category', 'Date', 'Description', 'Tags', 'Currency'];
        const rows = expenses.map(exp => [
            exp.amount,
            exp.category,
            new Date(exp.date).toLocaleDateString(),
            exp.description || '',
            exp.tags ? exp.tags.join(';') : '',
            exp.currency || 'INR'
        ]);

        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        toast.success('Expenses exported to CSV successfully');
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to export expenses');
    }
};

// ============ UTILITY FUNCTIONS ============
export const getCategoryColor = (category) => {
    const colors = {
        'Grocery': '#10b981',
        'Vehicle': '#f59e0b',
        'Shopping': '#ec4899',
        'Travel': '#3b82f6',
        'Food': '#ef4444',
        'Fun': '#8b5cf6',
        'Other': '#6b7280'
    };
    return colors[category] || '#3b82f6';
};

export const formatCurrency = (amount, currency = 'INR') => {
    const symbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
};

export const getDateRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return { startDate, endDate };
};

// ============ EMAIL UTILITIES ============
export const sendEmail = async (userId, recipientEmail) => {
    try {
        if (!recipientEmail) {
            toast.error('Please enter an email address');
            return false;
        }
        const response = await axiosClient.post('/expenses/sendEmail', {
            userId,
            recipientEmail
        });
        if (response.data.statusCode !== 200) {
            toast.error(`${response.data.message}`);
            return false;
        }
        toast.success(`Report sent to ${recipientEmail}`);
        return true;
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to send email');
        return false;
    }
};

export const updateUser = async (updateData) => {
    try {
        const response = await axiosClient.put('/auth/update', updateData);
        if (response.data.status === "error") {
            toast.error(`${response.data.message}`);
            return;
        }
        toast.success('Profile updated successfully');
        localStorage.setItem('User', JSON.stringify(response.data.message));
        return response.data.message;
    } catch (e) {
        console.log(e.message);
        toast.error('Failed to update profile');
    }
};

export const sendSplitInvites = async (userName, userEmail, recipients, expenseDetails) => {
    try {
        const response = await axiosClient.post('/expenses/sendSplitInvites', {
            creatorName: userName,
            creatorEmail: userEmail,
            recipients,
            expenseDetails
        });
        if (response.data.statusCode !== 200) {
            console.error('Failed to send split invites');
            return false;
        }
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};

export const getAIAdvice = async (expenses, budgetStats, userName) => {
    try {
        const response = await axiosClient.post('/ai/advice', {
            expenses,
            budgetStats,
            userName
        });
        if (response.data.statusCode !== 200) {
            toast.error(`${response.data.message}`);
            return null;
        }
        return response.data.message;
    } catch (error) {
        console.log(error.message);
        toast.error('Failed to get AI advice');
        return null;
    }
};