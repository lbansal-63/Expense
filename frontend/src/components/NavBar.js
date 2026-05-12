import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BsSendFill } from 'react-icons/bs'
import { FiSun, FiMoon } from 'react-icons/fi'
import { sendEmail } from '../utils/renders';
import LoadingBar from 'react-top-loading-bar';
import { useRef } from 'react';

function NavBar(props) {

  const [isPressed, setIsPressed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // eslint-disable-next-line
  const [userEmail, setUserEmail] = useState('');
  const ref = useRef(null);

  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem('User')) || {};
  });

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'light' ? false : true;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // const userData = props.data; // Unused

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user.username || user.name || 'User');

  return (
    <div>
      <LoadingBar color='orange' ref={ref}  ></LoadingBar>

      <div className=' fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/80 dark:bg-neutral-900/80 border-b border-gray-200 dark:border-gray-800 flex flex-row justify-between items-center w-full h-24 px-6'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-purple-500/40'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 12h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className='text-slate-900 dark:text-white font-black tracking-tight text-3xl animate-fade-in'>
              Expensify
            </div>
          </div>

          {/* Nav links (desktop) */}
          <nav className='ml-8 hidden md:flex items-center gap-2'>
            {['home', 'analytics', 'budget', 'filters'].map((k) => {
              const label = k.charAt(0).toUpperCase() + k.slice(1);
              const active = props.currentView === k;
              return (
                <div key={k} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300 group-hover:duration-200 dark:group-hover:opacity-60"></div>
                  <button
                    onClick={() => { props.setView && props.setView(k); setMobileOpen(false); }}
                    className={`relative px-4 py-2 rounded-lg text-sm font-pj font-black transform transition-all duration-300 ${active ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400'}`}
                  >
                    {label}
                  </button>
                </div>
              )
            })}
          </nav>
          {/* Mobile toggle */}
          <button className='md:hidden ml-4 text-gray-600 dark:text-gray-300' onClick={() => setMobileOpen(v => !v)} aria-label='Toggle menu'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='stroke-current'>
              <path d='M4 7h16M4 12h16M4 17h16' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>
          {/* Mobile menu */}
          {mobileOpen && (
            <div className='absolute top-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 z-50 shadow-xl md:hidden'>
              <div className='flex flex-col gap-2'>
                {['home', 'analytics', 'budget', 'filters'].map((k) => {
                  const label = k.charAt(0).toUpperCase() + k.slice(1);
                  const active = props.currentView === k;
                  return (<button key={k} onClick={() => { props.setView && props.setView(k); setMobileOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-indigo-600 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700'}`}>{label}</button>)
                })}
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-row justify-end w-1/3'>

          <div className='pl-4 mr-16 pr-4 w-auto  rounded-xl mt-6 mb-6 '>

            <div className="relative z-50 inline-flex group" onClick={() => setIsPressed(!isPressed)} >
              <div title=""
                className="relative inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider font-bold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95"
                role="button">Send Email
              </div>
            </div>
            {
              <>
                <div className={`flex flex-col  overflow-hidden ${isPressed ? 'opacity-100 mt-8 w-1/4' : 'opacity-0 ml-20 w-0 -mt-10'} justify-between transition-all duration-500  h-50 bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 shadow-xl  gap-3 absolute  p-3 z-40 -ml-48 rounded-xl`}  >
                  <div className=' text-gray-100 absolute -inset-x-2 -inset-y-2 bg-red-500 font-bold rounded-full w-6 pt-0.5 text-center left-0.5 top-1 cursor-pointer h-fit border-2 border-white dark:border-gray-800' onClick={() => setIsPressed(!isPressed)} ><p className='-mt-1' >x</p></div>
                  <div className='flex flex-row gap-3 justify-between ' >
                    <input placeholder='Your Email' onChange={(e) => {
                      setUserEmail(e.target.value);
                    }} type='email' className=' outline-none p-2 pl-4 w-full rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'></input>
                    <button onClick={() => {
                      sendEmail(user._id || user.id, userEmail)
                    }} className=' rounded-xl w-fit bg-indigo-600 dark:bg-indigo-500 p-3 text-2xl text-white'  ><BsSendFill></BsSendFill></button>
                  </div>
                  <p className='text-xs text-center text-gray-600 dark:text-gray-300 whitespace-nowrap '>**Get your expenses in <b>one month</b>, On Your Email</p>
                </div>
              </>
            }
          </div>

          <div className="flex items-center gap-6 mr-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-indigo-600 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="relative text-xl flex items-center justify-center p-3 overflow-hidden font-medium text-indigo-600 transition-all duration-300 border-2 border-indigo-500 rounded-full bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 hover:scale-110 active:scale-95"
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
              <button
                onClick={() => navigate('/profile')}
                title="View Profile"
                className="w-14 h-14 relative flex items-center justify-center overflow-hidden font-pj font-black text-white transition-all duration-300 border-2 border-transparent dark:hover:border-cyan-400/50 rounded-full shadow-lg bg-gray-900 dark:bg-gray-800 hover:scale-110 active:scale-95 group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full bg-cyan-500/80 text-white transition-all duration-300 transform -translate-y-full group-hover:translate-y-0 ease-in-out backdrop-blur-sm z-10">
                  <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                {user.avatar && user.avatar.startsWith('http') ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover scale-110 group-hover:opacity-0 transition-all duration-300" />
                ) : (
                  <span className={`relative transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 ${user.avatar && user.avatar !== 'INITIALS' ? 'text-2xl' : 'text-lg'}`}>
                    {user.avatar && user.avatar !== 'INITIALS' ? user.avatar : initials}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar