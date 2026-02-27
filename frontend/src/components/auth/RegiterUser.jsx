import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiRequest(
        SummaryApi.auth.register,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(response.message);
      onSwitchToLogin();

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Join us to start your journey
        </p>
      </div>

      {errors.general && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-2.5"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-purple-600 font-medium"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;