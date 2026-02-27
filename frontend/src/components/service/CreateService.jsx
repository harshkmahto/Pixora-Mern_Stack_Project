import React, { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

const CreateService = () => {
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

  // Handle normal input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Feature handling
  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Basic validation
    if (Number(formData.sellingPrice) > Number(formData.price)) {
      return alert("Selling price cannot be greater than original price.");
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("sellingPrice", formData.sellingPrice);
      data.append("status", formData.status);
      data.append("features", JSON.stringify(features));
      if (image) data.append("image", image);

      const response = await apiRequest(
        SummaryApi.services.createService,
        data
      );

      alert(response.message);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        sellingPrice: "",
        status: "active",
      });

      setFeatures([""]);
      setImage(null);
      setPreview(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Create New Service
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Category & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ✅ Price Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Original Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Selling Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Service Image
            </label>

            {!preview && (
              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <FiUpload size={28} className="text-gray-500 mb-2" />
                <span className="text-gray-500">
                  Click to upload image
                </span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {preview && (
              <div className="relative w-40 mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="block mb-3 font-medium text-gray-700">
              Features
            </label>

            {features.map((feature, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleFeatureChange(index, e.target.value)
                  }
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addFeature}
              className="mt-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Add Feature
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Creating..." : "Create Service"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateService;