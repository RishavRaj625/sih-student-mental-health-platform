// context/AuthContext.jsx - FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API base URL - adjust this to match your FastAPI server
const API_BASE_URL = 'http://localhost:8000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        const savedAdmin = localStorage.getItem('admin');
        
        console.log('Initializing auth...', { savedToken: !!savedToken, savedUser: !!savedUser, savedAdmin: !!savedAdmin });
        
        if (savedToken) {
          setToken(savedToken);
          
          // Try to verify the token by fetching user/admin info
          try {
            if (savedUser) {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              
              // Verify user token is still valid
              const response = await fetch(`${API_BASE_URL}/me`, {
                headers: { 'Authorization': `Bearer ${savedToken}` }
              });
              
              if (!response.ok) {
                throw new Error('Token expired');
              }
              
              const currentUser = await response.json();
              setUser(currentUser);
              localStorage.setItem('user', JSON.stringify(currentUser));
              
            } else if (savedAdmin) {
              const adminData = JSON.parse(savedAdmin);
              setAdmin(adminData);
              
              // Verify admin token is still valid
              const response = await fetch(`${API_BASE_URL}/admin/me`, {
                headers: { 'Authorization': `Bearer ${savedToken}` }
              });
              
              if (!response.ok) {
                throw new Error('Admin token expired');
              }
              
              const currentAdmin = await response.json();
              setAdmin(currentAdmin);
              localStorage.setItem('admin', JSON.stringify(currentAdmin));
            }
          } catch (error) {
            console.log('Token verification failed, clearing auth:', error.message);
            // Token is invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('admin');
            setToken(null);
            setUser(null);
            setAdmin(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Helper function to make API requests with token
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`, { method: config.method || 'GET' });
      
      const response = await fetch(url, config);
      
      console.log(`API response for ${endpoint}:`, { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          console.error(`API error for ${endpoint}:`, data);
          throw new Error(data.detail || `HTTP error! status: ${response.status}`);
        }
        
        return data;
      } else {
        if (!response.ok) {
          const text = await response.text();
          console.error(`API error for ${endpoint}:`, text);
          throw new Error(`HTTP error! status: ${response.status} - ${text}`);
        }
        return await response.text();
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Handle network errors specifically
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  };

  // Login function for regular users
  const login = async (email, password) => {
    try {
      console.log('Attempting user login for:', email);
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status, response.statusText);

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.detail || 'Login failed');
      }

      console.log('Login successful:', { user: data.user?.name, email: data.user?.email });

      // Store token and user data
      setToken(data.access_token);
      setUser(data.user);
      setAdmin(null); // Clear admin if exists
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('admin'); // Clear admin storage

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Admin login function
  const adminLogin = async (email, password) => {
    try {
      console.log('Attempting admin login for:', email);
      console.log('API endpoint:', `${API_BASE_URL}/admin/login`);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Admin login response:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok 
      });

      const data = await response.json();
      console.log('Admin login response data:', data);

      if (!response.ok) {
        console.error('Admin login failed:', data);
        throw new Error(data.detail || 'Admin login failed');
      }

      console.log('Admin login successful:', { 
        admin: data.admin?.name, 
        email: data.admin?.email,
        token: data.access_token ? 'present' : 'missing' 
      });

      // Store token and admin data
      setToken(data.access_token);
      setAdmin(data.admin);
      setUser(null); // Clear user if exists
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      localStorage.removeItem('user'); // Clear user storage

      return { success: true, admin: data.admin };
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Network error')) {
        return { success: false, error: 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000' };
      }
      
      return { success: false, error: error.message };
    }
  };

  // Signup function
  const signup = async (email, password, name) => {
    try {
      console.log('Attempting user signup...');
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      console.log('Signup response:', { success: response.ok, data: response.ok ? data : 'Error' });

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Store token and user data
      setToken(data.access_token);
      setUser(data.user);
      setAdmin(null); // Clear admin if exists
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('admin'); // Clear admin storage

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get current user info
  const getCurrentUser = async () => {
    try {
      const data = await apiRequest('/me');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get current admin info
  const getCurrentAdmin = async () => {
    try {
      const data = await apiRequest('/admin/me');
      setAdmin(data);
      localStorage.setItem('admin', JSON.stringify(data));
      return { success: true, admin: data };
    } catch (error) {
      console.error('Get current admin error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get dashboard data
  const getDashboardData = async () => {
    try {
      const data = await apiRequest('/dashboard');
      return { success: true, data };
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get admin dashboard data
  const getAdminDashboardData = async () => {
    try {
      const data = await apiRequest('/admin/dashboard');
      return { success: true, data };
    } catch (error) {
      console.error('Get admin dashboard data error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update profile
  const updateProfile = async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile?name=${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Profile update failed');
      }

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Admin functions
  const adminActions = {
    // Get all users
    getAllUsers: async (sortBy = 'created_at', sortOrder = 'desc') => {
      try {
        const data = await apiRequest(`/admin/users?sort_by=${sortBy}&sort_order=${sortOrder}`);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get activities
    getActivities: async (filter = 'all', timeRange = '24h') => {
      try {
        const data = await apiRequest(`/admin/activities?filter=${filter}&time_range=${timeRange}`);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Activate user
    activateUser: async (userId) => {
      try {
        const data = await apiRequest(`/admin/users/${userId}/activate`, { method: 'POST' });
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Deactivate user
    deactivateUser: async (userId) => {
      try {
        const data = await apiRequest(`/admin/users/${userId}/deactivate`, { method: 'POST' });
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Delete user
    deleteUser: async (userId) => {
      try {
        const data = await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get user details
    getUserDetails: async (userId) => {
      try {
        const data = await apiRequest(`/admin/users/${userId}`);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  };

  // Logout function
  const logout = () => {
    console.log('Logging out...');
    setUser(null);
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const authenticated = !!(token && (user || admin));
    console.log('Auth check:', { token: !!token, user: !!user, admin: !!admin, authenticated });
    return authenticated;
  };

  // Check if current user is admin
  const isAdmin = () => {
    const adminStatus = !!(admin && token);
    console.log('Admin check:', { admin: !!admin, token: !!token, isAdmin: adminStatus });
    return adminStatus;
  };

  const value = {
    user,
    admin,
    token,
    login,
    adminLogin,
    signup,
    logout,
    loading,
    isAuthenticated,
    isAdmin,
    getCurrentUser,
    getCurrentAdmin,
    getDashboardData,
    getAdminDashboardData,
    updateProfile,
    adminActions,
    apiRequest, // Expose for custom API calls
  };

  console.log('AuthProvider rendering:', { 
    loading, 
    user: !!user, 
    admin: !!admin, 
    token: !!token,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin()
  });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};