import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enhanced state management
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  // Mock notifications for mental health context
  const [notifications] = useState([
    { id: 1, type: 'appointment', message: 'Upcoming session with Dr. Smith in 2 hours', time: '2 hours', unread: true },
    { id: 2, type: 'wellness', message: 'Daily wellness check reminder', time: '4 hours', unread: true },
    { id: 3, type: 'resource', message: 'New mindfulness resources available', time: '1 day', unread: false },
  ]);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/ai-chat', label: 'AI Support', icon: '🤖' },
      { path: '/booking', label: 'Book Session', icon: '📅' },
      { path: '/resources', label: 'Resources', icon: '📚' },
      { path: '/wellness-check', label: 'Wellness', icon: '💚' },
      { path: '/peer-support', label: 'Community', icon: '👥' },
    ];

    if (user?.isAdmin) {
      return [...commonItems, { path: '/admin-dashboard', label: 'Admin Panel', icon: '⚙️' }];
    }

    return commonItems;
  };

  useEffect(() => {
    // Apply saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Mouse tracking for gradient effects
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    // Click outside handler
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const navbar = document.querySelector('.mental-health-navbar');
    navbar?.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      navbar?.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      setIsSearchMode(false);
      setSearchQuery('');
    }
  };

  const isActivePath = (path) => location.pathname === path;

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className={`mental-health-navbar relative backdrop-blur-xl border-b transition-all duration-500 z-40 ${
      isDarkMode 
        ? 'bg-slate-900/95 border-slate-700/50 text-white' 
        : 'bg-white/95 border-purple-200/50 text-slate-800'
    }`}>
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
            isDarkMode
              ? 'rgba(139, 69, 197, 0.15), rgba(79, 70, 229, 0.1), rgba(59, 130, 246, 0.08)'
              : 'rgba(139, 69, 197, 0.08), rgba(79, 70, 229, 0.06), rgba(99, 102, 241, 0.05)'
          }, transparent 60%)`,
        }}
      />

      {/* Subtle pulse animation */}
      <div className={`absolute inset-0 opacity-20 animate-pulse pointer-events-none ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10'
          : 'bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-blue-500/5'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className={`relative w-12 h-12 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
              isDarkMode
                ? 'bg-purple-500/20 border border-purple-400/30 shadow-lg shadow-purple-500/20'
                : 'bg-purple-100/80 border border-purple-300/50 shadow-lg shadow-purple-500/10'
            }`}>
              <div className={`absolute inset-0 rounded-xl animate-ping opacity-20 ${
                isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
              }`} style={{ animationDuration: '3s' }} />
              <span className="text-2xl relative z-10">🧠</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-all duration-300 group-hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent'
              }`}>
                MindCare
              </h1>
              <div className={`text-xs mt-0.5 opacity-60 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Mental Wellness Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {getNavigationItems().slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? isDarkMode
                      ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'bg-purple-100 text-purple-700 shadow-lg shadow-purple-500/10'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block">
              {!isSearchMode ? (
                <button
                  onClick={() => setIsSearchMode(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105 group ${
                    isDarkMode
                      ? 'bg-purple-500/10 border border-purple-400/30 hover:bg-purple-500/20'
                      : 'bg-purple-50/80 border border-purple-200/50 hover:bg-purple-100/80'
                  }`}
                >
                  <span className="text-sm font-medium">Search resources...</span>
                  <svg className="w-4 h-4 opacity-40 group-hover:opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              ) : (
                <form onSubmit={handleSearch} className={`relative backdrop-blur-xl rounded-full transition-all duration-300 shadow-xl ${
                  isDarkMode
                    ? 'bg-slate-800/90 border border-purple-400/30'
                    : 'bg-white/90 border border-purple-200/50'
                }`}>
                  <div className="flex items-center px-4 py-2">
                    <svg className={`w-4 h-4 mr-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search mental health resources..."
                      className="bg-transparent outline-none text-sm flex-1 placeholder-opacity-60 min-w-64"
                      onBlur={() => !searchQuery && setIsSearchMode(false)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchMode(false)}
                      className={`ml-3 w-6 h-6 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100/50'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative w-10 h-10 rounded-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50'
                    : 'bg-white/50 border border-purple-200/50 hover:bg-purple-50/50'
                }`}
              >
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-4.03-4.03A9.95 9.95 0 0018 8c0-5.52-4.48-10-10-10S-2 2.48-2 8a9.95 9.95 0 001.03 4.97L-5 17h5m10 0v1a3 3 0 01-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{unreadCount}</span>
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className={`absolute top-12 right-0 w-80 rounded-2xl backdrop-blur-xl border shadow-2xl z-50 ${
                  isDarkMode
                    ? 'bg-slate-800/98 border-slate-700/50'
                    : 'bg-white/98 border-purple-200/50'
                }`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Notifications</h3>
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100/50'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-xl transition-colors ${
                          notification.unread
                            ? isDarkMode ? 'bg-purple-500/10 border border-purple-400/30' : 'bg-purple-50 border border-purple-200/50'
                            : isDarkMode ? 'bg-slate-700/30' : 'bg-slate-50'
                        }`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                          }`}>
                            {notification.type === 'appointment' && '📅'}
                            {notification.type === 'wellness' && '💚'}
                            {notification.type === 'resource' && '📚'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{notification.message}</p>
                            <p className={`text-xs mt-1 opacity-60 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              {notification.time} ago
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 group ${
                isDarkMode
                  ? 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50'
                  : 'bg-white/50 border border-purple-200/50 hover:bg-purple-50/50'
              }`}
            >
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50'
                    : 'bg-white/50 border border-purple-200/50 hover:bg-purple-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <span className="text-sm font-bold">
                    {(user?.name || user?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">
                    {user?.name || user?.email?.split('@')[0]}
                  </div>
                  {user?.isAdmin && (
                    <div className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      Administrator
                    </div>
                  )}
                </div>
                <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className={`absolute top-12 right-0 w-64 rounded-2xl backdrop-blur-xl border shadow-2xl z-50 ${
                  isDarkMode
                    ? 'bg-slate-800/98 border-slate-700/50'
                    : 'bg-white/98 border-purple-200/50'
                }`}>
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200/20">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                      }`}>
                        <span className="text-lg font-bold">
                          {(user?.name || user?.email || '').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{user?.name || user?.email?.split('@')[0]}</div>
                        <div className={`text-sm opacity-60 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                          isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                        }`}
                      >
                        <span>👤</span>
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        to="/preferences"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                          isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                        }`}
                      >
                        <span>⚙️</span>
                        <span>Preferences</span>
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                            isDarkMode ? 'hover:bg-slate-700/50 text-purple-400' : 'hover:bg-purple-50 text-purple-700'
                          }`}
                        >
                          <span>⚙️</span>
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <hr className={`my-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors text-left ${
                          isDarkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isDarkMode
                  ? 'bg-slate-700/50 border border-slate-600/50'
                  : 'bg-white/50 border border-purple-200/50'
              }`}
            >
              <div className="relative">
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`} />
                <div className={`w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <div className={`w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99999]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Content */}
              <div className={`absolute top-16 right-4 w-96 max-w-[calc(100vw-2rem)] mt-2 rounded-2xl backdrop-blur-xl border shadow-2xl max-h-[80vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-slate-900/98 border-slate-700/50 text-white'
              : 'bg-white/98 border-purple-200/50 text-slate-800'
          }`}>
            <div className="p-4 space-y-3">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-purple-500/20 border border-purple-400/30'
                      : 'bg-purple-100 border border-purple-200'
                  }`}>
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Navigation Menu</div>
                    <div className={`text-xs opacity-60 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Access all features
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white'
                      : 'hover:bg-slate-100/50 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="mb-4">
                <form onSubmit={handleSearch} className={`flex items-center px-4 py-3 rounded-xl backdrop-blur-xl transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-purple-400/30'
                    : 'bg-white/50 border border-purple-200/50'
                }`}>
                  <svg className={`w-4 h-4 mr-3 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="bg-transparent outline-none text-sm flex-1 placeholder-opacity-60"
                  />
                </form>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {getNavigationItems().map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActivePath(item.path)
                        ? isDarkMode
                          ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
                          : 'bg-purple-100 text-purple-700 shadow-lg shadow-purple-500/10'
                        : isDarkMode
                          ? 'hover:bg-slate-700/50 active:bg-slate-600/50'
                          : 'hover:bg-purple-50 active:bg-purple-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActivePath(item.path)
                        ? isDarkMode
                          ? 'bg-purple-500/30 text-purple-200 group-hover:scale-105'
                          : 'bg-purple-200 text-purple-800 group-hover:scale-105'
                        : isDarkMode
                          ? 'bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30 group-hover:scale-105'
                          : 'bg-purple-100 text-purple-700 group-hover:bg-purple-200 group-hover:scale-105'
                    }`}>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs opacity-60">
                        {item.path === '/dashboard' && 'Your personal overview'}
                        {item.path === '/ai-chat' && 'AI-powered mental health support'}
                        {item.path === '/booking' && 'Schedule therapy sessions'}
                        {item.path === '/resources' && 'Educational materials'}
                        {item.path === '/wellness-check' && 'Daily wellness tracking'}
                        {item.path === '/peer-support' && 'Connect with community'}
                        {item.path === '/admin-dashboard' && 'Administrative controls'}
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {isActivePath(item.path) && (
                        <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                          isDarkMode
                            ? 'bg-purple-400/30 text-purple-200'
                            : 'bg-purple-200 text-purple-800'
                        }`}>
                          Active
                        </div>
                      )}
                      <svg className="w-4 h-4 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className={`mt-6 pt-4 border-t ${
                isDarkMode ? 'border-slate-700/50' : 'border-purple-200/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                    }`} />
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      System Online
                    </span>
                  </div>
                  <div className={`text-xs opacity-60 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {getNavigationItems().length} features available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;