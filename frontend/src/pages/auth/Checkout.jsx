import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiArrowLeft, FiUser, FiPhone, FiMapPin, FiUpload,
  FiX, FiCheck, FiAlertCircle, FiImage
} from "react-icons/fi";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [detail, setDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Validation
  const hasTransaction = transactionId.trim().length > 0;
  const hasScreenshot = !!screenshot;
  const canSubmit = hasTransaction && hasScreenshot;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await apiRequest(SummaryApi.services.getPublicServiceById(id));
        setService(serviceRes.service);
        const detailRes = await apiRequest(SummaryApi.personalDetails.getAll);
        const selected = detailRes.details.find((d) => d.isSelected);
        setDetail(selected);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const handleConfirmBooking = async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("serviceId", id);
      formData.append("personalDetailId", detail._id);
      formData.append("transactionId", transactionId);
      if (screenshot) formData.append("screenshot", screenshot);
      const response = await apiRequest(SummaryApi.bookings.create, formData);
      alert(response.message);
      setShowModal(false);
      navigate("/my-booking");
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const discount = service
    ? Math.round(((service.price - service.sellingPrice) / service.price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading checkout...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 gap-3">
        <p className="text-gray-500 dark:text-gray-400">Service not found.</p>
        <button onClick={() => navigate(-1)} className="text-purple-600 text-sm hover:underline">← Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
        >
          <FiArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {/* Service Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-52 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wide">
                  {service.category}
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2">{service.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{service.description}</p>
              </div>
            </div>

            {/* Delivery Detail */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-purple-600 rounded-full" />
                  Delivery Details
                </h2>
                {!detail && (
                  <button
                    onClick={() => navigate("/personal-details")}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    + Add Details
                  </button>
                )}
              </div>

              {detail ? (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl p-4 space-y-2.5">
                  <InfoRow icon={FiUser} label={detail.name} />
                  <InfoRow icon={FiPhone} label={detail.phone} />
                  <InfoRow icon={FiMapPin} label={`${detail.city}, ${detail.state} — ${detail.pin}`} />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm">
                  <FiAlertCircle size={16} />
                  Please select a personal detail before proceeding.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Price Summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm h-fit sticky top-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-600 rounded-full" />
              Price Summary
            </h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Original Price</span>
                <span className="flex items-center gap-0.5"><FaRupeeSign size={12} />{service.price}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({discount}%)</span>
                  <span>- ₹{service.price - service.sellingPrice}</span>
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>Total Pay</span>
                <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400">
                  <FaRupeeSign size={14} />{service.sellingPrice}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              disabled={!detail}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-purple-500/20"
            >
              <FaRupeeSign size={13} />
              Pay ₹{service.sellingPrice} Now
            </button>

            {!detail && (
              <p className="text-xs text-center text-rose-500 mt-2">Add delivery details to proceed</p>
            )}
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Complete Payment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <FiX size={17} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="w-44 h-44 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400">
                  <FiImage size={32} className="opacity-40" />
                  <span className="text-xs">QR Code Here</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  UPI: <span className="font-semibold text-purple-600 dark:text-purple-400">yourupi@bank</span>
                </p>
                <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full mt-2">
                  <FaRupeeSign size={12} />
                  <span className="font-bold text-sm">{service.sellingPrice}</span>
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Transaction ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your UPI transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                    hasTransaction
                      ? "border-emerald-400 dark:border-emerald-600 focus:ring-emerald-500/30"
                      : "border-gray-200 dark:border-gray-700 focus:ring-purple-500"
                  }`}
                />
                {!hasTransaction && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
                    <FiAlertCircle size={12} /> Transaction ID is required
                  </p>
                )}
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Payment Screenshot <span className="text-rose-500">*</span>
                </label>

                {!screenshotPreview ? (
                  <label className={`flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-xl cursor-pointer transition ${
                    hasScreenshot
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-purple-400 dark:hover:border-purple-600"
                  }`}>
                    <FiUpload size={22} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload screenshot</span>
                    <span className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={screenshotPreview} alt="Screenshot" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute top-2 right-2 w-7 h-7 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow transition"
                    >
                      <FiX size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full">
                      <FiCheck size={11} /> Uploaded
                    </div>
                  </div>
                )}

                {!hasScreenshot && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
                    <FiAlertCircle size={12} /> Payment screenshot is required
                  </p>
                )}
              </div>

              {/* Info note */}
              {!canSubmit && (
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl text-xs">
                  <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  Please enter your Transaction ID and upload a payment screenshot to confirm your booking.
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={!canSubmit || submitting}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-purple-500/20"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Confirm Booking
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5">
    <Icon size={14} className="text-purple-500 flex-shrink-0" />
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
  </div>
);

export default Checkout;