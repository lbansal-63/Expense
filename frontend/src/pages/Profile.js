import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiLogOut, FiUser, FiMail, FiImage, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { updateUser } from '../utils/renders';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('User')) || {});
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user.username || user.name || '',
    email: user.email || ''
  });

  const avatars = [
    { type: 'image', value: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
    { type: 'image', value: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka' },
    { type: 'image', value: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy' },
    { type: 'image', value: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ginger' },
    { type: 'image', value: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper' },
    { type: 'image', value: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mimi' },
    { type: 'initials', value: 'INITIALS' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('User');
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  const handleUpdateAvatar = async (avatarValue) => {
    const updated = await updateUser({
        id: user._id,
        avatar: avatarValue
    });
    if (updated) {
        setUser(updated);
        setShowAvatarPicker(false);
    }
  };

  const handleUpdateProfile = async () => {
      if (!editData.username.trim() || !editData.email.trim()) {
          toast.error("Don't leave fields empty!");
          return;
      }
      const updated = await updateUser({
          id: user._id,
          username: editData.username,
          email: editData.email
      });
      if (updated) {
          setUser(updated);
          setIsEditing(false);
      }
  };

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-slate-800 overflow-hidden relative animate-fade-in group">
        {/* Floating Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 z-20 p-3 rounded-2xl bg-white dark:bg-gray-700 shadow-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-90 transition-all duration-300"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Refined Header */}
        <div className="h-48 bg-slate-900 dark:bg-black relative flex items-center justify-center p-8 overflow-hidden">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
            
            {/* Main Avatar Container */}
            <div className="relative z-10">
                <div 
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="w-28 h-28 rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center text-5xl shadow-2xl cursor-pointer group/avatar overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
                >
                    {user.avatar && user.avatar.startsWith('http') ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover scale-110" />
                    ) : user.avatar && user.avatar !== 'INITIALS' ? (
                        <span className="transform transition-transform group-hover/avatar:scale-110 duration-500">{user.avatar}</span>
                    ) : (
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 tracking-tighter transform transition-transform group-hover/avatar:scale-110 duration-500">{initials}</span>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                        <FiImage className="text-white text-3xl animate-bounce" />
                    </div>
                </div>
            </div>
        </div>

        {/* Avatar Picker Modal/Section */}
        {showAvatarPicker && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 animate-slide-down">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Customize Your 3D Profile</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {avatars.map((av, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleUpdateAvatar(av.value)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 border-2 ${
                                (user.avatar === av.value) || (!user.avatar && av.value === 'INITIALS') 
                                ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                                : 'border-transparent bg-white dark:bg-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {av.type === 'image' ? (
                                <img src={av.value} alt="Avatar Option" className="w-full h-full object-cover" />
                            ) : <span className="text-[10px] font-bold dark:text-gray-300">INITIALS</span>}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* User Details */}
        <div className="p-10 pt-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-5 p-5 rounded-3xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-100/50 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group/item">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover/item:scale-110 transition-transform">
                <FiUser size={24} />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-black mb-0.5">Username</span>
                {isEditing ? (
                    <input 
                        className="bg-white dark:bg-gray-600 text-gray-900 dark:text-white font-extrabold text-xl p-0.5 mt-0.5 border-b-2 border-indigo-500 outline-none"
                        value={editData.username}
                        onChange={(e) => setEditData({...editData, username: e.target.value})}
                    />
                ) : (
                    <span className="text-gray-900 dark:text-white font-extrabold text-xl">{user.username || user.name || 'Guest User'}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-5 p-5 rounded-3xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-100/50 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 group/item">
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 group-hover/item:scale-110 transition-transform">
                <FiMail size={24} />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-black mb-0.5">Email Address</span>
                {isEditing ? (
                    <input 
                        className="bg-white dark:bg-gray-600 text-gray-900 dark:text-white font-extrabold text-lg p-0.5 mt-0.5 border-b-2 border-purple-500 outline-none"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                    />
                ) : (
                    <span className="text-gray-900 dark:text-white font-extrabold text-lg truncate max-w-[200px]">{user.email || 'No email provided'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                    onClick={handleUpdateProfile}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/20 transform transition-all active:scale-95"
                >
                    <FiSave size={20} /> Save
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setEditData({username: user.username || user.name || '', email: user.email || ''});
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-black hover:bg-gray-200 transition-all active:scale-95"
                >
                    <FiX size={20} /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black text-lg border-2 border-indigo-100 dark:border-indigo-800/50 shadow-sm transform transition-all hover:scale-[1.02] active:scale-95"
              >
                <FiEdit2 size={20} /> Edit Personal Info
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-4 py-5 px-6 rounded-3xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-lg shadow-[0_15px_35px_rgba(239,68,68,0.3)] transform transition-all duration-300 hover:scale-[1.03] active:scale-95 group/logout"
            >
              <FiLogOut size={24} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              Sign Out Securely
            </button>
          </div>
        </div>
        
        {/* Simple Accent Bar */}
        <div className="h-2 w-full bg-indigo-600 dark:bg-indigo-500"></div>
      </div>
    </div>
  );
}

export default Profile;
