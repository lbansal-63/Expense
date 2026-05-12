import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

function RecurringExpenses({ userId, onAddRecurring }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    frequency: 'monthly',
    startDate: '',
    description: '',
    endDate: ''
  });

  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.startDate) {
      toast.error('Please fill all required fields');
      return;
    }

    onAddRecurring({
      ...formData,
      userId,
      isRecurring: true,
      recurringFrequency: formData.frequency
    });

    setFormData({
      amount: '',
      category: '',
      frequency: 'monthly',
      startDate: '',
      description: '',
      endDate: ''
    });
    setShowForm(false);
  };

  return (
    <div className='w-full'>
      <button
        onClick={() => setShowForm(!showForm)}
        className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all duration-300 mb-4'
      >
        <FiPlus /> Add Recurring Expense
      </button>

      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-lg'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Setup Recurring Expense</h2>
              <button onClick={() => setShowForm(false)} className='text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Amount</label>
                <input
                  type='number'
                  step='0.01'
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder='Enter amount'
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500'
                  required
                />
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500'
                  required
                >
                  <option value=''>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500'
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Start Date</label>
                <input
                  type='date'
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500'
                  required
                />
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>End Date (Optional)</label>
                <input
                  type='date'
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500'
                />
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Add notes...'
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-20'
                />
              </div>

              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='flex-1 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
                >
                  Create Recurring Expense
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
        </div>
      )}
    </div>
  );
}

export default RecurringExpenses;
