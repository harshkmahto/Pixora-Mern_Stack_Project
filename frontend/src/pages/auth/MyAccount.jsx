import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Edit2, 
  Save, 
  X, 
  Camera,
  Loader,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const MyAccount = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile: null
  });

  // Preview for new profile image
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest(SummaryApi.auth.getProfile);
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          profile: null
        });
        setImagePreview(data.user.profile || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear success message when user starts typing
    setUpdateSuccess(false);
    setUpdateError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess(false);

    try {
      // Create form data for file upload
      const formDataToSend = new FormData();
      if (formData.name !== user.name) formDataToSend.append('name', formData.name);
      if (formData.email !== user.email) formDataToSend.append('email', formData.email);
      if (formData.profile) formDataToSend.append('profile', formData.profile);

      const response = await fetch(SummaryApi.auth.updateProfile.url, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local state
      setUser(data.user);
      setAuthUser(data.user); // Update auth context
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Reset file input
      setFormData(prev => ({ ...prev, profile: null }));

      // Auto-hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      profile: null
    });
    setImagePreview(user.profile || null);
    setUpdateError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-red-500 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between animate-slideDown">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300">Profile updated successfully!</p>
            </div>
            <button onClick={() => setUpdateSuccess(false)} className="text-green-600 dark:text-green-400 hover:text-green-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Update Error Message */}
        {updateError && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between animate-slideDown">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300">{updateError}</p>
            </div>
            <button onClick={() => setUpdateError("")} className="text-red-600 dark:text-red-400 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Profile Header with Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            {/* Profile Image */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <img
                  src={imagePreview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Edit/Save Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all transform hover:scale-105"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-105"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-6 md:px-8">
            {/* User Info Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Full Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Enter your name"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white">
                    {user?.name || "Not provided"}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Email Address</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Enter your email"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white">
                    {user?.email || "Not provided"}
                  </div>
                )}
              </div>

              {/* Role Field (Read-only) */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Role</span>
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "User"}
                  </span>
                </div>
              </div>

              {/* User ID Field (Read-only) */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Key size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>User ID</span>
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <code className="text-sm text-gray-600 dark:text-gray-400 break-all">
                    {user?._id || "Not available"}
                  </code>
                </div>
              </div>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Account Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last updated:</span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                      Change Password
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                      View Activity Log
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyAccount;