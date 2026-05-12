import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getExpenseStats } from '../utils/renders';

function AnalyticsDashboard({ userId, expenses }) {
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [chartData, setChartData] = useState([]);

  const loadStats = useCallback(async () => {
    const data = await getExpenseStats(userId, timeRange);
    setStats(data);
  }, [userId, timeRange]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      // Group expenses by date for line chart
      const dailyData = {};
      expenses.forEach((exp) => {
        const date = new Date(exp.date).toLocaleDateString();
        dailyData[date] = (dailyData[date] || 0) + exp.amount;
      });

      const lineChartData = Object.entries(dailyData)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setChartData(lineChartData);
    }
  }, [expenses]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

  const categoryData = stats?.categoryBreakdown
    ? Object.entries(stats.categoryBreakdown).map(([category, amount]) => ({
        name: category,
        value: amount
      }))
    : [];

  return (
    <div className='w-full bg-gradient-to-br dark:bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>Analytics & Insights</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(parseInt(e.target.value))}
          className='bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='relative group transform-gpu will-change-transform transition-all duration-300 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 border border-transparent dark:border-gray-700 flex flex-col justify-center animate-fade-in'>
            <div className='absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out z-0 pointer-events-none'></div>
            <div className='relative z-10'>
              <p className='text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider mb-1'>Total Spent</p>
              <p className='text-gray-900 dark:text-white text-3xl font-extrabold line-clamp-1'>₹{Number(stats?.totalSpent ?? 0).toFixed(2)}</p>
            </div>
          </div>
          <div className='relative group transform-gpu will-change-transform transition-all duration-300 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 border border-transparent dark:border-gray-700 flex flex-col justify-center animate-fade-in'>
            <div className='absolute inset-0 bg-green-500/10 rounded-2xl blur-xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out z-0 pointer-events-none'></div>
            <div className='relative z-10'>
              <p className='text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-wider mb-1'>Avg Per Day</p>
              <p className='text-gray-900 dark:text-white text-3xl font-extrabold line-clamp-1'>₹{Number(stats?.avgPerDay ?? 0).toFixed(2)}</p>
            </div>
          </div>
          <div className='relative group transform-gpu will-change-transform transition-all duration-300 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 border border-transparent dark:border-gray-700 flex flex-col justify-center animate-fade-in'>
            <div className='absolute inset-0 bg-purple-500/10 rounded-2xl blur-xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out z-0 pointer-events-none'></div>
            <div className='relative z-10'>
              <p className='text-purple-600 dark:text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1'>Total Expenses</p>
              <p className='text-gray-900 dark:text-white text-3xl font-extrabold line-clamp-1'>{stats.expenseCount}</p>
            </div>
          </div>
          <div className='relative group transform-gpu will-change-transform transition-all duration-300 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 border border-transparent dark:border-gray-700 flex flex-col justify-center animate-fade-in'>
            <div className='absolute inset-0 bg-yellow-500/10 rounded-2xl blur-xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out z-0 pointer-events-none'></div>
            <div className='relative z-10'>
              <p className='text-yellow-600 dark:text-yellow-400 text-sm font-semibold uppercase tracking-wider mb-1'>Avg Per Exp</p>
              <p className='text-gray-900 dark:text-white text-3xl font-extrabold line-clamp-1'>₹{stats?.expenseCount ? Number((stats.totalSpent ?? 0) / stats.expenseCount).toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Line Chart - Daily Spending Trend */}
        <div className='relative group transform-gpu will-change-transform transition-all duration-300 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-transparent dark:border-gray-700'>
          {/* Ambient Glow */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl blur-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out z-0 pointer-events-none'></div>
          
          <div className='relative z-10 transition-transform duration-300 group-hover:-translate-y-1'>
            <h3 className='text-xl text-gray-900 dark:text-white font-extrabold mb-6 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-blue-500 animate-pulse'></span>
              Spending Trend
            </h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' stroke='currentColor' className='opacity-10 dark:opacity-20' vertical={false} />
                <XAxis dataKey="date" stroke='currentColor' className='text-xs opacity-50' tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke='currentColor' className='text-xs opacity-50' tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  cursor={{ stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type='monotone'
                  dataKey='amount'
                  name='Amount (₹)'
                  stroke='url(#colorAmount)'
                  strokeWidth={4}
                  dot={{ fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Category Breakdown */}
        <div className='relative group transform-gpu will-change-transform transition-all duration-300 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-transparent dark:border-gray-700'>
          {/* Ambient Glow */}
          <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-2xl blur-2xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out z-0 pointer-events-none'></div>
          
          <div className='relative z-10 transition-transform duration-300 group-hover:-translate-y-1 block w-full h-full'>
            <h3 className='text-xl text-gray-900 dark:text-white font-extrabold mb-6 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
              Category Breakdown
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey='value'
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer drop-shadow-sm" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${Number(value ?? 0).toFixed(2)}`}
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-[300px]'>
                <p className='text-gray-500 dark:text-gray-400 text-center'>No category data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
