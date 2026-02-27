import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import SummaryApi from "../common";
import apiRequest from "../utils/apiRequest";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await apiRequest(SummaryApi.services.getPublicServiceById(id));
        setService(response.service);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading service...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 gap-4">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Service not found.</p>
        <button onClick={() => navigate(-1)} className="text-purple-600 hover:underline text-sm">← Go back</button>
      </div>
    );
  }

  const discount = service.price > 0
    ? Math.round(((service.price - service.sellingPrice) / service.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Services
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">

          {/* TOP: Image + Info */}
          <div className="grid md:grid-cols-2 gap-0">

            {/* Left — Image */}
            <div className="relative h-72 md:h-full min-h-72 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Right — Details */}
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div className="space-y-4">

                {/* Category */}
                <span className="inline-block text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full uppercase tracking-wide">
                  {service.category}
                </span>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
                  {service.title}
                </h1>

                {/* Pricing */}
                <div className="flex items-end gap-3 pt-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 mb-1">Original Price</span>
                    <span className="flex items-center text-gray-400 line-through text-base">
                      <FaRupeeSign size={13} className="mr-0.5" />{service.price}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 mx-1" />
                  <div className="flex flex-col">
                    <span className="text-xs text-purple-500 mb-1">You Pay</span>
                    <span className="flex items-center text-2xl font-bold text-purple-600 dark:text-purple-400">
                      <FaRupeeSign size={18} className="mr-0.5" />{service.sellingPrice}
                    </span>
                  </div>
                  {discount > 0 && (
                    <span className="mb-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full font-semibold">
                      Save ₹{service.price - service.sellingPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Book Now Button */}
              <button
  onClick={() => navigate(`/checkout/${service._id}`)}
  className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white py-3.5 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20"
>
  <FaRupeeSign size={14} />
  Book Now for ₹{service.sellingPrice}
</button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 mx-6" />

          {/* BOTTOM: Description + Features */}
          <div className="p-6 md:p-8 space-y-8">

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-600 rounded-full inline-block" />
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                {service.description}
              </p>
            </div>

            {/* Features */}
            {service.features?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-purple-600 rounded-full inline-block" />
                  What's Included
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl text-sm"
                    >
                      <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck size={11} className="text-white" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Book Button */}
           <button
  onClick={() => navigate(`/checkout/${service._id}`)}
  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white py-4 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20"
>
  <FaRupeeSign size={14} />
  Book Now for ₹{service.sellingPrice}
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;