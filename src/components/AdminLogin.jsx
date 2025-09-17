// components/AdminLogin.jsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  const { adminLogin, isAuthenticated, isAdmin, admin } = useAuth();
  const navigate = useNavigate();

  // Debug: Log auth state changes
  useEffect(() => {
    const debugState = {
      isAuthenticated: isAuthenticated(),
      isAdmin: isAdmin(),
      admin: admin,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(debugState);
    console.log('AdminLogin - Auth state changed:', debugState);
    
    // Redirect if already authenticated as admin
    if (isAuthenticated() && isAdmin()) {
      console.log('Already authenticated as admin, redirecting...');
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, isAdmin, admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Admin login form submitted:', { email, password: '***' });

    try {
      const result = await adminLogin(email, password);
      console.log('Admin login result:', result);
      
      if (result.success) {
        console.log('Admin login successful, navigating to dashboard...');
        navigate('/admin-dashboard');
      } else {
        setError(result.error || 'Admin login failed');
        console.error('Admin login failed:', result.error);
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      setError('An unexpected error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
      
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the admin dashboard
            </p>
          </div>

        
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in as Admin'
                )}
              </button>
            </div>
          </form>

          {/* Test Credentials Display */}
          {/* <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Test Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Default:</strong> admin@example.com / #Admin@123</div>
              <div><strong>Alt:</strong> admin@yourdomain.com / SecureAdminPassword123!@#</div>
            </div>
          </div> */}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Back to User Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminLogin;
