import React from 'react';
import { FaRupeeSign } from "react-icons/fa";
import {
  FiUser, FiPhone, FiMapPin, FiMail,
  FiHash, FiImage, FiCalendar, FiX,
  FiPackage, FiCheckCircle, FiClock, FiCreditCard
} from "react-icons/fi";

const BookingDetails = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      booking_created: "bg-gray-100 text-gray-700",
      pending: "bg-amber-100 text-amber-700",
      approve: "bg-blue-100 text-blue-700",
      confirm: "bg-indigo-100 text-indigo-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-rose-100 text-rose-700",
      refund: "bg-orange-100 text-orange-700",
    };
    return colors[status] || "bg-purple-100 text-purple-700";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FiPackage className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Booking Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {booking._id?.slice(-8)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition"
            >
              <FiX size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full capitalize ${getStatusColor(booking.status)}`}>
                {booking.status.replace("_", " ")}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <FiCalendar size={12} />
                Booked on {formatDate(booking.createdAt)}
              </span>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiPackage size={16} className="text-purple-500" />
                Service Information
              </h3>
              <div className="flex gap-4">
                {booking.service?.image && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={booking.service.image} 
                      alt={booking.service?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                      {booking.service?.category}
                    </span>
                    <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                      {booking.service?.title}
                    </p>
                  </div>
                  {booking.service?.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.service.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUser size={16} className="text-purple-500" />
                User Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <DetailItem icon={FiUser} label="Name" value={booking.user?.name} />
                <DetailItem icon={FiMail} label="Email" value={booking.user?.email} />
                {booking.user?.phone && (
                  <DetailItem icon={FiPhone} label="Phone" value={booking.user?.phone} />
                )}
              </div>
            </div>

            {/* Personal Details */}
            {booking.personalDetail && (
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin size={16} className="text-purple-500" />
                  Delivery Information
                </h3>
                <div className="space-y-3">
                  <DetailItem icon={FiUser} label="Contact Person" value={booking.personalDetail.name} />
                  <DetailItem icon={FiPhone} label="Contact Number" value={booking.personalDetail.phone} />
                  <DetailItem icon={FiMapPin} label="Address" value={booking.personalDetail.address} />
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem icon={FiMapPin} label="City" value={booking.personalDetail.city} />
                    <DetailItem icon={FiMapPin} label="State" value={booking.personalDetail.state} />
                  </div>
                  {booking.personalDetail.pincode && (
                    <DetailItem icon={FiHash} label="Pincode" value={booking.personalDetail.pincode} />
                  )}
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiCreditCard size={16} className="text-purple-500" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Selling Price</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <FaRupeeSign size={14} />
                    {booking.sellingPrice}
                  </span>
                </div>
                <DetailItem icon={FiHash} label="Transaction ID" value={booking.transactionId} />
                {booking.paymentMethod && (
                  <DetailItem icon={FiCreditCard} label="Payment Method" value={booking.paymentMethod} />
                )}
              </div>

              {/* Screenshot */}
              {booking.screenshot && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                    <FiImage size={12} /> Payment Screenshot
                  </p>
                  <div className="relative inline-block">
                    <img 
                      src={booking.screenshot} 
                      alt="payment screenshot" 
                      className="max-w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      style={{ maxHeight: '200px' }}
                    />
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                      <FiCheckCircle size={10} /> Verified
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiClock size={16} className="text-purple-500" />
                Additional Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value || "—"}</p>
    </div>
  </div>
);

export default BookingDetails;