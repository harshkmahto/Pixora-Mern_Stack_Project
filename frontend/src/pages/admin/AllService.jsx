import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";
import ServiceCard from "../../components/service/ServiceCard";
import CreateService from "../../components/service/CreateService"; // your existing component

const AllService = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest(SummaryApi.services.getAllServices);
        setServices(response.services);
        setFiltered(response.services);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let temp = [...services];
    if (search) temp = temp.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") temp = temp.filter((s) => s.status === statusFilter);
    setFiltered(temp);
  }, [search, statusFilter, services]);

  const handleDeleteLocal = (id) => setServices(services.filter((s) => s._id !== id));

  const handleServiceCreated = (newService) => {
    setServices((prev) => [newService, ...prev]);
    setShowPopup(false);
  };

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === "active").length;
  const inactiveServices = services.filter((s) => s.status === "inactive").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading services...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Services</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage and monitor all your services</p>
          </div>
          <button
            onClick={() => setShowPopup(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Service
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", value: totalServices, color: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
            { label: "Active", value: activeServices, color: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
            { label: "Inactive", value: inactiveServices, color: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
          ].map(({ label, value, color, dot }) => (
            <div
              key={label}
              className={`rounded-xl p-4 ${color} flex flex-col gap-1`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-xs font-medium uppercase tracking-wide opacity-75">{label}</span>
              </div>
              <span className="text-3xl font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-44 px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <p className="text-sm font-medium">No services found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service) => (
              <ServiceCard key={service._id} service={service} onDelete={handleDeleteLocal} />
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setShowPopup(false)}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Service</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Popup Body — your existing CreateService component */}
            <div className="px-6 py-4">
              <CreateService onSuccess={handleServiceCreated} onCancel={() => setShowPopup(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllService;