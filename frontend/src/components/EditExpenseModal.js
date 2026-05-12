import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { updateExpense } from '../utils/renders';

function EditExpenseModal({ expense, onClose, onUpdate, userId }) {
  const [formData, setFormData] = useState({
    amount: expense.amount,
    category: expense.category,
    date: new Date(expense.date).toISOString().split('T')[0],
    description: expense.description || '',
    tags: expense.tags || [],
    currency: expense.currency || 'INR'
  });

  const [newTag, setNewTag] = useState('');
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateExpense(expense._id, userId, formData);
    if (result) {
      onUpdate(result);
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Edit Expense</h2>
          <button onClick={onClose} className='text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'>
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
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='text-gray-600 dark:text-gray-300 text-sm'>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='text-gray-600 dark:text-gray-300 text-sm'>Date</label>
            <input
              type='date'
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='text-gray-600 dark:text-gray-300 text-sm'>Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='INR'>INR (₹)</option>
              <option value='USD'>USD ($)</option>
              <option value='EUR'>EUR (€)</option>
              <option value='GBP'>GBP (£)</option>
            </select>
          </div>

          <div>
            <label className='text-gray-600 dark:text-gray-300 text-sm'>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder='Add notes...'
              className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-24'
            />
          </div>

          <div>
            <label className='text-gray-600 dark:text-gray-300 text-sm'>Tags</label>
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder='Add a tag...'
                className='flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                type='button'
                onClick={handleAddTag}
                className='bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-gray-900 dark:text-white'
              >
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className='bg-blue-600 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm flex items-center gap-2'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='hover:text-red-300'
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              className='flex-1 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
            >
              Update Expense
            </button>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-gray-600 hover:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseModal;
