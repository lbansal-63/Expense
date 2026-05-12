import React, { useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { getFilteredExpenses } from '../utils/renders';
import toast from 'react-hot-toast';

function AdvancedFilters({ userId, onApplyFilters }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    minAmount: '',
    maxAmount: '',
    tags: []
  });

  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

  const handleDateChange = (e, type) => {
    setFilters({ ...filters, [type]: e.target.value });
  };

  const handleApplyFilters = async () => {
    const filterData = { userId, ...filters };
    const filtered = await getFilteredExpenses(filterData);
    if (filtered) {
      onApplyFilters(filtered);
      toast.success('Filters applied successfully');
      setShowFilters(false);
    }
  };

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      category: '',
      minAmount: '',
      maxAmount: '',
      tags: []
    });
  };

  return (
    <div className='w-full'>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all duration-300 mb-4'
      >
        <FiFilter /> Advanced Filters
      </button>

      {showFilters && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 shadow-lg'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Filter Expenses</h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='text-gray-600 dark:text-gray-300 text-sm'>Start Date</label>
              <input
                type='date'
                value={filters.startDate}
                onChange={(e) => handleDateChange(e, 'startDate')}
                className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <div>
              <label className='text-gray-600 dark:text-gray-300 text-sm'>End Date</label>
              <input
                type='date'
                value={filters.endDate}
                onChange={(e) => handleDateChange(e, 'endDate')}
                className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='text-gray-600 dark:text-gray-300 text-sm'>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500'
              >
                <option value=''>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div></div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='text-gray-600 dark:text-gray-300 text-sm'>Min Amount</label>
              <input
                type='number'
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                placeholder='0'
                className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <div>
              <label className='text-gray-600 dark:text-gray-300 text-sm'>Max Amount</label>
              <input
                type='number'
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                placeholder='No limit'
                className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              onClick={handleApplyFilters}
              className='flex-1 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className='flex-1 bg-gray-600 hover:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
            >
              Reset
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className='flex-1 bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all duration-300'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;
