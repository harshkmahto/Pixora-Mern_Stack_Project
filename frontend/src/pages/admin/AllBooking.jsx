import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiPackage, FiUser, FiPhone, FiMapPin, FiMail,
  FiHash, FiImage, FiSearch, FiChevronDown,
  FiCalendar, FiCheckCircle, FiRefreshCw, FiX
} from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";
import BookingDetails from "../../components/service/BookingDetails";

// ── Status config ─────────────────────────────────────────
const statusConfig = {
  booking_created: { color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",       dot: "bg-gray-400" },
  pending:         { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-400" },
  approve:         { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",     dot: "bg-blue-500" },
  confirm:         { color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", dot: "bg-indigo-500" },
  completed:       { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  cancelled:       { color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",     dot: "bg-rose-500" },
  refund:          { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500" },
};
const getStatus = (s) => statusConfig[s] || { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dot: "bg-purple-500" };
const statusOptions = ["booking_created", "pending", "approve", "confirm", "completed", "cancelled", "refund"];

// ── Single Booking Card ───────────────────────────────────
const BookingCard = ({ booking, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const { color, dot } = getStatus(booking.status);

  const handleImageClick = (e) => {
    e.stopPropagation();
    onClick(booking);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
      expanded
        ? "border-purple-300 dark:border-purple-700 shadow-md"
        : "border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800"
    }`}>

      {/* ── Collapsed Row ── */}
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 p-4 text-left">

        {/* Thumbnail - Click to open details */}
        <div 
          onClick={handleImageClick}
          className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 cursor-pointer hover:opacity-80 transition"
        >
          {booking.service?.image
            ? <img src={booking.service.image} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-400"><FiPackage size={18} /></div>}
        </div>

        {/* Title + user */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{booking.service?.title || "—"}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{booking.user?.name} · {booking.user?.email}</p>
        </div>

        {/* Price */}
        <span className="hidden sm:flex items-center gap-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
          <FaRupeeSign size={11} />{booking.sellingPrice}
        </span>

        {/* Status badge */}
        <span className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {booking.status.replace("_", " ")}
        </span>
        <span className={`md:hidden w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />

        <FiChevronDown size={15} className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* ── Expanded Content ── */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[800px]" : "max-h-0"}`}>
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4 space-y-5">

          {/* Service + Date */}
          <div className="flex gap-4 items-start">
            {booking.service?.image && (
              <div 
                onClick={() => onClick(booking)}
                className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition"
              >
                <img src={booking.service.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">{booking.service?.category}</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{booking.service?.title}</p>
              <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <FiCalendar size={11} />
                {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-3 gap-4">

            {/* Payment */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment</p>
              <div className="flex items-center gap-1.5">
                <FaRupeeSign size={12} className="text-purple-400" />
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{booking.sellingPrice}</span>
              </div>
              <InfoRow icon={FiHash} label={booking.transactionId || "N/A"} />
            </div>

            {/* User */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">User</p>
              <InfoRow icon={FiUser} label={booking.user?.name} />
              <InfoRow icon={FiMail} label={booking.user?.email} />
            </div>

            {/* Customer Detail */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Delivery To</p>
              <InfoRow icon={FiUser} label={booking.personalDetail?.name} />
              <InfoRow icon={FiPhone} label={booking.personalDetail?.phone} />
              <InfoRow icon={FiMapPin} label={`${booking.personalDetail?.city}, ${booking.personalDetail?.state}`} />
            </div>
          </div>

          {/* Screenshot */}
          {booking.screenshot && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiImage size={12} /> Payment Screenshot
              </p>
              <div 
                onClick={() => onClick(booking)}
                className="relative inline-block cursor-pointer hover:opacity-80 transition"
              >
                <img src={booking.screenshot} alt="screenshot" className="w-36 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm object-cover" />
                <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  <FiCheckCircle size={10} /> Verified
                </span>
              </div>
            </div>
          )}

          {/* View Details Button */}
          <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => onClick(booking)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1"
            >
              View Full Details <FiChevronDown size={14} className="rotate-[-90deg]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2">
    <Icon size={12} className="text-purple-400 flex-shrink-0" />
    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{label || "—"}</span>
  </div>
);

// ── Stats ─────────────────────────────────────────────────
const StatCard = ({ label, value, colorClass }) => (
  <div className={`rounded-xl p-4 ${colorClass}`}>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs font-medium opacity-75 uppercase tracking-wide mt-0.5">{label}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────
const AllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest(SummaryApi.bookings.getAll);
      setBookings(res.bookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const allStatuses = ["all", ...statusOptions];

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || b.service?.title?.toLowerCase().includes(q)
      || b.user?.name?.toLowerCase().includes(q)
      || b.user?.email?.toLowerCase().includes(q)
      || b.transactionId?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{bookings.length} total bookings</p>
          </div>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 px-3 py-2 rounded-xl transition"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total" value={bookings.length} colorClass="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" />
          <StatCard label="Pending" value={bookings.filter(b => b.status === "pending").length} colorClass="bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400" />
          <StatCard label="Completed" value={bookings.filter(b => b.status === "completed").length} colorClass="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Cancelled" value={bookings.filter(b => b.status === "cancelled").length} colorClass="bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400" />
        </div>

        {/* Search + Filter */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service, user, or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="sm:w-48 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All Status" : s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
        </div>

        {/* Booking List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <FiPackage className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No bookings found</p>
            {(search || filter !== "all") && (
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="text-xs text-purple-500 mt-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onClick={openBookingDetails}
              />
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        <BookingDetails 
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

      </div>
    </div>
  );
};

export default AllBooking;