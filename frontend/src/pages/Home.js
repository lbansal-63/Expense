import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import Items from '../components/Items';
import { Chartss } from '../components/Chartss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoadingBar from 'react-top-loading-bar';
import toast from 'react-hot-toast';
import { createExpense, getUserExpenses, exportToCSV, sendEmail } from '../utils/renders';
import NavBar from '../components/NavBar';
import AdvancedFilters from '../components/AdvancedFilters';
import BudgetManagement from '../components/BudgetManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import EditExpenseModal from '../components/EditExpenseModal';
import RecurringExpenses from '../components/RecurringExpenses';
import SplitExpenses from '../components/SplitExpenses';
import CurrencySelector from '../components/CurrencySelector';
import AIAdvisor from '../components/AIAdvisor';
import { FiDownload, FiMail, FiX, FiBarChart } from 'react-icons/fi';
import { useRef } from 'react';

function Home() {
  const navigate = useNavigate();
  const [selectDate, setSelectedDate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("INR");
  
  const [userdata] = useState(() => {
    const user = JSON.parse(localStorage.getItem('User')) || {};
    if (!user._id && user.id) user._id = user.id;
    return user;
  });
  const [userexp, setUserexp] = useState([]);
  const [filteredExp, setFilteredExp] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // home, budget, analytics, tags, filters
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const ref = useRef(null);

  document.title = 'Home - Expense Tracker';

  const loadExpenses = useCallback(async () => {
    const data = await getUserExpenses(userdata._id);
    setUserexp(data || []);
    setFilteredExp(data || []);
  }, [userdata._id]);

  useEffect(() => {
    if (!localStorage.getItem('User')) {
      navigate('/login');
    }
    loadExpenses();
  }, [userdata._id, navigate, loadExpenses]);

  const getTotal = (expenses = userexp) => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleCreateExpense = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category || !selectDate) {
      toast.error('Please fill all required fields');
      return;
    }
    if (ref.current && ref.current.staticStart) ref.current.staticStart();

    const expInfo = {
      usersid: userdata._id,
      category,
      date: selectDate instanceof Date ? selectDate.toISOString() : selectDate,
      amount: parsedAmount,
      description: description,
      currency: currency,
      isRecurring: false
    };

    const result = await createExpense(expInfo);
    if (result) {
      setAmount(0);
      setCategory("");
      setSelectedDate(null);
      setDescription("");
      loadExpenses();
    }
    ref.current.complete();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const handleUpdateExpense = (updatedExpense) => {
    loadExpenses();
  };

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    if (userexp.length === 0) {
      toast.error('No expenses to send');
      return;
    }
    const success = await sendEmail(userdata._id, emailInput);
    if (success) {
      setEmailInput('');
      setShowEmailModal(false);
    }
  };

  const categories = [
    { name: 'Grocery' },
    { name: 'Vehicle' },
    { name: 'Shopping' },
    { name: 'Travel' },
    { name: 'Food' },
    { name: 'Fun' },
    { name: 'Other' }
  ];


  return (
    <div className='pt-28 min-h-screen font-mont w-full bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100'>
      <LoadingBar color='#4f46e5' ref={ref} />
      <NavBar data={userexp} setView={setCurrentView} currentView={currentView} />

      {/* Navigation is integrated into the top NavBar now — removed duplicate tabs */}

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {currentView === 'home' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Section - Chart */}
            <div className='lg:col-span-2'>
              <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg min-h-[400px] flex flex-col justify-center'>
                {userexp.length > 0 ? (
                  <Chartss exdata={userexp} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in">
                    <div className="w-64 h-64 mb-6 relative group">
                      {/* Decorative Background Glows */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700 scale-110"></div>
                      <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:blur-xl transition-all duration-700"></div>
                      
                      {/* Abstract Empty Chart Icon */}
                      <svg className="w-full h-full text-indigo-200/50 dark:text-gray-700/50 relative z-10 transform transition-transform group-hover:scale-105 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      
                      {/* Floating Icon for character */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-indigo-500 opacity-80 group-hover:scale-125 transition-transform duration-500">
                        <FiBarChart />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-8">Chart Your Course!</h3>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                            Weekly Trends
                        </div>
                        <div className="px-5 py-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-purple-100 dark:border-purple-800/50 shadow-sm">
                            Category Pie
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Create Expense */}
            <div className='flex flex-col gap-6'>
              {/* Create Expense Card - Simplified */}
              <div className='relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300'>
                <h2 className='text-3xl font-black text-slate-900 dark:text-white mb-6'>Add Expense</h2>

                <div className='space-y-5'>
                  <input
                    type='number'
                    step='0.01'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder='Amount'
                    className='w-full px-5 py-3 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold'
                  />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full px-5 py-3 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none'
                  >
                    <option value=''>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <DatePicker
                    selected={selectDate}
                    onChange={(date) => setSelectedDate(date)}
                    className='w-full px-5 py-3 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
                    placeholderText='Select Date'
                    showYearDropdown
                  />

                  <input
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Description (optional)'
                    className='w-full px-5 py-3 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
                  />

                  <CurrencySelector value={currency} onChange={(e) => setCurrency(e.target.value)} />

                  <div className="pt-4">
                    <button
                      onClick={handleCreateExpense}
                      className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide py-4 mt-2 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
                    >
                      <span className="relative flex items-center justify-center gap-2">+ Add Expense</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-2'>
                <RecurringExpenses userId={userdata._id} onAddRecurring={handleCreateExpense} />
                <SplitExpenses userId={userdata._id} onAddSplit={loadExpenses} userName={userdata.name} userEmail={userdata.email} />
              </div>

              {/* Stats Card - Simplified */}
              <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm'>
                <p className='text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider'>Total Spent</p>
                <p className='text-4xl font-black text-slate-900 dark:text-white mt-1'>₹ {getTotal().toFixed(2)}</p>
                <div className='flex items-center gap-2 mt-2'>
                  <span className='w-2 h-2 rounded-full bg-green-500'></span>
                  <p className='text-slate-500 dark:text-slate-400 text-xs font-bold'>{userexp.length} transactions recorded</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'analytics' && <AnalyticsDashboard userId={userdata._id} expenses={userexp} />}

        {currentView === 'budget' && <BudgetManagement userId={userdata._id} />}

        {currentView === 'filters' && (
          <div className='space-y-6'>
            <AdvancedFilters userId={userdata._id} onApplyFilters={setFilteredExp} />
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Filtered Expenses ({filteredExp.length})
                </h3>
                <button
                  onClick={() => exportToCSV(filteredExp)}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all'
                >
                  <FiDownload /> Export CSV
                </button>
              </div>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>Total: ₹ {getTotal(filteredExp).toFixed(2)}</p>
              <div className='grid gap-4'>
                {filteredExp.map((exp) => (
                  <Items
                    key={exp._id}
                    data={exp}
                    onEdit={handleEditExpense}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expenses List for Home View */}
        {currentView === 'home' && (
          <div className='mt-8'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>Recent Expenses</h2>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all'
                >
                  <FiMail /> Send Report
                </button>
                <button
                  onClick={() => exportToCSV(userexp)}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all'
                >
                  <FiDownload /> Export All
                </button>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {userexp.map((exp) => (
                <Items
                  key={exp._id}
                  data={exp}
                  onEdit={handleEditExpense}
                />
              ))}
            </div>
            {userexp.length === 0 && (
              <div className='col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 px-4 mt-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 shadow-sm'>
                <div className='text-6xl mb-4 text-indigo-500 animate-bounce' style={{ animationDuration: '2s' }}>
                  <FiBarChart />
                </div>
                <h3 className='text-2xl font-extrabold text-gray-900 dark:text-white mb-2'>Nothing here yet!</h3>
                <p className='text-gray-500 dark:text-gray-400 text-center max-w-sm font-medium'>
                  Your expense list is looking a little empty. Add your first expense above to start tracking your spending!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Expense Modal */}
      {showEditModal && editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateExpense}
          userId={userdata._id}
        />
      )}

      {/* Email Report Modal */}
      {showEmailModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-lg'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Send Expense Report</h2>
              <button onClick={() => setShowEmailModal(false)} className='text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'>
                <FiX size={24} />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-gray-600 dark:text-gray-300 text-sm'>Recipient Email</label>
                <input
                  type='email'
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder='recipient@email.com'
                  className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={handleSendEmail}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all'
                >
                  Send Report
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className='flex-1 bg-gray-600 hover:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg transition-all'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Financial Advisor */}
      <AIAdvisor 
        expenses={userexp} 
        userName={userdata.username || userdata.name}
        budgetStats={{
            totalSpent: getTotal(),
            transactionCount: userexp.length
        }}
      />
    </div>
  );
}

export default Home;