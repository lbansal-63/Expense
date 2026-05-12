import React, { useState } from 'react';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createExpense, sendSplitInvites } from '../utils/renders';

function SplitExpenses({ userId, onAddSplit, userName, userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    splitWith: [],
    date: new Date().toISOString().split('T')[0]
  });
  const [friendEmail, setFriendEmail] = useState('');

  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

  const handleAddFriend = () => {
    if (friendEmail.trim() && !formData.splitWith.includes(friendEmail)) {
      setFormData({
        ...formData,
        splitWith: [...formData.splitWith, friendEmail]
      });
      setFriendEmail('');
    }
  };

  const handleRemoveFriend = (friend) => {
    setFormData({
      ...formData,
      splitWith: formData.splitWith.filter((f) => f !== friend)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || formData.splitWith.length === 0) {
      toast.error('Please fill all fields and add at least one person');
      return;
    }

    const splitAmount = (parseFloat(formData.amount) / (formData.splitWith.length + 1)).toFixed(2);
    
    // Create expense with split information
    const expenseData = {
      usersid: userId,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      splitWith: formData.splitWith,
      tags: []
    };

    createExpense(expenseData).then((result) => {
      if (result) {
        toast.success(`Split created! Each person owes ₹${splitAmount}`);
        
        // Send invites to friends
        sendSplitInvites(
          userName || 'Your friend',
          userEmail || 'friend@example.com',
          formData.splitWith,
          {
            amount: formData.amount,
            category: formData.category,
            description: formData.description,
            date: formData.date,
            splitAmount: splitAmount
          }
        );
        
        // Reset form
        setFormData({
          amount: '',
          category: '',
          description: '',
          splitWith: [],
          date: new Date().toISOString().split('T')[0]
        });
        setShowForm(false);
        
        // Call callback to refresh expenses list
        if (onAddSplit) {
          onAddSplit();
        }
      }
    });
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className='flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all duration-300 mb-4'
      >
        <FiPlus /> Split Expense
      </button>

      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-lg max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Split Expense</h2>
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
                  placeholder='Enter total amount'
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500'
                  required
                />
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500'
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
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Date</label>
                <input
                  type='date'
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500'
                />
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='What was this for?'
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500 h-16'
                />
              </div>

              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm mb-2 block'>Add People to Split With</label>
                <div className='flex gap-2 mb-2'>
                  <input
                    type='email'
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFriend())}
                    placeholder='friend@email.com'
                    className='flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500 text-sm'
                  />
                  <button
                    type='button'
                    onClick={handleAddFriend}
                    className='bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg text-gray-900 dark:text-white'
                  >
                    Add
                  </button>
                </div>

                <div className='space-y-2'>
                  {formData.splitWith.map((friend) => (
                    <div
                      key={friend}
                      className='flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg'
                    >
                      <p className='text-gray-900 dark:text-white text-sm'>{friend}</p>
                      <button
                        type='button'
                        onClick={() => handleRemoveFriend(friend)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {formData.splitWith.length > 0 && formData.amount && (
                <div className='bg-blue-900 p-3 rounded-lg'>
                  <p className='text-blue-700 dark:text-blue-300 text-sm'>Each person owes:</p>
                  <p className='text-gray-900 dark:text-white font-bold text-lg'>
                    ₹{(parseFloat(formData.amount) / (formData.splitWith.length + 1)).toFixed(2)}
                  </p>
                </div>
              )}

              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='flex-1 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
                >
                  Create Split Expense
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

export default SplitExpenses;
