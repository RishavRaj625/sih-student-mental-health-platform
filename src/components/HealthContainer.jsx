// components/HealthContainer.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const HealthContainer = () => {
  const { user, admin } = useAuth();
  const [currentMood, setCurrentMood] = useState('');
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const moods = [
    { emoji: '😄', label: 'Excellent', value: 'excellent', color: 'green', description: 'Feeling amazing and energized' },
    { emoji: '😊', label: 'Good', value: 'good', color: 'blue', description: 'Positive and optimistic' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'yellow', description: 'Balanced and steady' },
    { emoji: '😔', label: 'Low', value: 'low', color: 'orange', description: 'Feeling down but managing' },
    { emoji: '😞', label: 'Struggling', value: 'struggling', color: 'red', description: 'Having a difficult time' }
  ];

  // Check dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for ambient effects
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    setShowMoodTracker(false);
  };

  const getCurrentMoodData = () => {
    return moods.find(mood => mood.value === currentMood);
  };

  const currentMoodData = getCurrentMoodData();

  // Get current user info
  const currentUser = user || admin;
  const displayName = currentUser?.name || currentUser?.email?.split("@")[0] || "User";

  const getMoodColorClasses = (color, isActive = false) => {
    const colorMap = {
      green: isDarkMode 
        ? `${isActive ? 'bg-green-500/20 border-green-400/60' : 'border-green-400/30 hover:border-green-400/50'} hover:bg-green-500/20` 
        : `${isActive ? 'bg-green-100 border-green-500' : 'border-green-200 hover:border-green-400'} hover:bg-green-50`,
      blue: isDarkMode 
        ? `${isActive ? 'bg-blue-500/20 border-blue-400/60' : 'border-blue-400/30 hover:border-blue-400/50'} hover:bg-blue-500/20` 
        : `${isActive ? 'bg-blue-100 border-blue-500' : 'border-blue-200 hover:border-blue-400'} hover:bg-blue-50`,
      yellow: isDarkMode 
        ? `${isActive ? 'bg-yellow-500/20 border-yellow-400/60' : 'border-yellow-400/30 hover:border-yellow-400/50'} hover:bg-yellow-500/20` 
        : `${isActive ? 'bg-yellow-100 border-yellow-500' : 'border-yellow-200 hover:border-yellow-400'} hover:bg-yellow-50`,
      orange: isDarkMode 
        ? `${isActive ? 'bg-orange-500/20 border-orange-400/60' : 'border-orange-400/30 hover:border-orange-400/50'} hover:bg-orange-500/20` 
        : `${isActive ? 'bg-orange-100 border-orange-500' : 'border-orange-200 hover:border-orange-400'} hover:bg-orange-50`,
      red: isDarkMode 
        ? `${isActive ? 'bg-red-500/20 border-red-400/60' : 'border-red-400/30 hover:border-red-400/50'} hover:bg-red-500/20` 
        : `${isActive ? 'bg-red-100 border-red-500' : 'border-red-200 hover:border-red-400'} hover:bg-red-50`
    };
    return colorMap[color] || colorMap.blue;
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="flex gap-6 mb-16 mt-10 px-4 sm:px-6 lg:px-8">
      {/* Welcome/Hello Box - Left Side */}
      <div 
        className={`relative w-[65%] transition-all duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
        onMouseMove={handleMouseMove}
      >
        {/* Ambient background effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-700 opacity-30"
          style={{
            background: `
              radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
                isDarkMode
                  ? 'rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05), transparent 50%'
                  : 'rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.04), transparent 50%'
              })
            `,
          }}
        />

        {/* Welcome Card */}
        <div className={`rounded-2xl shadow-lg p-8 border-2 backdrop-blur-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col justify-center ${
          isDarkMode 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/60 border-white/40'
        }`}>
          <div className="text-center">
            <h1
              className={`text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-400 via-teal-300 to-blue-400"
                  : "from-blue-600 via-teal-600 to-blue-600"
              } bg-clip-text text-transparent animate-pulse`}
            >
              Hello, {displayName}
            </h1>

            <p
              className={`text-base lg:text-lg max-w-2xl mx-auto mb-5 leading-relaxed ${
                isDarkMode ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Your mental health matters. Access professional support, connect
              with others, and track your wellbeing journey in a safe,
              confidential space.
            </p>

            {/* Navigation buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <button
                onClick={() => scrollToSection('mental-health-features')}
                className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30"
                    : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                }`}
              >
                <span>Core Support</span>
              </button>

              <button
                onClick={() => scrollToSection('additional-features')}
                className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30"
                    : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                }`}
              >
                <span>Additional Resources</span>
              </button>
            </div>

            {/* Mental health tip */}
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isDarkMode
                  ? "bg-green-500/15 text-green-300 border border-green-400/30 hover:bg-green-500/20"
                  : "bg-green-50/80 text-green-700 border border-green-200/60 hover:bg-green-100/80"
              }`}
            >
              <span>
                Remember: Seeking help is a sign of strength, not weakness
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Check Box - Right Side */}
      <div 
        className={`relative w-[35%] transition-all duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
        onMouseMove={handleMouseMove}
      >
        {/* Ambient background effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-700 opacity-30"
          style={{
            background: `
              radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
                isDarkMode
                  ? 'rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05), transparent 50%'
                  : 'rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.04), transparent 50%'
              })
            `,
          }}
        />

        {/* Main Wellness Check Card */}
        <div className={`rounded-2xl shadow-lg p-6 border-2 backdrop-blur-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
          isDarkMode 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/60 border-white/40'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl lg:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode 
                ? 'from-blue-400 to-teal-300' 
                : 'from-blue-600 to-teal-600'
            }`}>
              Today's Wellness Check
            </h2>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isDarkMode
                ? 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <div className="flex-grow flex flex-col justify-between">
            <div className="flex flex-col items-start justify-between mb-6 gap-4">
              {currentMood ? (
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4 transition-all duration-300 shadow-lg ${
                    getMoodColorClasses(currentMoodData?.color, true)
                  }`}>
                    {currentMoodData?.emoji}
                  </div>
                  <div className="flex-1">
                    <p className={`text-base font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      You're feeling <span className={`${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>{currentMoodData?.label}</span> today
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      {currentMoodData?.description}
                    </p>
                    <small className={`text-xs ${
                      isDarkMode ? 'text-slate-500' : 'text-gray-400'
                    }`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4 border-dashed animate-pulse ${
                    isDarkMode 
                      ? 'border-slate-600/50 bg-slate-700/30' 
                      : 'border-gray-300 bg-gray-100'
                  }`}>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-gray-400'}>❓</span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-base font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      How are you feeling today?
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      Track your daily wellness and mood patterns
                    </p>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setShowMoodTracker(!showMoodTracker)}
                className={`w-full px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 focus:ring-blue-400'
                    : 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {currentMood ? '✏️ Update Mood' : '🎯 Set Mood'}
              </button>
            </div>

            {showMoodTracker && (
              <div className={`rounded-xl p-4 border transition-all duration-300 mb-4 ${
                isDarkMode 
                  ? 'bg-slate-700/30 border-slate-600/50' 
                  : 'bg-gray-50/80 border-gray-200'
              }`}>
                <h3 className={`text-base font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Select your current mood:
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`p-2 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md group ${
                        getMoodColorClasses(mood.color)
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1 transition-transform duration-300 group-hover:scale-110">
                          {mood.emoji}
                        </div>
                        <div className={`font-semibold text-xs mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-700'
                        }`}>
                          {mood.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wellness Stats */}
            <div className="grid grid-cols-3 gap-3 mt-auto">
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-blue-500/10 border border-blue-400/20'
                  : 'bg-blue-50 border border-blue-100'
              }`}>
                <div className={`text-xl font-bold mb-1 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>7</div>
                <div className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Days Active</div>
              </div>
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-green-500/10 border border-green-400/20'
                  : 'bg-green-50 border border-green-100'
              }`}>
                <div className={`text-xl font-bold mb-1 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>3</div>
                <div className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Sessions This Week</div>
              </div>
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-purple-500/10 border border-purple-400/20'
                  : 'bg-purple-50 border border-purple-100'
              }`}>
                <div className={`text-xl font-bold mb-1 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>85%</div>
                <div className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Wellness Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthContainer;