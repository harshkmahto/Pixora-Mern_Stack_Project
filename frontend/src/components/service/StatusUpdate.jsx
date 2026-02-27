import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiRefreshCw,
  FiPackage,
  FiUser,
  FiHash,
  FiDollarSign,
  FiDownload,
  FiEye,
  FiCreditCard
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";
import apiRequest from '../../utils/apiRequest';
import SummaryApi from '../../common';

const StatusUpdate = ({ booking, isOpen, onClose, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Status options for dropdown
  const statusOptions = [
    { id: 'booking_created', label: 'Booking Created', color: 'blue', icon: FiClock },
    { id: 'pending', label: 'Pending', color: 'yellow', icon: FiAlertCircle },
    { id: 'approved', label: 'Approved', color: 'green', icon: FiCheckCircle },
    { id: 'confirm', label: 'Confirmed', color: 'green', icon: FiCheckCircle },
    { id: 'completed', label: 'Completed', color: 'emerald', icon: FiCheckCircle },
    { id: 'cancelled', label: 'Cancelled', color: 'red', icon: FiX },
    { id: 'refund', label: 'Refunded', color: 'purple', icon: FiRefreshCw },
  ];

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status || '');
      setRemark('');
      setError('');
    }
  }, [booking]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedStatus) {
    setError('Please select a status');
    return;
  }

  // Don't allow update if status hasn't changed
  if (selectedStatus === booking.status) {
    setError('New status must be different from current status');
    return;
  }

  try {
    setLoading(true);
    setError('');
    await onStatusUpdate(booking._id, selectedStatus, remark);
    // Don't call onClose() here - let the parent component handle it after successful update
  } catch (err) {
    setError(err.message || 'Failed to update status');
  } finally {
    setLoading(false);
  }
};

  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `screenshot-${booking._id.slice(-6)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      booking_created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approve: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      confirm: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      refund: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-200 dark:border-gray-800">
              
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Update Booking Status
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                
                {/* Booking Info Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    {booking.service?.image ? (
                      <img 
                        src={booking.service.image} 
                        alt={booking.service?.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <FiPackage className="text-gray-400" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {booking.service?.title || 'Service'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FiUser className="text-gray-500" size={14} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.user?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FiHash className="text-gray-500" size={14} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Booking ID: #{booking._id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Status Badge */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)}`}>
                      {statusOptions.find(s => s.id === booking.status)?.label || booking.status}
                    </span>
                  </div>
                </div>

                {/* Payment Details Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiCreditCard size={16} />
                    Payment Details
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount Paid:</span>
                      <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <FaRupeeSign size={14} />
                        {booking.sellingPrice || booking.price || '0'}
                      </span>
                    </div>

                    {/* Transaction ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {booking.transactionId || 'N/A'}
                      </span>
                    </div>

                    {/* Payment Screenshot */}
                    {booking.screenshot && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Payment Screenshot:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowImagePreview(!showImagePreview)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadImage(booking.screenshot)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                              title="Download"
                            >
                              <FiDownload size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Image Preview */}
                        <AnimatePresence>
                          {showImagePreview && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 overflow-hidden"
                            >
                              <img 
                                src={booking.screenshot} 
                                alt="Payment Screenshot"
                                className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Thumbnail */}
                        {!showImagePreview && (
                          <img 
                            src={booking.screenshot} 
                            alt="Payment Screenshot Thumbnail"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition"
                            onClick={() => setShowImagePreview(true)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Update Status</h3>
                  
                  {/* Status Selection Dropdown */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select New Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a status</option>
                      {statusOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remark/Note */}
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Add Remark (Optional)
                    </label>
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows="3"
                      placeholder="Add any notes or remarks about this status update..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedStatus || selectedStatus === booking.status}
                    className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin" size={16} />
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusUpdate;