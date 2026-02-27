import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const AllServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const discount =
    service.price > 0
      ? Math.round(((service.price - service.sellingPrice) / service.price) * 100)
      : 0;

  return (
    <div
      onClick={() => navigate(`/service/${service._id}`)}
      className="group cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {discount}% OFF
          </span>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm shadow">
          {service.category}
        </span>

        {/* View arrow on hover */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <FiArrowRight size={14} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-1.5">

        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          {service.title}
        </h3>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-400 line-through">₹{service.price}</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{service.sellingPrice}</span>
          {discount > 0 && (
            <span className="ml-auto text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              Save ₹{service.price - service.sellingPrice}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default AllServiceCard;