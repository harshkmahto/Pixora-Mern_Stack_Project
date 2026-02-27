import React, { useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";
import UpdateService from "../../components/service/UpdateService"; // your existing component

const ServiceCard = ({ service, onDelete }) => {
  const navigate = useNavigate();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;
    try {
      const response = await apiRequest(SummaryApi.services.deleteService(service._id));
      alert(response.message);
      onDelete(service._id);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5 flex flex-col">

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Status Badge over image */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
              service.status === "active"
                ? "bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300"
                : "bg-rose-100/90 text-rose-700 dark:bg-rose-900/80 dark:text-rose-300"
            }`}
          >
            {service.status}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">

          {/* Category */}
          <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
            {service.category}
          </span>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
            {service.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-sm text-gray-400 line-through">₹{service.price}</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{service.sellingPrice}</span>
            {service.price > service.sellingPrice && (
              <span className="text-xs bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                {Math.round(((service.price - service.sellingPrice) / service.price) * 100)}% off
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-1">
            <button
              onClick={() => setShowUpdatePopup(true)}
              title="Edit"
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition"
            >
              <FiEdit size={14} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              title="Delete"
              className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-3 py-1.5 rounded-lg transition"
            >
              <FiTrash2 size={14} />
              Delete
            </button>
          </div>

        </div>
      </div>

      {/* Update Popup Modal */}
      {showUpdatePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setShowUpdatePopup(false)}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Update Service</h2>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.title}</p>
              </div>
              <button
                onClick={() => setShowUpdatePopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body — your existing UpdateService component */}
            <div className="px-6 py-4">
              <UpdateService
                service={service}
                onSuccess={() => setShowUpdatePopup(false)}
                onCancel={() => setShowUpdatePopup(false)}
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;