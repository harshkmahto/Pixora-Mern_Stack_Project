import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

// ✅ Works as both a standalone page (/admin/update-service/:id)
//    AND as a popup component (pass service prop from ServiceCard)
const UpdateService = ({ service: serviceProp = null, onSuccess = null, onCancel = null }) => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  // If used as popup, use service prop directly; else fetch by route id
  const isPopup = !!serviceProp;
  const id = serviceProp?._id || routeId;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    sellingPrice: "",
    status: "active",
  });

  const [features, setFeatures] = useState([""]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isPopup); // skip fetching if prop passed

  // Populate form from prop (popup mode)
  useEffect(() => {
    if (isPopup && serviceProp) {
      setFormData({
        title: serviceProp.title || "",
        description: serviceProp.description || "",
        category: serviceProp.category || "",
        price: serviceProp.price || "",
        sellingPrice: serviceProp.sellingPrice || "",
        status: serviceProp.status || "active",
      });
      setFeatures(serviceProp.features?.length ? serviceProp.features : [""]);
      if (serviceProp.image) setPreview(serviceProp.image);
    }
  }, [isPopup, serviceProp]);

  // Fetch from API (standalone page mode)
  useEffect(() => {
    if (isPopup) return;
    const fetchService = async () => {
      try {
        const response = await apiRequest(SummaryApi.services.getAllServices);
        const service = response.services.find((s) => s._id === id);
        if (!service) { alert("Service not found"); navigate("/admin"); return; }
        setFormData({
          title: service.title || "",
          description: service.description || "",
          category: service.category || "",
          price: service.price || "",
          sellingPrice: service.sellingPrice || "",
          status: service.status || "active",
        });
        setFeatures(service.features?.length ? service.features : [""]);
        if (service.image) setPreview(service.image);
      } catch (error) {
        alert(error.message);
      } finally {
        setFetching(false);
      }
    };
    fetchService();
  }, [id, navigate, isPopup]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index) => setFeatures(features.filter((_, i) => i !== index));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const removeImage = () => { setImage(null); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.sellingPrice) > Number(formData.price))
      return alert("Selling price cannot be greater than original price.");

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("sellingPrice", formData.sellingPrice);
      data.append("status", formData.status);
      data.append("features", JSON.stringify(features.filter((f) => f.trim() !== "")));
      if (image) data.append("image", image);
      else if (!preview) data.append("removeImage", "true");

      const response = await apiRequest(SummaryApi.services.updateService(id), data);
      alert(response.message);

      if (isPopup && onSuccess) onSuccess(response.service);
      else navigate("/admin");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading service...</span>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div>
        <label className={labelClass}>Service Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Logo Design" className={inputClass} />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows="3" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the service..." className={inputClass} />
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Design" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Original Price (₹)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="0" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Selling Price (₹)</label>
          <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required placeholder="0" className={inputClass} />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Service Image</label>
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition bg-gray-50 dark:bg-gray-800/50">
            <FiUpload size={22} className="text-gray-400 mb-1.5" />
            <span className="text-sm text-gray-400">Click to upload image</span>
            <input type="file" onChange={handleImageChange} className="hidden" />
          </label>
        ) : (
          <div className="relative w-36 mt-2">
            <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded-lg shadow border border-gray-100 dark:border-gray-700" />
            <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow transition">
              <FiX size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <label className={labelClass}>Features</label>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
                className={inputClass}
              />
              {features.length > 1 && (
                <button type="button" onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition text-sm font-medium">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addFeature}
          className="mt-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          + Add Feature
        </button>
      </div>

      {/* Actions */}
      <div className={`flex gap-3 pt-2 ${isPopup ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
        {isPopup && onCancel && (
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-60">
          {loading ? "Updating..." : "Update Service"}
        </button>
      </div>

    </form>
  );

  // Standalone page mode wraps in page layout
  if (!isPopup) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Update Service</h2>
          {formContent}
        </div>
      </div>
    );
  }

  // Popup mode — just returns the form
  return formContent;
};

export default UpdateService;