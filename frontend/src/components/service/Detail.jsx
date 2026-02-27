import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiHome } from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

const Detail = () => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSelectedDetail = async () => {
    try {
      const res = await apiRequest(SummaryApi.personalDetails.getAll);
      // Only take the selected one
      const selected = res.details.find((d) => d.isSelected);
      setDetail(selected || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedDetail();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <FiUser className="w-16 h-16 mb-3 opacity-30" />
        <p className="text-lg font-medium">No selected detail</p>
        <p className="text-sm mt-1">Please select a detail from your personal details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-purple-600 rounded-full" /> Selected Personal Detail
        </h2>

        {/* Address Type */}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full mb-4 capitalize">
          <FiHome size={12} /> {detail.addressType}
        </span>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
          <InfoRow icon={FiUser} label={detail.name} />
          <InfoRow icon={FiMail} label={detail.email} />
          <InfoRow icon={FiPhone} label={detail.phone} />
          <InfoRow icon={FiBriefcase} label={detail.profession} />
          <InfoRow icon={FiMapPin} label={`${detail.city}, ${detail.state} — ${detail.pin}`} full />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, full }) => (
  <div className={`flex items-center gap-2 ${full ? "sm:col-span-2" : ""}`}>
    <Icon size={14} className="text-purple-400 flex-shrink-0" />
    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{label}</span>
  </div>
);

export default Detail;