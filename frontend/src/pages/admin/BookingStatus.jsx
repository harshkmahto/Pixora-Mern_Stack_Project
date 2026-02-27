import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiCalendar, 
  FiEdit, 
  FiEye, 
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiPackage,
  FiInfo,
  FiChevronDown,
  FiImage,
  FiHash,
  FiCreditCard
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import apiRequest from '../../utils/apiRequest';
import SummaryApi from '../../common';
import { format } from 'date-fns';
import BookingDetails from '../../components/service/BookingDetails';
import StatusUpdateModal from '../../components/service/StatusUpdate'; // Import the status update modal

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('booking_created');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const itemsPerPage = 10;

  // Status tabs with colors and icons
  const statusTabs = [
    { id: 'booking_created', label: 'Booking Created', icon: FiClock, color: 'blue' },
    { id: 'pending', label: 'Pending', icon: FiAlertCircle, color: 'yellow' },
    { id: 'approved', label: 'Approved', icon: FiCheckCircle, color: 'green' },
    { id: 'confirm', label: 'Confirmed', icon: FiCheckCircle, color: 'green' },
    { id: 'completed', label: 'Completed', icon: FiCheckCircle, color: 'emerald' },
    { id: 'cancelled', label: 'Cancelled', icon: FiX, color: 'red' },
    { id: 'refund', label: 'Refunded', icon: FiRefreshCw, color: 'purple' },
  ];

  // Stats cards data
  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: FiPackage, color: 'blue' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: FiCheckCircle, color: 'green' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: FiClock, color: 'yellow' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: FiX, color: 'red' },
  ];

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search, status, and date range
  useEffect(() => {
    let filtered = [...bookings];

    // Filter by status
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [bookings, selectedStatus, searchTerm, dateRange]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest(SummaryApi.bookings.getAll);
      setBookings(response.bookings || []);
      setFilteredBookings(response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus, remark) => {
  try {
    setUpdatingStatus(true);
    
    // Find the booking to update
    const bookingToUpdate = bookings.find(b => b._id === bookingId);
    if (!bookingToUpdate) {
      throw new Error('Booking not found');
    }

    // Correct way to call the API - updateStatus is a function that returns an object
    const apiConfig = SummaryApi.bookings.updateStatus(bookingId);
    
    const response = await apiRequest(
  apiConfig,
  {
    status: newStatus,
    remark: remark,
    previousStatus: bookingToUpdate.status
  }
);

    // In handleStatusUpdate, replace the setBookings block with this:

if (response.booking || response.success) {
  const updatedBookings = bookings.map(booking => 
    booking._id === bookingId 
      ? { ...booking, status: newStatus }
      : booking
  );
  
  setBookings(updatedBookings);

  // ✅ ADD THIS: sync selectedBooking so modal shows correct status
  if (selectedBooking && selectedBooking._id === bookingId) {
    setSelectedBooking(prev => ({ ...prev, status: newStatus }));
  }

  setShowStatusModal(false);
  alert('Status updated successfully!');
} else {
  throw new Error(response.message || 'Failed to update status');
}
  } catch (err) {
    console.error('Error updating status:', err);
    throw err; // This will be caught by the modal's error state
  } finally {
    setUpdatingStatus(false);
  }
};

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleEditStatus = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const toggleCardExpand = (bookingId) => {
    setExpandedCard(expandedCard === bookingId ? null : bookingId);
  };

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    const colors = {
      booking_created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      approve: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      confirm: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      refund: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const getStatusIcon = (status) => {
    const Icon = statusTabs.find(tab => tab.id === status)?.icon || FiInfo;
    return <Icon size={14} />;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="space-y-3">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to load bookings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchBookings}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto p-4 md:p-6 h-full overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Manage and track all customer bookings in one place
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                    <Icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters Bar - Responsive */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            
            {/* Search - Full width on mobile */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-2.5 md:px-4 md:py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-purple-500 transition-colors"
              >
                <FiFilter size={16} />
                <span className="hidden sm:inline">Filters</span>
                {showFilters ? <FiX size={16} className="hidden sm:block" /> : <FiCalendar size={16} className="hidden sm:block" />}
              </button>

              <button
                onClick={fetchBookings}
                className="flex items-center gap-1.5 px-3 py-2.5 md:px-4 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm transition-colors"
              >
                <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Date Range Filters - Collapsible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Tabs - Horizontal Scroll on Mobile */}
        <div className="mb-6 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-2 min-w-max">
            {statusTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedStatus === tab.id;
              const count = bookings.filter(b => b.status === tab.id).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-sm transition-all whitespace-nowrap
                    ${isActive 
                      ? `bg-${tab.color}-600 text-black dark:text-white shadow-lg shadow-${tab.color}-500/30` 
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-500'
                    }`}
                >
                  <Icon size={14} />
                  <span className="font-medium text-xs md:text-sm">{tab.label}</span>
                  {count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      isActive 
                        ? 'bg-gray-300 dark:bg-white/20 text-black dark:text-white text-center' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookings found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  isExpanded={expandedCard === booking._id}
                  onToggleExpand={() => toggleCardExpand(booking._id)}
                  onViewDetails={handleViewDetails}
                  onEditStatus={handleEditStatus}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  statusTabs={statusTabs}
                />
              ))}
            </div>

            {/* Pagination - Responsive */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 transition-colors"
                >
                  <FiChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 transition-colors"
                >
                  Next
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Booking Details Modal */}
        <BookingDetails
          booking={selectedBooking}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          booking={selectedBooking}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

// Enhanced Booking Card Component
const BookingCard = ({ 
  booking, 
  isExpanded, 
  onToggleExpand, 
  onViewDetails, 
  onEditStatus,
  getStatusColor,
  getStatusIcon,
  statusTabs
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Main Card Content */}
      <div className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          
          {/* Service Image */}
          <div 
            onClick={() => onViewDetails(booking)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 cursor-pointer hover:opacity-80 transition"
          >
            {booking.service?.image ? (
              <img 
                src={booking.service.image} 
                alt={booking.service?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FiPackage size={20} />
              </div>
            )}
          </div>
          
          {/* Booking Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(booking.status)} {booking.status}
                  <span className="hidden xs:inline">{statusTabs.find(t => t.id === booking.status)?.label || booking.status.replace('_', ' ')}</span>
                </span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                #{booking._id?.slice(-6)}
              </span>
            </div>
            
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {booking.service?.title || 'Service'}
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FiUser size={12} />
                <span className="truncate max-w-[100px]">{booking.user?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FaRupeeSign size={10} />
                <span className="font-medium">₹{booking.sellingPrice || booking.price || '0'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => onViewDetails(booking)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="View Details"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => onEditStatus(booking)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Update Status"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={onToggleExpand}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title={isExpanded ? "Show Less" : "Show More"}
            >
              <FiChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-800"
          >
            <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 space-y-3">
              
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer</h4>
                  <p className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FiUser size={12} /> {booking.user?.name || 'N/A'}
                  </p>
                  <p className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                    <FiMail size={12} /> {booking.user?.email || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Delivery</h4>
                  {booking.personalDetail ? (
                    <>
                      <p className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiUser size={12} /> {booking.personalDetail.name || 'N/A'}
                      </p>
                      <p className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                        <FiPhone size={12} /> {booking.personalDetail.phone || 'N/A'}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">No delivery details</p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment</h4>
                  <p className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaRupeeSign size={10} /> Price: ₹{booking.price || '0'}
                  </p>
                  <p className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                    <FiHash size={12} /> TXN: {booking.transactionId?.slice(-8) || 'N/A'}
                  </p>
                </div>

                {/* Screenshot Preview */}
                {booking.screenshot && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Screenshot</h4>
                    <div 
                      onClick={() => onViewDetails(booking)}
                      className="relative inline-block cursor-pointer group"
                    >
                      <img 
                        src={booking.screenshot} 
                        alt="Payment"
                        className="w-16 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 20px;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`;
document.head.appendChild(style);

export default BookingStatus;