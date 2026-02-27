import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Sun, Moon, Wifi, Coffee, Car, Utensils, X, User, LogOut, Calendar, UserCircle, File } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed

const Menubar = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // Load saved theme on component mount
  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no saved theme, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only apply system preference if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        } else {
          setIsDarkMode(false);
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('menubar-panel');
      const menuButton = document.getElementById('menu-button');
      
      if (isOpen && menu && !menu.contains(event.target) && 
          menuButton && !menuButton.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose(); // Close menu after logout
  };

  // Mock services data
  const services = [
    { name: 'Service-category', icon: File, description: 'Total Service ' },
    { name: 'Breakfast', icon: Coffee, description: 'Complimentary breakfast' },
    { name: 'Parking', icon: Car, description: 'Free parking' },
    { name: 'Restaurant', icon: Utensils, description: 'Fine dining' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div
        id="menubar-panel"
        className={`fixed top-20 right-0 h-full w-80 bg-white/20 dark:bg-black/30 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <div className="h-full overflow-y-auto py-16 px-6">
          {/* User Info - Show only when authenticated */}
          {isAuthenticated && user && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-black dark:text-gray-400 truncate">
                    {user.email || ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Home Link */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center space-x-3 p-3 mb-2 text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
          >
            <Home size={24} className="group-hover:text-purple-600 dark:group-hover:text-purple-400" />
            <span className="text-lg font-medium">Home</span>
          </Link>

          {/* Authenticated User Links - Show only when logged in */}
          {isAuthenticated && (
            <>
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center space-x-3 p-3 mb-2 text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
              >
                <UserCircle size={24} className="group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                <span className="text-lg font-medium">My Account</span>
              </Link>


              <Link
                to="/my-booking"
                onClick={onClose}
                className="flex items-center space-x-3 p-3 mb-2 text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
              >
                <Calendar size={24} className="group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                <span className="text-lg font-medium">My Bookings</span>
              </Link>

              {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 px-3 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
              >
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}
            </>
          )}

          {/* Dark/Light Mode Toggle */}
          <div className="my-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200 font-medium flex items-center">
                {isDarkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2 text-yellow-500" />}
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
                <span className="absolute left-1 text-xs">
                  {!isDarkMode && <Sun size={14} className="text-yellow-500" />}
                </span>
                <span className="absolute right-1 text-xs">
                  {isDarkMode && <Moon size={14} className="text-white" />}
                </span>
              </button>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-8">
          <Link to = {"/service-category"}>
          <h2 className='font-bold text-xl hover:bg-gray-200 p-2 hover:rounded-lg text-black dark:text-white dark:hover:bg-gray-600'>Service Category</h2>
          </Link>
          </div>

          {/* Account Section - Conditional based on auth status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-3">
              Account
            </h3>
            <div className="space-y-3 px-3">
              {!isAuthenticated ? (
                // Show Sign Up/Login for non-authenticated users
                <>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white text-center font-medium rounded-lg transition-colors transform hover:scale-105 active:scale-95"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full py-3 px-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-center font-medium rounded-lg transition-colors transform hover:scale-105 active:scale-95"
                  >
                    Login
                  </Link>
                </>
              ) : (
                // Show Logout for authenticated users
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-center font-medium rounded-lg transition-colors transform hover:scale-105 active:scale-95"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>

         
        </div>
      </div>
    </>
  );
};

export default Menubar;