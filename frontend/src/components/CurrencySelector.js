import React from 'react';

function CurrencySelector({ value, onChange, currencies = ['INR', 'USD', 'EUR', 'GBP'] }) {
  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  return (
    <div className='flex items-center gap-2'>
      <label className='text-gray-600 dark:text-gray-300 text-sm'>Currency:</label>
      <select
        value={value}
        onChange={onChange}
        className='bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm'
      >
        {currencies.map((curr) => (
          <option key={curr} value={curr}>
            {curr} ({symbols[curr] || curr})
          </option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelector;
