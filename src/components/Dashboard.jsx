// components/Dashboard.jsx - Enhanced with Loading Animation
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import HealthContainer from "./HealthContainer";
import { useAuth } from "../context/AuthContext";

// Beautiful Loading Screen Component
const DashboardLoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("Welcome back!");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messages = [
      "Welcome back!",
      "Preparing your dashboard...",
      "Loading mental health resources...",
      "Almost ready!"
    ];
    
    let messageIndex = 0;
    let progressValue = 0;
    
    const textInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingText(messages[messageIndex]);
    }, 400);
    
    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 15;
      if (progressValue > 100) progressValue = 100;
      setProgress(progressValue);
    }, 100);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-8">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-pulse shadow-lg"></div>
          <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>

        {/* Main Loading Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          <div className="absolute inset-4 border-2 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
        </div>

        {/* Loading Text with Typewriter Effect */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 h-8">
          {loadingText}
        </h2>
        
        <p className="text-gray-600 mb-8">
          Setting up your personalized experience
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-out relative"
            style={{width: `${progress}%`}}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
          </div>
        </div>

        {/* Feature Icons Animation */}
        <div className="flex justify-center space-x-4 mb-8">
          {['🤖', '🏥', '💝', '📚'].map((icon, index) => (
            <div
              key={index}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce text-xl"
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: '1s'
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, admin, isAuthenticated, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // New state for dashboard loading animation
  const [showDashboardLoading, setShowDashboardLoading] = useState(true);
  const [dashboardReady, setDashboardReady] = useState(false);
  
  // Feature loading state
  const [loadingFeature, setLoadingFeature] = useState(null);
  const [isFeatureLoading, setIsFeatureLoading] = useState(false);

  // Dashboard loading effect
  useEffect(() => {
    // Only show loading animation when user is authenticated
    if (!loading && isAuthenticated()) {
      const loadingTimer = setTimeout(() => {
        setShowDashboardLoading(false);
        // Small delay for smooth transition
        setTimeout(() => setDashboardReady(true), 200);
      }, 1800); // 1.8 seconds loading time

      return () => clearTimeout(loadingTimer);
    } else if (!loading && !isAuthenticated()) {
      // Skip loading animation if not authenticated
      setShowDashboardLoading(false);
    }
  }, [loading, isAuthenticated]);

  // Debug authentication state
  useEffect(() => {
    console.log("Dashboard Auth Debug:", {
      user,
      admin,
      loading,
      isAuthenticated: isAuthenticated(),
      isAdmin: isAdmin(),
      token: localStorage.getItem("token"),
    });
  }, [user, admin, loading, isAuthenticated, isAdmin]);

  // Authentication check and redirect
  useEffect(() => {
    // Wait for auth context to finish loading
    if (loading) {
      console.log("Auth context still loading...");
      return;
    }

    // Check authentication
    const authenticated = isAuthenticated();
    console.log("Authentication check result:", authenticated);

    if (!authenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }

    console.log("User authenticated successfully");
  }, [loading, isAuthenticated, navigate]);

  // Core Mental Health Features
  const coreMentalHealthFeatures = [
    {
      id: "ai-chat",
      title: "AI Mental Health Chat",
      description:
        "Get instant support and guidance from our AI counselor with personalized responses",
      icon: "🤖",
      color: "blue",
      route: "/ai-chat",
      category: "immediate-support",
    },
    {
      id: "crisis-help",
      title: "Crisis Support",
      description:
        "Immediate help and emergency contact resources when you need them most",
      icon: "🚨",
      color: "red",
      route: "/crisis-help",
      category: "immediate-support",
    },
    
    {
      id: "peer-support",
      title: "Peer Support Groups",
      description:
        "Connect with others who understand your journey in a safe, moderated environment",
      icon: "👥",
      color: "purple",
      route: "/peer-support",
      category: "community",
    },
    {
      id: "find-doctor",
      title: "Find Nearest Doctor",
      description:
        "AI-powered search to find the best doctors and specialists near you",
      icon: "🏥",
      color: "blue",
      route: "/find-doctor",
      category: "healthcare",
    },
    {
      id: "booking",
      title: "Book Counselor",
      description:
        "Schedule appointments with licensed mental health professionals",
      icon: "📅",
      color: "green",
      route: "/booking",
      category: "professional-help",
    },
  ];

  // Additional Mental Health Features
  const additionalMentalHealthFeatures = [
    {
      id: "wellness-check",
      title: "Wellness Check-in",
      description:
        "Track your daily mood, mental wellness, and personal growth journey",
      icon: "💝",
      color: "pink",
      route: "/wellness-check",
      category: "self-care",
    },
    
    {
      id: "resources",
      title: "Mental Health Resources",
      description:
        "Access evidence-based articles, videos, and self-help materials",
      icon: "📚",
      color: "indigo",
      route: "/resources",
      category: "education",
    },
  ];

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("mental-health-features");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToAdditionalFeatures = () => {
    const additionalSection = document.getElementById("additional-features");
    if (additionalSection) {
      additionalSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "border-blue-500 hover:border-blue-600 hover:shadow-blue-100 bg-gradient-to-br from-blue-50 to-blue-100",
      green:
        "border-green-500 hover:border-green-600 hover:shadow-green-100 bg-gradient-to-br from-green-50 to-green-100",
      red: "border-red-500 hover:border-red-600 hover:shadow-red-100 bg-gradient-to-br from-red-50 to-red-100",
      purple:
        "border-purple-500 hover:border-purple-600 hover:shadow-purple-100 bg-gradient-to-br from-purple-50 to-purple-100",
      pink: "border-pink-500 hover:border-pink-600 hover:shadow-pink-100 bg-gradient-to-br from-pink-50 to-pink-100",
      indigo:
        "border-indigo-500 hover:border-indigo-600 hover:shadow-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getDarkColorClasses = (color) => {
    const colorMap = {
      blue: "border-blue-400/30 hover:border-blue-400/50 bg-gradient-to-br from-blue-900/20 to-blue-800/30",
      green:
        "border-green-400/30 hover:border-green-400/50 bg-gradient-to-br from-green-900/20 to-green-800/30",
      red: "border-red-400/30 hover:border-red-400/50 bg-gradient-to-br from-red-900/20 to-red-800/30",
      purple:
        "border-purple-400/30 hover:border-purple-400/50 bg-gradient-to-br from-purple-900/20 to-purple-800/30",
      pink: "border-pink-400/30 hover:border-pink-400/50 bg-gradient-to-br from-pink-900/20 to-pink-800/30",
      indigo:
        "border-indigo-400/30 hover:border-indigo-400/50 bg-gradient-to-br from-indigo-900/20 to-indigo-800/30",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getButtonColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
      pink: "bg-pink-600 hover:bg-pink-700 focus:ring-pink-500",
      indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleFeatureClick = (route, featureId) => {
    // Set loading state for the clicked feature
    setLoadingFeature(featureId);
    setIsFeatureLoading(true);
    
    // Add 1 second delay before navigation
    setTimeout(() => {
      navigate(route);
      // Reset loading state (though component will unmount)
      setLoadingFeature(null);
      setIsFeatureLoading(false);
    }, 1000);
  };

  // Show dashboard loading animation
  if (showDashboardLoading && !loading && isAuthenticated()) {
    return <DashboardLoadingScreen />;
  }

  // Show auth loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (redirect will happen)
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Get current user info
  const currentUser = user || admin;
  const displayName =
    currentUser?.name || currentUser?.email?.split("@")[0] || "User";

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        dashboardReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
          : "bg-gradient-to-br from-slate-50 via-white to-gray-50"
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced animated background with cursor following effect */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `
            radial-gradient(1200px circle at ${mousePosition.x}% ${
            mousePosition.y
          }%, ${
            isDarkMode
              ? "rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.04), transparent 60%"
              : "rgba(59, 130, 246, 0.06), rgba(16, 185, 129, 0.03), transparent 60%"
          }),
            ${
              isDarkMode
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 50%, rgba(248, 250, 252, 0.9) 100%)"
            }
          `,
        }}
      />

      {/* Enhanced floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float opacity-40 ${
              isDarkMode ? "bg-blue-400/60" : "bg-blue-500/50"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <Navbar />
      <HealthContainer />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Mental Health Features Section */}
        <div className="mb-20" id="mental-health-features">
          <div className="text-center mb-12">
            <h2
              className={`text-4xl font-bold mb-4 bg-gradient-to-r cursor-pointer hover:scale-105 transition-transform duration-300 ${
                isDarkMode
                  ? "from-blue-400 via-teal-300 to-blue-400"
                  : "from-blue-600 via-teal-600 to-blue-600"
              } bg-clip-text text-transparent`}
            >
              Core Mental Health Support
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto mb-4 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Essential tools for your mental health and wellbeing journey
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {coreMentalHealthFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`health-card rounded-xl shadow-md p-8 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  isDarkMode
                    ? getDarkColorClasses(feature.color)
                    : getColorClasses(feature.color)
                } ${dashboardReady ? 'animate-slideInUp' : ''} ${
                  loadingFeature === feature.id ? 'scale-95 opacity-50' : ''
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                onClick={() => handleFeatureClick(feature.route, feature.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 card-icon transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-2xl font-semibold mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`mb-6 text-base leading-relaxed ${
                      isDarkMode ? "text-slate-300" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                  <button
                    className={`w-full text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${getButtonColorClasses(
                      feature.color
                    )} ${loadingFeature === feature.id ? 'opacity-50' : ''}`}
                    disabled={isFeatureLoading}
                  >
                    {loadingFeature === feature.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      'Access Now'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mb-20" id="additional-features">
          <div className="text-center mb-12">
            <h2
              className={`text-4xl font-bold mb-4 bg-gradient-to-r cursor-pointer hover:scale-105 transition-transform duration-300 ${
                isDarkMode
                  ? "from-purple-400 via-pink-300 to-purple-400"
                  : "from-purple-600 via-pink-600 to-purple-600"
              } bg-clip-text text-transparent`}
            >
              Additional Resources
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto mb-4 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Extended support and educational resources for comprehensive care
            </p>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {additionalMentalHealthFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`health-card rounded-xl shadow-md p-8 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  isDarkMode
                    ? getDarkColorClasses(feature.color)
                    : getColorClasses(feature.color)
                } ${dashboardReady ? 'animate-slideInUp' : ''} ${
                  loadingFeature === feature.id ? 'scale-95 opacity-50' : ''
                }`}
                style={{
                  animationDelay: `${(index + 5) * 100}ms`
                }}
                onClick={() => handleFeatureClick(feature.route, feature.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 card-icon transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-2xl font-semibold mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`mb-6 text-base leading-relaxed ${
                      isDarkMode ? "text-slate-300" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                  <button
                    className={`w-full text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${getButtonColorClasses(
                      feature.color
                    )} ${loadingFeature === feature.id ? 'opacity-50' : ''}`}
                    disabled={isFeatureLoading}
                  >
                    {loadingFeature === feature.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      'Explore'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Section - Show for both user admins and actual admins */}
        {(isAdmin() || currentUser?.isAdmin) && (
          <div className="mb-20">
            <div
              className={`rounded-xl shadow-md p-6 border-2 border-yellow-500 ${
                isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
              } ${dashboardReady ? 'animate-slideInUp' : ''}`}
              style={{
                animationDelay: '800ms'
              }}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-yellow-300" : "text-yellow-800"
                }`}
              >
                Admin Quick Access
              </h2>
              <div
                className={`rounded-lg p-6 border cursor-pointer hover:shadow-md transition-shadow ${
                  isDarkMode
                    ? "bg-yellow-900/30 border-yellow-400/30 hover:bg-yellow-900/40"
                    : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100"
                }`}
                onClick={() => navigate("/admin/dashboard")}
              >
                <div className="text-3xl mb-2">⚙️</div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDarkMode ? "text-yellow-200" : "text-gray-800"
                  }`}
                >
                  Admin Dashboard
                </h3>
                <p
                  className={`mb-2 text-sm ${
                    isDarkMode ? "text-yellow-300" : "text-gray-600"
                  }`}
                >
                  Manage users, view analytics, and system settings
                </p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                  Open Admin Panel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay for Feature Navigation */}
      {isFeatureLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Opening Feature</h3>
            <p className="text-gray-600">Please wait while we prepare your experience...</p>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-lg backdrop-blur-lg border transition-all duration-300 hover:scale-110 z-50 ${
          isDarkMode
            ? "bg-slate-800/80 border-slate-700/50 text-blue-400 hover:bg-slate-700/80"
            : "bg-white/80 border-white/60 text-blue-600 hover:bg-white/90"
        }`}
      >
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

// Enhanced custom animations with new slide-in effects
if (!document.querySelector("#mental-health-dashboard-animations")) {
  const style = document.createElement("style");
  style.id = "mental-health-dashboard-animations";
  style.textContent = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
        opacity: 0.4;
      }
      33% { 
        transform: translateY(-15px) rotate(120deg); 
        opacity: 0.6;
      }
      66% { 
        transform: translateY(-8px) rotate(240deg); 
        opacity: 0.5;
      }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-slideInUp {
      animation: slideInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    
    /* Card hover effects */
    .health-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .health-card:hover {
      transform: translateY(-12px) scale(1.03);
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    }
    
    .health-card:hover .card-icon {
      transform: scale(1.1) rotate(5deg);
    }

    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(style);
}

export default Dashboard;