import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiHome, FiTrash2, FiCheck, FiPlus, FiX } from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

const fields = [
  { name: "name", placeholder: "Full Name", icon: FiUser, type: "text" },
  { name: "email", placeholder: "Email Address", icon: FiMail, type: "email" },
  { name: "phone", placeholder: "Phone Number", icon: FiPhone, type: "tel" },
  { name: "city", placeholder: "City", icon: FiMapPin, type: "text" },
  { name: "state", placeholder: "State", icon: FiMapPin, type: "text" },
  { name: "pin", placeholder: "PIN Code", icon: FiMapPin, type: "text" },
  { name: "profession", placeholder: "Profession", icon: FiBriefcase, type: "text" },
];

const initialForm = {
  name: "", email: "", phone: "", city: "",
  state: "", pin: "", profession: "", addressType: "home",
};

const PersonalDetails = () => {
  const [details, setDetails] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await apiRequest(SummaryApi.personalDetails.getAll);
      setDetails(res.details);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest(SummaryApi.personalDetails.create, formData);
      setFormOpen(false);
      setFormData(initialForm);
      fetchDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = async (id) => {
    await apiRequest(SummaryApi.personalDetails.select(id));
    fetchDetails();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this detail?")) return;
    await apiRequest(SummaryApi.personalDetails.delete(id));
    fetchDetails();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your saved addresses & info</p>
          </div>
          <button
            onClick={() => { setFormOpen(!formOpen); setFormData(initialForm); }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-purple-500/20"
          >
            {formOpen ? <FiX size={15} /> : <FiPlus size={15} />}
            {formOpen ? "Cancel" : "Add Detail"}
          </button>
        </div>

        {/* Add Form */}
        {formOpen && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-600 rounded-full" />
              New Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {fields.map(({ name, placeholder, icon: Icon, type }) => (
                  <div key={name} className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                ))}

                {/* Address Type */}
                <div className="relative">
                  <FiHome size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition appearance-none"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-purple-500/20 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Detail"}
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : details.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <FiUser className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No saved details yet</p>
            <p className="text-xs mt-1">Click "Add Detail" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {details.map((item) => (
              <div
                key={item._id}
                className={`relative bg-white dark:bg-gray-900 border rounded-2xl p-5 transition-all duration-200 ${
                  item.isSelected
                    ? "border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20"
                    : "border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800"
                }`}
              >
                {/* Selected Badge */}
                {item.isSelected && (
                  <span className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full">
                    <FiCheck size={11} /> Selected
                  </span>
                )}

                {/* Address Type Tag */}
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full mb-3 capitalize">
                  <FiHome size={11} /> {item.addressType}
                </span>

                {/* Info Grid */}
                <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6 mb-4">
                  <InfoRow icon={FiUser} label={item.name} />
                  <InfoRow icon={FiMail} label={item.email} />
                  <InfoRow icon={FiPhone} label={item.phone} />
                  <InfoRow icon={FiBriefcase} label={item.profession} />
                  <InfoRow
                    icon={FiMapPin}
                    label={`${item.city}, ${item.state} — ${item.pin}`}
                    full
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {!item.isSelected && (
                    <button
                      onClick={() => handleSelect(item._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition"
                    >
                      <FiCheck size={13} /> Select
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-3 py-1.5 rounded-lg transition ml-auto"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, full }) => (
  <div className={`flex items-center gap-2 ${full ? "sm:col-span-2" : ""}`}>
    <Icon size={13} className="text-purple-400 flex-shrink-0" />
    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{label}</span>
  </div>
);

export default PersonalDetails;