import React, { useState, useEffect } from 'react';
import { 
  FiImage, 
  FiVideo, 
  FiEdit, 
  FiLayout, 
  FiStar, 
  FiClock, 
  FiUsers,
  FiArrowRight,
  FiFilter,
  FiSearch,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiRequest from '../../utils/apiRequest';
import SummaryApi from '../../common';
import { useNavigate } from 'react-router-dom';

const ServicesHero = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const navigate = useNavigate();

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(SummaryApi.services.getPublicServices);
      setServices(response.services || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
                <div className="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
                <div className="h-8 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-white/10 rounded w-20"></div>
                  <div className="h-10 bg-white/10 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchServices}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-12 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto">
          {/* Header Content */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              Our Creative{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Services
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-black dark:text-gray-300 max-w-3xl mx-auto"
            >
              Transform your content with our professional creative services. 
              Choose from a variety of packages tailored to your needs.
            </motion.p>
          </div>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-white mb-2">No services available</h3>
              <p className="text-gray-400">Check back later for our latest offerings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredId(service._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleServiceClick(service._id)}
                    className="cursor-pointer group"
                  >
                    {/* Service Card */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                      
                      {/* Service Image */}
                      <div className="relative h-48 overflow-hidden">
                        {service.image ? (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <FiImage className="text-5xl text-black dark:text-white" />
                          </div>
                        )}
                        
                        {/* Price Tag */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1">
                          {service.sellingPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">₹{service.sellingPrice}</span>
                              {service.price && service.price > service.sellingPrice && (
                                <span className="text-gray-400 text-sm line-through">₹{service.price}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-white font-bold">₹{service.price}</span>
                          )}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1">
                          <span className="text-white text-sm capitalize">{service.category || 'Service'}</span>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-purple-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-800 dark:text-gray-300 mb-4 line-clamp-2">{service.description}</p>
                        
                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-black dark:text-gray-300">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                <span className="line-clamp-1">{feature}</span>
                              </div>
                            ))}
                            {service.features.length > 3 && (
                              <p className="text-sm text-purple-400">+{service.features.length - 3} more features</p>
                            )}
                          </div>
                        )}

                        {/* View Details Button */}
                        <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold 
                          hover:from-purple-600 hover:to-pink-600 transition-all transform group-hover:scale-105 flex items-center justify-center gap-2">
                          View Details
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesHero;