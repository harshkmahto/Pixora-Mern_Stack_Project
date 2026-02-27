import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiPackage, FiUser, FiPhone, FiMapPin, FiCalendar,
  FiChevronDown, FiHash, FiImage, FiCheckCircle
} from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

const statusConfig = {
  completed: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  cancelled:  { color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", dot: "bg-rose-500" },
  pending:    { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-400" },
  approve:    { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-500" },
};

const getStatus = (status) =>
  statusConfig[status] || { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dot: "bg-purple-500" };

const BookingCard = ({ booking }) => {
  const [expanded, setExpanded] = useState(false);
  const { color, dot } = getStatus(booking.status);

  return (
    <div className={`bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
      expanded ? "border-purple-300 dark:border-purple-700 shadow-md" : "border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800"
    }`}>

      {/* Collapsed Row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Service Image */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {booking.service?.image ? (
            <img src={booking.service.image} alt={booking.service.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiPackage size={20} />
            </div>
          )}
        </div>

        {/* Title + Date */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {booking.service?.title || "Service"}
          </h3>
          <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            <FiCalendar size={11} />
            {new Date(booking.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </p>
        </div>

        {/* Status + Chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {booking.status}
          </span>
          <span className={`sm:hidden w-2.5 h-2.5 rounded-full ${dot}`} />
          <FiChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[1000px]" : "max-h-0"}`}>
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 pb-5 pt-4 space-y-4">

          {/* Status (mobile visible here) */}
          <div className="sm:hidden">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {booking.status}
            </span>
          </div>

          {/* Service Image (larger) + Details */}
          <div className="flex gap-4">
            {booking.service?.image && (
              <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <img src={booking.service.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold uppercase tracking-wide">
                {booking.service?.category}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">
                {booking.service?.title}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Payment Info */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Payment</p>
              <InfoRow
                icon={FaRupeeSign}
                label="Amount Paid"
                value={`₹${booking.sellingPrice}`}
                valueClass="text-emerald-600 dark:text-emerald-400 font-bold"
              />
              <InfoRow
                icon={FiHash}
                label="Transaction ID"
                value={booking.transactionId || "N/A"}
              />
            </div>

            {/* Personal Detail */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery To</p>
              <InfoRow icon={FiUser} label={booking.personalDetail?.name} />
              <InfoRow icon={FiPhone} label={booking.personalDetail?.phone} />
              <InfoRow
                icon={FiMapPin}
                label={`${booking.personalDetail?.city}, ${booking.personalDetail?.state}`}
              />
            </div>
          </div>

          {/* Screenshot */}
          {booking.screenshot && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiImage size={12} /> Payment Screenshot
              </p>
              <div className="relative w-36">
                <img
                  src={booking.screenshot}
                  alt="Payment Screenshot"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
                />
                <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  <FiCheckCircle size={10} /> Verified
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, valueClass = "text-gray-700 dark:text-gray-300" }) => (
  <div className="flex items-start gap-2">
    <Icon size={13} className="text-purple-400 flex-shrink-0 mt-0.5" />
    <div className="min-w-0">
      {value ? (
        <>
          <p className="text-xs text-gray-400">{label}</p>
          <p className={`text-sm font-medium truncate ${valueClass}`}>{value}</p>
        </>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{label}</p>
      )}
    </div>
  </div>
);

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiRequest(SummaryApi.bookings.getMy);
        setBookings(res.bookings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statuses = ["all", "pending", "approve", "completed", "cancelled"];

  const filtered = filter === "all"
    ? bookings
    : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-all ${
                  filter === s
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-purple-300"
                }`}
              >
                {s}
                {s !== "all" && (
                  <span className="ml-1 opacity-70">
                    ({bookings.filter((b) => b.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <FiPackage className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No bookings found</p>
            {filter !== "all" && (
              <button onClick={() => setFilter("all")} className="text-xs text-purple-500 mt-2 hover:underline">
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBooking;