import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiUsers, 
  FiGrid, 
  FiCalendar, 
  FiBookOpen,
  FiSettings,
  FiLogOut,
  FiBell,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiMoon,
  FiSun
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminPanel = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
    }
  };

  const menu = [
    { name: "Dashboard", path: "/admin", icon: FiHome },
    { name: "All Users", path: "/admin/all-users", icon: FiUsers },
    { name: "All Services", path: "/admin/all-service", icon: FiGrid },
    { name: "Booking Status", path: "/admin/booking-status", icon: FiCalendar },
    { name: "All Bookings", path: "/admin/all-booking", icon: FiBookOpen },
  ];

  const bottomMenu = [
    { name: "Settings", path: "/admin/settings", icon: FiSettings },
    { name: "Logout", path: "/logout", icon: FiLogOut },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-20 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed top-20 left-0 bottom-0 w-72 bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-md z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Admin
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiX size={20} className="text-gray-800 dark:text-gray-300" />
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-1">
                  {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-black dark:text-white shadow-lg shadow-purple-500/20"
                            : "text-black dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Bottom Menu */}
                <div className="absolute bottom-5 left-5 right-5 space-y-1 pt-5 border-t border-gray-200 dark:border-gray-800">
                  {bottomMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: sidebarOpen ? 280 : 80 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:block fixed left-0 top-20 bottom-0 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-20 shadow-xl overflow-hidden"
      >
        <div className="relative h-full flex flex-col">
          
          {/* Logo Area */}
          <div className={`p-6 ${!sidebarOpen && 'px-4'}`}>
            {sidebarOpen ? (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                Admin Panel
              </h2>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute right-4 top-8 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors z-10"
          >
            {sidebarOpen ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
          </button>

          {/* Search Bar (when expanded) */}
          {sidebarOpen && (
            <div className="px-4 mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto px-3">
            <div className="space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                    } ${!sidebarOpen && 'justify-center px-2'}`}
                    title={!sidebarOpen ? item.name : ''}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Menu */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-1">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all ${
                  !sidebarOpen && 'justify-center px-2'
                }`}
                title={!sidebarOpen ? 'Toggle Theme' : ''}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                {sidebarOpen && <span className="font-medium">Theme</span>}
              </button>

              {/* Bottom Menu Items */}
              {bottomMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all ${
                      !sidebarOpen && 'justify-center px-2'
                    }`}
                    title={!sidebarOpen ? item.name : ''}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div 
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'
        } ${mobileMenuOpen ? 'lg:ml-0' : ''}`}
      >
        {/* Top Bar (Desktop) */}
        <div className="hidden lg:flex sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 py-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {menu.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;