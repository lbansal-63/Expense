import React, { useEffect, useState, useCallback } from 'react';
import { FiTrash2, FiPlus, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import { getBudgets, checkBudgetStatus, createBudget, deleteBudget } from '../utils/renders';

function BudgetManagement({ userId }) {
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limitAmount: 0,
    period: 'monthly',
    currency: 'INR',
    alertThreshold: 80
  });

  const loadBudgets = useCallback(async () => {
    const data = await getBudgets(userId);
    if (data) {
      const status = await checkBudgetStatus(userId);
      setBudgetStatus(status || []);
    }
  }, [userId]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBudget({ userId, ...formData });
    setFormData({ category: '', limitAmount: 0, period: 'monthly', currency: 'INR', alertThreshold: 80 });
    setShowForm(false);
    loadBudgets();
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(budgetId);
      loadBudgets();
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className='w-full p-6 bg-gradient-to-br dark:bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>Budget Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all duration-300'
        >
          <FiPlus /> Add Budget
        </button>
      </div>

      {showForm && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg mb-6'>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='text'
                placeholder='Category'
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
              <input
                type='number'
                placeholder='Limit Amount'
                value={formData.limitAmount}
                onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
                <option value='yearly'>Yearly</option>
              </select>
              <input
                type='number'
                placeholder='Alert Threshold %'
                value={formData.alertThreshold}
                onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                min='0'
                max='100'
              />
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='INR'>INR (₹)</option>
                <option value='USD'>USD ($)</option>
                <option value='EUR'>EUR (€)</option>
                <option value='GBP'>GBP (£)</option>
              </select>
            </div>
            <div className='flex gap-2'>
              <button
                type='submit'
                className='flex-1 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
              >
                Create Budget
              </button>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='flex-1 bg-gray-600 hover:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='grid gap-4'>
        {Array.isArray(budgetStatus) && budgetStatus.map((item, idx) => (
          <div key={idx} className='transform-gpu will-change-transform transition-transform duration-300 hover:scale-105 animate-fade-in bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg'>
            <div className='flex justify-between items-start mb-3'>
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{item.budget.category}</h3>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>{item.budget.period.charAt(0).toUpperCase() + item.budget.period.slice(1)} Budget</p>
              </div>
              <button onClick={() => handleDelete(item.budget._id)} className='text-red-500 hover:text-red-700 transition-all'>
                <FiTrash2 size={20} />
              </button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
              <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
                <p className='text-gray-600 dark:text-gray-300 text-xs'>Limit</p>
                <p className='text-gray-900 dark:text-white font-bold'>{item.budget.currency} {Number(item.budget.limitAmount ?? 0).toFixed(2)}</p>
              </div>
              <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
                <p className='text-gray-600 dark:text-gray-300 text-xs'>Spent</p>
                <p className='text-gray-900 dark:text-white font-bold'>{item.budget.currency} {Number(item.totalSpent ?? 0).toFixed(2)}</p>
              </div>
              <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
                <p className='text-gray-600 dark:text-gray-300 text-xs'>Remaining</p>
                <p className={`font-bold ${item.isExceeded ? 'text-red-500' : 'text-green-500'}`}>
                  {item.budget.currency} {Number(item.remainingBudget ?? 0).toFixed(2)}
                </p>
              </div>
              <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
                <p className='text-gray-600 dark:text-gray-300 text-xs'>Usage</p>
                <p className={`font-bold ${item.isExceeded ? 'text-red-500' : 'text-green-500'}`}>
                  {Number(item.percentageUsed ?? 0).toFixed(2)}%
                </p>
              </div>
            </div>

            <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.percentageUsed)}`}
                style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}
              ></div>
            </div>

            {item.isAlertTriggered && (
              <p className='flex items-center gap-1 text-yellow-500 text-sm mt-2'>
                <FiAlertTriangle size={14} /> Alert: Budget usage is at {item.percentageUsed}%
              </p>
            )}
            {item.isExceeded && (
              <p className='flex items-center gap-1 text-red-500 text-sm mt-2'>
                <FiAlertCircle size={14} /> Budget exceeded by {(item.percentageUsed - 100).toFixed(2)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetManagement;
