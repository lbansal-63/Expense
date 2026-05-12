import React from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { FiEdit2, FiRepeat } from 'react-icons/fi'
import { deleteExpense } from '../utils/renders';

import { MdShoppingCart, MdDirectionsCar, MdShoppingBag, MdFlight, MdRestaurant, MdTheaterComedy, MdCategory, MdAccountBalanceWallet } from 'react-icons/md';

function Items(props) {
  const exp = props.data;
  const onEdit = props.onEdit;

  function getDate() {
    let dater = new Date(Date.parse(exp.date));
    let txt = dater.toString();
    let date = txt.substring(8, 10) + " " + txt.substring(4, 7);
    return date;
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Grocery': <MdShoppingCart />,
      'Vehicle': <MdDirectionsCar />,
      'Shopping': <MdShoppingBag />,
      'Travel': <MdFlight />,
      'Food': <MdRestaurant />,
      'Fun': <MdTheaterComedy />,
      'Other': <MdCategory />
    };
    return icons[category] || <MdAccountBalanceWallet />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Grocery': 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300',
      'Vehicle': 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
      'Shopping': 'bg-pink-100 dark:bg-pink-900 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300',
      'Travel': 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300',
      'Food': 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300',
      'Fun': 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300',
      'Other': 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300'
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className='group relative transform-gpu will-change-transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in bg-white dark:bg-gray-800 rounded-2xl p-5 flex flex-col gap-4 border border-transparent dark:border-gray-700 shadow-md hover:shadow-2xl overflow-hidden'>
      {/* Decorative Glow */}
      <div className='absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
      
      <div className='relative z-10 flex justify-between items-center'>
        <div>
          <p className='font-extrabold text-3xl text-gray-900 dark:text-white font-mont tracking-tight'>₹ {exp.amount.toFixed(2)}</p>
          {exp.description && <p className='text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium'>{exp.description}</p>}
        </div>
        <div className='flex flex-col items-end gap-2'>
          <p className='border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-bold bg-gray-50 dark:bg-gray-700/50 px-4 py-1 text-xs shadow-sm shadow-inner'>
            {getDate()}
          </p>
        </div>
      </div>

      <div className='relative z-10 flex justify-between items-center mt-2'>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold shadow-sm ${getCategoryColor(exp.category)}`}>
          <span>{getCategoryIcon(exp.category)}</span>
          <p>{exp.category}</p>
        </div>

        {exp.tags && exp.tags.length > 0 && (
          <div className='flex gap-1 flex-wrap'>
            {exp.tags.map((tag) => (
              <span key={tag} className='bg-blue-600 text-gray-900 dark:text-white px-2 py-1 rounded-full text-xs font-semibold'>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className='flex gap-2'>
          {onEdit && (
            <button
              onClick={() => onEdit(exp)}
              className='rounded-md px-3 py-2 overflow-hidden relative group cursor-pointer border-2 font-medium border-blue-600 text-gray-900 dark:text-white hover:text-gray-900 dark:text-white transition-all'
            >
              <span className='absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-blue-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'></span>
              <span className='relative flex items-center gap-1 transition duration-300'>
                <FiEdit2 size={16} /> Edit
              </span>
            </button>
          )}

          <button
            onClick={() => {
              let datar = {
                expenseId: exp._id,
                userId: exp.usersid
              };
              deleteExpense(datar);
            }}
            className='rounded-md px-3 py-2 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-gray-900 dark:text-white hover:text-gray-900 dark:text-white transition-all'
          >
            <span className='absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'></span>
            <span className='relative flex items-center gap-1 transition duration-300'>
              <AiFillDelete size={16} /> Delete
            </span>
          </button>
        </div>
      </div>

      {exp.isRecurring && (
        <div className='flex items-center gap-1 text-yellow-400 text-xs bg-yellow-900 bg-opacity-30 px-2 py-1 rounded-full w-fit'>
          <FiRepeat size={12} /> Recurring {exp.recurringFrequency}
        </div>
      )}

      {exp.isEdited && (
        <div className='text-gray-500 dark:text-gray-400 text-xs'>* Edited</div>
      )}
    </div>
  )
}

export default Items