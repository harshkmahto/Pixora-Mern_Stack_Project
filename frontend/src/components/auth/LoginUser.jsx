import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../../common";
import apiRequest from "../../utils/apiRequest";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed

const Login = ({ onSwitchToRegister, onForgotPassword }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Get setUser from auth context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
        SummaryApi.auth.login,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Set user in auth context
      setUser(response.user);
      
      // Show success message
      alert(response.message);
      
      // Set login success state
      setLoginSuccess(true);
      
      // Clear any existing errors
      setErrors({});

      // Start the 3-second countdown before refresh and navigation
      setTimeout(() => {
        // Refresh the page
        window.location.reload();
        
        // After refresh, navigate to home
        // Note: The navigation after refresh will happen through the router
        // We can set a session storage flag to indicate successful login
        sessionStorage.setItem('loginSuccess', 'true');
        
        // Navigate to home
        navigate('/', { replace: true });
      }, 3000);

    } catch (error) {
      setErrors({ general: error.message });
      setIsLoading(false);
    }
  };

  // Show success message if login was successful
  if (loginSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-green-500 dark:text-green-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Login Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You have successfully signed in. Redirecting you to the home page...
          </p>
          
          {/* Progress bar for visual feedback */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-green-500 h-2 rounded-full animate-progress"
              style={{
                animation: 'progress 3s linear forwards'
              }}
            />
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Please wait while we refresh the page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to continue your journey
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {errors.general}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
              } focus:outline-none focus:ring-2`}
              placeholder="john@example.com"
              disabled={isLoading}
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
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.password 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
              } focus:outline-none focus:ring-2`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={isLoading}
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

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </form>

      {/* Add the animation style */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;