// components/FeatureViewer.jsx - Enhanced with Loading Effect
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="relative">
      {/* Animated logo/brand container */}
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
        </div>
      </div>
      
      {/* Loading spinner */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">Welcome back!</p>
        <p className="text-sm text-gray-500">Preparing your dashboard...</p>
        
        {/* Loading dots animation */}
        <div className="flex justify-center mt-3 space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  </div>
);

const FeatureViewer = ({ title, children, showBackButton = true, showLoadingOnMount = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(showLoadingOnMount);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showLoadingOnMount) {
      // Simulate loading time (1-2 seconds as requested)
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        // Small delay before showing content for smooth transition
        setTimeout(() => setIsVisible(true), 100);
      }, 1500); // 1.5 seconds loading time

      return () => clearTimeout(loadingTimer);
    } else {
      setIsVisible(true);
    }
  }, [showLoadingOnMount]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show main content with fade-in animation
  return (
    <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Single Navbar - this is the only place it should appear */}
      <Navbar />
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 animate-fadeInUp">{title}</h1>
        </div>
       
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg animate-fadeInUp">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeatureViewer;