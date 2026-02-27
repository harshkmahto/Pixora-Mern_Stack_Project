import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Calendar, UserCircle, LogIn } from 'lucide-react';
import Menubar from './Menubar';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, user, logout, isAdmin} = useAuth(); // Get auth state

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/10 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        {/* Navigation Bar */}
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Small Logo */}
            <Link 
              to="/" >
              <img src="" alt="" />
            </Link>

            {/* Center - Main Logo/Brand Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 
                className={`font-bold transition-all duration-500 ${
                  isScrolled 
                    ? 'text-2xl md:text-3xl text-purple-600 dark:text-purple-400' 
                    : 'text-4xl md:text-6xl text-black'
                }`}
              >
                Pixora
              </h1>
              
            </div>

            {/* Right side Icons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Search Icon - Always visible */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled
                      ? 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'text-black  hover:bg-white/10'
                  }`}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Conditional rendering: Login button OR Profile */}
                {!isAuthenticated ? (
                  // Show Login button when not authenticated
                  <Link
                    to="/auth"
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all ${
                      isScrolled
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : ' text-black  backdrop-blur-sm'
                    }`}
                  >
                    <LogIn size={18} />
                    <span className="font-medium">Login</span>
                  </Link>
                ) : (
                  // Show Profile icon when authenticated
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`p-2 rounded-full transition-colors ${
                        isScrolled
                          ? 'text-black dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                          : 'text-black  hover:bg-white/10'
                      }`}
                      aria-label="Profile"
                    >
                      <User size={20} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || ''}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircle size={16} className="mr-2" />
                          My Account
                        </Link>
                        <Link
                          to="/my-booking"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Calendar size={16} className="mr-2" />
                          My Bookings
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all ${
                              isScrolled
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-indigo-500 text-white hover:bg-indigo-600 backdrop-blur-sm"
                            }`}
                          >
                            <span className="font-medium">Admin Panel</span>
                          </Link>
                        )}
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Menu Icon - Always visible (opens Menubar) */}
                <button
                  id="menu-button"
                  onClick={() => setIsMenuOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled
                      ? 'text-black dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'text-black  hover:bg-white/10'
                  }`}
                  aria-label="Menu"
                >
                  <Menu size={20} />
                </button>
              </div>

              {/* Mobile Icons */}
              <div className="flex md:hidden items-center space-x-2">
                {/* Mobile Search - Always visible */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'text-black dark:text-white hover:bg-white/10'
                  }`}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Mobile: Conditional Login or nothing */}
                {!isAuthenticated ? (
                  // Mobile Login button
                  <Link
                    to="/login"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all ${
                      isScrolled
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-white/20 text-black dark:text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    <LogIn size={18} />
                    <span className="font-medium text-sm">Login</span>
                  </Link>
                ) : null}

                {/* Mobile Menu Icon - Always visible (opens Menubar) */}
                <button
                  id="menu-button-mobile"
                  onClick={() => setIsMenuOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'text-black dark:text-white hover:bg-white/10'
                  }`}
                  aria-label="Menu"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Search Popup */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />
            
            {/* Search Modal */}
            <div 
              ref={searchRef}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            >
              <form onSubmit={handleSearch} className="flex items-center border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for destinations, experiences..."
                  className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-200 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Search
                </button>
              </form>
              
              {/* Quick Suggestions */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Popular Searches</h3>
                <div className="space-y-2">
                  {['Beach Resorts', 'Mountain Retreats', 'City Breaks', 'Adventure Tours'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item);
                        handleSearch({ preventDefault: () => {} });
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Menubar Component - Always visible regardless of authentication */}
      <Menubar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;