import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Zap, Heart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Register from '../../components/auth/RegiterUser';
import Login from '../../components/auth/LoginUser';
import { useAuth } from '../../context/AuthContext';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: Sparkles, text: 'Discover amazing places' },
    { icon: Shield, text: 'Secure bookings' },
    { icon: Zap, text: 'Instant confirmation' },
    { icon: Heart, text: 'Save your favorites' },
  ];

  const handleSwitchToLogin = () => setIsLogin(true);
  const handleSwitchToRegister = () => setIsLogin(false);
  
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add your forgot password logic here
  };

  const handleLogout = async () => {
    await logout();
    // Optionally show a success message
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  // If user is already authenticated, show the already logged in message
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-10 h-10 text-green-500 dark:text-green-400" 
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

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                You're Already Logged In!
              </h2>
              
              {/* User Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  Logged in as:
                </p>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {user.name || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email || ''}
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You are already authenticated. Would you like to continue to the home page or logout?
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoToHome}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors transform hover:scale-105 active:scale-95"
                >
                  Go to Home Page
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full py-3 border-2 border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors transform hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>

              {/* Optional: Add a different account link */}
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Want to use a different account?{' '}
                <button
                  onClick={handleLogout}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                  Logout first
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                You were redirected here because you're already authenticated.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show the normal login/signup page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Branding & Features */}
          <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Welcome to Pixora
              </h1>
              <p className="text-purple-100 text-lg mb-8">
                Your gateway to unforgettable experiences and amazing adventures.
              </p>
              
              {/* Features List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial/Quote */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <p className="text-white/90 italic">
                  "Pixora made my vacation absolutely perfect! The booking process was seamless and the recommendations were spot-on."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center">
                    <span className="text-purple-800 font-semibold">JD</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-purple-200 text-sm">Happy Traveler</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            {/* Form Container with Animation */}
            <div className="transition-all duration-500 ease-in-out">
              {isLogin ? (
                <Login 
                  onSwitchToRegister={handleSwitchToRegister}
                  onForgotPassword={handleForgotPassword}
                />
              ) : (
                <Register onSwitchToLogin={handleSwitchToLogin} />
              )}
            </div>

           
          

            {/* Terms and Privacy */}
            <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;